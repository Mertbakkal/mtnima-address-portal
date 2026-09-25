import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapToolRail } from '../components/map/MapToolRail';
import { MapZoomControl } from '../components/map/MapZoomControl';
import { AddressMarker } from '../components/map/AddressMarker';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { SearchGeocodeButton } from './SearchGeocodeModal';
import {
  CELL_SIZE_DEG,
  getCellAt,
  getGridLineCoords,
  GRID_MIN_ZOOM,
  GRID_WORLD_BOUNDS,
  rowColFromLatLon,
} from '../data/geocodeSearch';
import { pointInPolygon } from '../data/taskMissionWizard';
import { buildRoadAddresses, type RoadAddress } from '../data/roadAddresses';
import type { ToolId } from './AppShell';

const RAIL_TOOL_DEFS = [
  { id: 'star', iconName: 'rail-star', label: 'Favorites' },
  { id: 'info', iconName: 'rail-info', label: 'Info' },
  { id: 'pan', iconName: 'rail-pan', label: 'Pan' },
  { id: 'clear', iconName: 'rail-clear', label: 'Clear' },
  { id: 'satellite', iconName: 'rail-satellite', label: 'Satellite' },
  { id: 'locate', iconName: 'rail-locate', label: 'Locate' },
  { id: 'extent', iconName: 'rail-extent', label: 'Extent' },
  { id: 'measure', iconName: 'rail-measure', label: 'Measure' },
  { id: 'cloud', iconName: 'rail-cloud', label: 'Cloud' },
  { id: 'target', iconName: 'rail-target', label: 'Target' },
] as const;

/** Country overview center (Mauritania). */
const CENTER: [number, number] = [20.2, -10.9];
const OVERVIEW_ZOOM = 6;

interface AddressPoint {
  id: string;
  lat: number;
  lon: number;
  number: string;
}

export interface MapFocusRequest {
  lat: number;
  lon: number;
  zoom: number;
  id: number;
}

export interface MapPlaceRequest extends MapFocusRequest {
  number?: string;
  pointId?: string;
}

export interface MapCanvasProps {
  railTool: string;
  onRailTool: (id: string) => void;
  tool: ToolId;
  selectedPoint: string | null;
  selectedStreet?: string | null;
  cursor: { lat: string; lon: string };
  onCursor: (cursor: { lat: string; lon: string }) => void;
  onSelectPoint: (id: string) => void;
  onSelectStreet: (id: string, addresses: RoadAddress[]) => void;
  deleteNonce?: number;
  onPointDeleted?: (id: string) => void;
  onStreetDeleted?: (id: string) => void;
  focusRequest?: MapFocusRequest | null;
  placeRequest?: MapPlaceRequest | null;
  onGeocodeClick?: () => void;
  polygonDrawActive?: boolean;
  dutyPolygon?: [number, number][] | null;
  onPolygonComplete?: (ring: [number, number][]) => void;
}

interface DrawnStreet {
  id: string;
  latlngs: [number, number][];
  addresses: RoadAddress[];
}

export function MapCanvas({
  railTool, onRailTool, tool, selectedPoint, selectedStreet = null, onCursor, onSelectPoint, onSelectStreet,
  deleteNonce = 0, onPointDeleted, onStreetDeleted,
  focusRequest, placeRequest, onGeocodeClick,
  polygonDrawActive = false, dutyPolygon = null, onPolygonComplete,
}: MapCanvasProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawLayer = useRef<L.LayerGroup | null>(null);
  const polygonLayer = useRef<L.LayerGroup | null>(null);
  const gridLayer = useRef<L.LayerGroup | null>(null);
  const gridHoverMarker = useRef<L.Marker | null>(null);
  const gridHoverLabel = useRef<string | null>(null);
  const draftRef = useRef<[number, number][]>([]);
  const polyDraftRef = useRef<[number, number][]>([]);
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const polygonDrawRef = useRef(polygonDrawActive);
  polygonDrawRef.current = polygonDrawActive;
  const [zoom, setZoom] = useState(OVERVIEW_ZOOM);
  const [points, setPoints] = useState<AddressPoint[]>([]);
  const [streets, setStreets] = useState<DrawnStreet[]>([]);
  const [draft, setDraft] = useState<[number, number][]>([]);
  const [polyDraft, setPolyDraft] = useState<[number, number][]>([]);
  const [, tick] = useState(0);
  const lastDeleteNonce = useRef(0);

  const hideGridHoverLabel = () => {
    const marker = gridHoverMarker.current;
    if (marker) {
      marker.remove();
      gridHoverMarker.current = null;
    }
    gridHoverLabel.current = null;
  };

  const showGridHoverLabel = (map: L.Map, lat: number, lon: number) => {
    if (map.getZoom() < GRID_MIN_ZOOM) {
      hideGridHoverLabel();
      return;
    }
    if (
      lat < GRID_WORLD_BOUNDS.south || lat > GRID_WORLD_BOUNDS.north
      || lon < GRID_WORLD_BOUNDS.west || lon > GRID_WORLD_BOUNDS.east
    ) {
      hideGridHoverLabel();
      return;
    }

    const { row, col } = rowColFromLatLon(lat, lon);
    const cell = getCellAt(row, col);
    if (!cell) {
      hideGridHoverLabel();
      return;
    }

    const midLat = (cell.south + cell.north) / 2;
    const midLon = (cell.west + cell.east) / 2;

    if (gridHoverMarker.current && gridHoverLabel.current === cell.label) {
      return;
    }

    hideGridHoverLabel();
    gridHoverMarker.current = L.marker([midLat, midLon], {
      interactive: false,
      keyboard: false,
      pane: 'gridHoverPane',
      icon: L.divIcon({
        className: 'base-grid-label',
        html: `<div style="
          transform:translate(-50%,-50%);
          display:inline-block;
          padding:3px 8px;
          background:rgba(26,58,107,0.92);
          color:#fff;
          font-family:var(--font-ui),system-ui,sans-serif;
          font-size:11px;
          font-weight:600;
          letter-spacing:0.02em;
          border-radius:3px;
          white-space:nowrap;
          box-shadow:0 1px 3px rgba(0,0,0,0.3);
          pointer-events:none;
        ">${cell.label}</div>`,
        iconSize: [1, 1],
        iconAnchor: [0, 0],
      }),
    }).addTo(map);
    gridHoverLabel.current = cell.label;
  };

  const redrawBaseGrid = (map: L.Map) => {
    const layer = gridLayer.current;
    if (!layer) return;
    layer.clearLayers();

    const z = map.getZoom();
    if (z < GRID_MIN_ZOOM) {
      hideGridHoverLabel();
      return;
    }

    const b = map.getBounds();
    const pad = CELL_SIZE_DEG;
    const view = {
      south: b.getSouth() - pad,
      west: b.getWest() - pad,
      north: b.getNorth() + pad,
      east: b.getEast() + pad,
    };

    const lineSouth = Math.max(view.south, GRID_WORLD_BOUNDS.south);
    const lineWest = Math.max(view.west, GRID_WORLD_BOUNDS.west);
    const lineNorth = Math.min(view.north, GRID_WORLD_BOUNDS.north);
    const lineEast = Math.min(view.east, GRID_WORLD_BOUNDS.east);
    if (lineSouth >= lineNorth || lineWest >= lineEast) return;

    const { vertical, horizontal } = getGridLineCoords(view);
    const lineStyle: L.PolylineOptions = {
      color: '#1a3a6b',
      weight: 1,
      opacity: 0.65,
      interactive: false,
    };
    vertical.forEach((lon) => {
      L.polyline([[lineSouth, lon], [lineNorth, lon]], lineStyle).addTo(layer);
    });
    horizontal.forEach((lat) => {
      L.polyline([[lat, lineWest], [lat, lineEast]], lineStyle).addTo(layer);
    });
  };

  useEffect(() => {
    if (!host.current) return;
    const map = L.map(host.current, { center: CENTER, zoom: OVERVIEW_ZOOM, zoomControl: false, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    map.createPane('gridHoverPane');
    const hoverPane = map.getPane('gridHoverPane');
    if (hoverPane) hoverPane.style.zIndex = '650';
    drawLayer.current = L.layerGroup().addTo(map);
    polygonLayer.current = L.layerGroup().addTo(map);

    const grids = L.layerGroup().addTo(map);
    gridLayer.current = grids;
    redrawBaseGrid(map);

    map.on('mousemove', (e) => {
      onCursor({ lat: e.latlng.lat.toFixed(6), lon: e.latlng.lng.toFixed(6) });
      showGridHoverLabel(map, e.latlng.lat, e.latlng.lng);
    });
    map.getContainer().addEventListener('mouseleave', hideGridHoverLabel);
    map.on('move zoom', () => tick((n) => n + 1));
    map.on('moveend', () => redrawBaseGrid(map));
    map.on('zoomend', () => {
      setZoom(map.getZoom());
      redrawBaseGrid(map);
    });
    mapRef.current = map;
    tick((n) => n + 1);
    const ro = new ResizeObserver(() => { map.invalidateSize(); tick((n) => n + 1); });
    ro.observe(host.current);
    return () => {
      map.getContainer().removeEventListener('mouseleave', hideGridHoverLabel);
      hideGridHoverLabel();
      ro.disconnect();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishStreet = () => {
    const pts = draftRef.current;
    if (pts && pts.length > 1) {
      const id = 's' + Date.now();
      const latlngs = [...pts] as [number, number][];
      const addresses = buildRoadAddresses(id, latlngs);
      setStreets((prev) => [...prev, { id, latlngs, addresses }]);
      onSelectStreet(id, addresses);
    }
    draftRef.current = [];
    setDraft([]);
  };

  const finishPolygon = () => {
    const pts = polyDraftRef.current;
    if (pts.length >= 3) {
      onPolygonComplete?.(pts);
    }
    polyDraftRef.current = [];
    setPolyDraft([]);
  };

  useEffect(() => {
    const layer = drawLayer.current;
    if (!layer) return;
    layer.clearLayers();
    streets.forEach((street) => {
      const selected = selectedStreet === street.id;
      const line = L.polyline(street.latlngs, {
        color: selected ? '#e5484b' : '#2f8fe0',
        weight: selected ? 5 : 4,
        opacity: 0.95,
      }).addTo(layer);
      line.on('click', () => {
        if (toolRef.current === 'draw' || polygonDrawRef.current) return;
        onSelectStreet(street.id, street.addresses);
      });
    });
  }, [streets, selectedStreet, onSelectStreet]);

  useEffect(() => {
    if (!deleteNonce || deleteNonce === lastDeleteNonce.current) return;
    lastDeleteNonce.current = deleteNonce;
    if (selectedPoint) {
      setPoints((ps) => ps.filter((p) => p.id !== selectedPoint));
      onPointDeleted?.(selectedPoint);
      return;
    }
    if (selectedStreet) {
      setStreets((ss) => ss.filter((s) => s.id !== selectedStreet));
      onStreetDeleted?.(selectedStreet);
    }
  }, [deleteNonce, selectedPoint, selectedStreet, onPointDeleted, onStreetDeleted]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onClick = (e: L.LeafletMouseEvent) => {
      const ll: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (polygonDrawRef.current) {
        const next = [...polyDraftRef.current, ll];
        polyDraftRef.current = next;
        setPolyDraft(next);
        return;
      }
      if (tool === 'draw') {
        const next = [...(draftRef.current || []), ll];
        draftRef.current = next;
        setDraft(next);
      } else if (tool === 'point') {
        setPoints((ps) => [...ps, { id: 'p' + Date.now(), lat: ll[0], lon: ll[1], number: String(101 + ps.length) }]);
      }
    };
    const onDouble = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stop(e);
      if (polygonDrawRef.current) {
        finishPolygon();
        return;
      }
      if (tool === 'draw') finishStreet();
    };
    map.on('click', onClick);
    map.on('dblclick', onDouble);
    return () => { map.off('click', onClick); map.off('dblclick', onDouble); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, polygonDrawActive]);

  useEffect(() => { if (tool !== 'draw') finishStreet(); }, [tool]);

  useEffect(() => {
    if (!polygonDrawActive) {
      polyDraftRef.current = [];
      setPolyDraft([]);
    }
  }, [polygonDrawActive]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getContainer().style.cursor =
      polygonDrawActive || tool === 'draw' || tool === 'point' ? 'crosshair' : '';
  }, [tool, polygonDrawActive]);

  useEffect(() => {
    const layer = polygonLayer.current;
    if (!layer) return;
    layer.clearLayers();
    if (dutyPolygon && dutyPolygon.length >= 3) {
      L.polygon(dutyPolygon, {
        color: '#0aa2a8',
        weight: 2,
        fillColor: '#0aa2a8',
        fillOpacity: 0.18,
        interactive: false,
      }).addTo(layer);
    }
  }, [dutyPolygon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusRequest) return;
    map.flyTo([focusRequest.lat, focusRequest.lon], focusRequest.zoom, { duration: 0.8 });
  }, [focusRequest]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !placeRequest) return;
    map.flyTo([placeRequest.lat, placeRequest.lon], placeRequest.zoom, { duration: 0.8 });
    setPoints((ps) => {
      const id = placeRequest.pointId ?? 'p' + placeRequest.id;
      if (ps.some((p) => p.id === id)) return ps;
      return [
        ...ps,
        {
          id,
          lat: placeRequest.lat,
          lon: placeRequest.lon,
          number: placeRequest.number ?? String(101 + ps.length),
        },
      ];
    });
  }, [placeRequest]);

  const drawing = tool === 'draw' || tool === 'point' || polygonDrawActive;

  const pt = (p: AddressPoint) => {
    const map = mapRef.current;
    if (!map) return { left: -99, top: -99 };
    const q = map.latLngToContainerPoint([p.lat, p.lon]);
    return { left: q.x, top: q.y };
  };

  const railTools = RAIL_TOOL_DEFS.map((t) => ({ ...t, icon: <Icon name={t.iconName} size={20} /> }));
  const draftPx = mapRef.current ? draft.map((ll) => mapRef.current!.latLngToContainerPoint(ll)) : [];
  const polyDraftPx = mapRef.current ? polyDraft.map((ll) => mapRef.current!.latLngToContainerPoint(ll)) : [];

  const filterActive = Boolean(dutyPolygon && dutyPolygon.length >= 3);

  const handleMarkerActivate = (id: string) => {
    if (polygonDrawActive) return;
    onSelectPoint(id);
  };

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: 'var(--map-land)' }}>
      <div ref={host} style={{ position: 'absolute', inset: 0, zIndex: 0, isolation: 'isolate' }}></div>
      {draftPx.length > 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 450 }}>
          <polyline points={draftPx.map((q) => q.x + ',' + q.y).join(' ')} fill="none" stroke="#2f8fe0" strokeWidth="3" strokeDasharray="6 5" />
          {draftPx.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r="4" fill="#fff" stroke="#2f8fe0" strokeWidth="2" />)}
        </svg>
      )}
      {polyDraftPx.length > 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 450 }}>
          <polygon
            points={polyDraftPx.map((q) => q.x + ',' + q.y).join(' ')}
            fill="rgba(10,162,168,0.15)"
            stroke="#0aa2a8"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          {polyDraftPx.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r="4" fill="#fff" stroke="#0aa2a8" strokeWidth="2" />)}
        </svg>
      )}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 500 }}>
        {mapRef.current && points.map((p) => {
          const inside = !filterActive || pointInPolygon(p.lat, p.lon, dutyPolygon!);
          if (filterActive && !inside) return null;
          const q = pt(p);
          return (
            <div key={p.id} role="button" tabIndex={0} aria-label={'Address point ' + p.number}
              onClick={() => handleMarkerActivate(p.id)} onKeyDown={(e) => e.key === 'Enter' && handleMarkerActivate(p.id)}
              style={{ position: 'absolute', left: q.left, top: q.top, transform: 'translate(-50%,-100%)', cursor: polygonDrawActive ? 'crosshair' : 'pointer', pointerEvents: 'auto' }}>
              <AddressMarker number={p.number} tone={selectedPoint === p.id ? 'selected' : 'default'} />
            </div>
          );
        })}
      </div>
      {drawing && (
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 650, background: 'var(--navy-800)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }}>
          {polygonDrawActive
            ? 'Click on the map to add polygon vertices — double-click to finish'
            : tool === 'draw'
              ? 'Click on the map to add vertices — double-click to finish the street'
              : 'Click on the map to place an address point'}
        </div>
      )}
      <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-3)', zIndex: 600 }}>
        <MapToolRail tools={railTools} value={railTool} onChange={onRailTool} ariaLabel="Map tools" />
        {onGeocodeClick ? (
          <div style={{ paddingLeft: 'var(--space-5)' }}>
            <SearchGeocodeButton onClick={onGeocodeClick} />
          </div>
        ) : null}
      </div>
      <div style={{ position: 'absolute', right: 14, bottom: 26, zIndex: 600 }}>
        <MapZoomControl level={zoom}
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          levelLabel="Zoom level" zoomInLabel="Zoom in" zoomOutLabel="Zoom out"
          extras={<IconButton shape="rail" icon={<Icon name="map-pin" size={20} />} label="My location"
            onClick={() => mapRef.current?.setView(CENTER, OVERVIEW_ZOOM)} />} />
      </div>
    </div>
  );
}

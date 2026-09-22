import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapToolRail } from '../components/map/MapToolRail';
import { MapZoomControl } from '../components/map/MapZoomControl';
import { AddressMarker } from '../components/map/AddressMarker';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import type { ToolId } from './AppShell';

const RAIL_TOOL_DEFS = [
  { id: 'info', iconName: 'map-info', label: 'Identify' },
  { id: 'pan', iconName: 'map-pan', label: 'Pan' },
  { id: 'box', iconName: 'map-select-box', label: 'Select area' },
  { id: 'measure', iconName: 'map-measure', label: 'Measure' },
  { id: 'undo', iconName: 'map-undo', label: 'Undo' },
  { id: 'layers', iconName: 'map-layers', label: 'Layers' },
] as const;

/** Country overview center (Mauritania). */
const CENTER: [number, number] = [20.2, -10.9];
const OVERVIEW_ZOOM = 6;

/** Show overview color zones only when zoomed out (hide when zoomed in past this level). */
const ZONE_MAX_ZOOM = 9;

type ZoneDef = { color: string; rings: [number, number][] };

/**
 * Decorative overview zones ≈ Mauritania wilayas (lat, lon rings). Visual-only;
 * approximate tessellation covering the country region-by-region.
 */
const OVERVIEW_ZONES: ZoneDef[] = [
  // Tiris Zemmour (north)
  {
    color: '#e53935',
    rings: [
      [27.2, -8.7], [27.0, -5.5], [25.0, -4.8], [22.8, -6.0],
      [22.6, -8.5], [23.5, -11.0], [25.2, -12.0], [26.5, -11.5],
    ],
  },
  // Adrar (central north)
  {
    color: '#fb8c00',
    rings: [
      [22.6, -8.5], [22.8, -6.0], [21.2, -6.2], [19.8, -8.0],
      [19.6, -11.5], [20.5, -13.2], [21.8, -13.0], [22.6, -11.0],
    ],
  },
  // Dakhlet Nouadhibou (NW coast)
  {
    color: '#00acc1',
    rings: [
      [21.4, -17.1], [21.5, -15.6], [20.8, -15.4], [20.2, -15.8],
      [20.0, -16.8], [20.5, -17.1],
    ],
  },
  // Inchiri
  {
    color: '#43a047',
    rings: [
      [21.8, -15.6], [21.8, -13.0], [20.5, -13.2], [19.8, -14.2],
      [19.6, -15.8], [20.2, -16.0], [20.8, -15.4],
    ],
  },
  // Trarza + Nouakchott (SW coast)
  {
    color: '#1e88e5',
    rings: [
      [19.6, -15.8], [19.8, -14.2], [18.6, -14.0], [16.8, -14.2],
      [16.0, -15.0], [16.2, -16.5], [17.5, -16.3], [18.5, -16.1], [19.2, -16.0],
    ],
  },
  // Brakna
  {
    color: '#8e24aa',
    rings: [
      [18.6, -14.0], [18.4, -12.2], [16.8, -12.0], [16.2, -13.2],
      [16.8, -14.2],
    ],
  },
  // Tagant
  {
    color: '#ec407a',
    rings: [
      [19.8, -11.5], [19.8, -8.0], [18.2, -8.2], [17.2, -10.0],
      [17.4, -12.0], [18.4, -12.2], [19.6, -11.5],
    ],
  },
  // Gorgol
  {
    color: '#5e35b1',
    rings: [
      [16.8, -14.2], [16.8, -12.0], [15.6, -12.0], [15.2, -12.8],
      [15.4, -13.8], [16.0, -15.0],
    ],
  },
  // Assaba
  {
    color: '#00897b',
    rings: [
      [17.4, -12.0], [17.2, -10.0], [16.0, -10.0], [15.4, -11.2],
      [15.6, -12.0], [16.8, -12.0],
    ],
  },
  // Guidimaka (far south)
  {
    color: '#c0ca33',
    rings: [
      [15.6, -12.0], [15.4, -11.2], [14.8, -11.0], [14.7, -12.2],
      [15.2, -12.8],
    ],
  },
  // Hodh El Gharbi
  {
    color: '#ef6c00',
    rings: [
      [17.2, -10.0], [17.4, -8.2], [16.2, -8.0], [15.4, -9.0],
      [15.4, -11.2], [16.0, -10.0],
    ],
  },
  // Hodh Ech Chargui (east)
  {
    color: '#d81b60',
    rings: [
      [19.8, -8.0], [21.2, -6.2], [19.5, -5.0], [16.8, -5.5],
      [15.8, -7.0], [16.2, -8.0], [17.4, -8.2], [18.2, -8.2],
    ],
  },
];


function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

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

export interface MapCanvasProps {
  railTool: string;
  onRailTool: (id: string) => void;
  tool: ToolId;
  selectedPoint: string | null;
  cursor: { lat: string; lon: string };
  onCursor: (cursor: { lat: string; lon: string }) => void;
  onSelectPoint: (id: string) => void;
  onSelectStreet: () => void;
  onPointDeleted?: (id: string) => void;
  onStreetDeleted?: () => void;
  focusRequest?: MapFocusRequest | null;
}

export function MapCanvas({
  railTool, onRailTool, tool, selectedPoint, onCursor, onSelectPoint, onSelectStreet, onPointDeleted, onStreetDeleted, focusRequest,
}: MapCanvasProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawLayer = useRef<L.LayerGroup | null>(null);
  const zoneLayer = useRef<L.LayerGroup | null>(null);
  const draftRef = useRef<[number, number][]>([]);
  const railToolRef = useRef(railTool);
  railToolRef.current = railTool;
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const [zoom, setZoom] = useState(OVERVIEW_ZOOM);
  const [points, setPoints] = useState<AddressPoint[]>([]);
  const [draft, setDraft] = useState<[number, number][]>([]);
  const [, tick] = useState(0);

  const syncZoneVisibility = (map: L.Map, z: number) => {
    const layer = zoneLayer.current;
    if (!layer) return;
    if (z <= ZONE_MAX_ZOOM) {
      if (!map.hasLayer(layer)) layer.addTo(map);
    } else if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  };

  useEffect(() => {
    if (!host.current) return;
    const map = L.map(host.current, { center: CENTER, zoom: OVERVIEW_ZOOM, zoomControl: false, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    drawLayer.current = L.layerGroup().addTo(map);

    const zones = L.layerGroup();
    OVERVIEW_ZONES.forEach((z) => {
      L.polygon(z.rings, {
        color: z.color,
        weight: 1.25,
        opacity: 0.75,
        fillColor: z.color,
        fillOpacity: 0.28,
        interactive: false,
      }).addTo(zones);
    });
    zoneLayer.current = zones;
    zones.addTo(map);

    map.on('mousemove', (e) => onCursor({ lat: e.latlng.lat.toFixed(6), lon: e.latlng.lng.toFixed(6) }));
    map.on('move zoom', () => tick((n) => n + 1));
    map.on('zoomend', () => {
      const z = map.getZoom();
      setZoom(z);
      syncZoneVisibility(map, z);
    });
    map.on('zoom', () => syncZoneVisibility(map, map.getZoom()));
    mapRef.current = map;
    tick((n) => n + 1);
    const ro = new ResizeObserver(() => { map.invalidateSize(); tick((n) => n + 1); });
    ro.observe(host.current);
    return () => { ro.disconnect(); map.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishStreet = () => {
    const pts = draftRef.current;
    if (pts && pts.length > 1 && drawLayer.current) {
      const line = L.polyline(pts, { color: '#2f8fe0', weight: 4, opacity: 0.95 }).addTo(drawLayer.current);
      line.on('click', () => {
        if (railToolRef.current === 'delete') {
          drawLayer.current?.removeLayer(line);
          onStreetDeleted?.();
          return;
        }
        if (toolRef.current === 'draw') return;
        onSelectStreet();
      });
      onSelectStreet();
    }
    draftRef.current = [];
    setDraft([]);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onClick = (e: L.LeafletMouseEvent) => {
      const ll: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (tool === 'draw') {
        const next = [...(draftRef.current || []), ll];
        draftRef.current = next;
        setDraft(next);
      } else if (tool === 'point') {
        setPoints((ps) => [...ps, { id: 'p' + Date.now(), lat: ll[0], lon: ll[1], number: String(101 + ps.length) }]);
      }
    };
    const onDouble = () => { if (tool === 'draw') finishStreet(); };
    map.on('click', onClick);
    map.on('dblclick', onDouble);
    return () => { map.off('click', onClick); map.off('dblclick', onDouble); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  useEffect(() => { if (tool !== 'draw') finishStreet(); }, [tool]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getContainer().style.cursor =
      tool === 'draw' || tool === 'point' ? 'crosshair' : railTool === 'delete' ? 'pointer' : '';
  }, [tool, railTool]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusRequest) return;
    map.flyTo([focusRequest.lat, focusRequest.lon], focusRequest.zoom, { duration: 0.8 });
  }, [focusRequest]);

  const drawing = tool === 'draw' || tool === 'point';

  const pt = (p: AddressPoint) => {
    const map = mapRef.current;
    if (!map) return { left: -99, top: -99 };
    const q = map.latLngToContainerPoint([p.lat, p.lon]);
    return { left: q.x, top: q.y };
  };

  const iconRailTools = RAIL_TOOL_DEFS.map((t) => ({ ...t, icon: <Icon name={t.iconName} size={20} /> }));
  const railTools = [
    ...iconRailTools.slice(0, 5),
    { id: 'delete', label: 'Delete', icon: <TrashIcon /> },
    ...iconRailTools.slice(5),
  ];
  const draftPx = mapRef.current ? draft.map((ll) => mapRef.current!.latLngToContainerPoint(ll)) : [];

  const handleMarkerActivate = (id: string) => {
    if (railTool === 'delete') {
      setPoints((ps) => ps.filter((pt) => pt.id !== id));
      onPointDeleted?.(id);
      return;
    }
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
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 500 }}>
        {mapRef.current && points.map((p) => {
          const q = pt(p);
          return (
            <div key={p.id} role="button" tabIndex={0} aria-label={'Address point ' + p.number}
              onClick={() => handleMarkerActivate(p.id)} onKeyDown={(e) => e.key === 'Enter' && handleMarkerActivate(p.id)}
              style={{ position: 'absolute', left: q.left, top: q.top, transform: 'translate(-50%,-100%)', cursor: 'pointer', pointerEvents: 'auto' }}>
              <AddressMarker number={p.number} tone={selectedPoint === p.id ? 'selected' : 'default'} />
            </div>
          );
        })}
      </div>
      {drawing && (
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 650, background: 'var(--navy-800)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }}>
          {tool === 'draw' ? 'Click on the map to add vertices — double-click to finish the street' : 'Click on the map to place an address point'}
        </div>
      )}
      <div style={{ position: 'absolute', left: 12, top: 12, bottom: 12, display: 'flex', alignItems: 'flex-start', zIndex: 600 }}>
        <MapToolRail tools={railTools} value={railTool} onChange={onRailTool} ariaLabel="Map tools" />
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

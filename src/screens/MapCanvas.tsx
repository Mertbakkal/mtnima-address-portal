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

const CENTER: [number, number] = [18.0895, -15.9755];

/** Show overview color zones only when zoomed out (hide when zoomed in past this level). */
const ZONE_MAX_ZOOM = 15;

type ZoneDef = { color: string; rings: [number, number][] };

/** Decorative overview zones around Nouakchott (lat, lon rings). Visual-only. */
const OVERVIEW_ZONES: ZoneDef[] = [
  {
    color: '#e53935',
    rings: [
      [18.105, -15.995], [18.112, -15.968], [18.098, -15.948], [18.078, -15.952],
      [18.070, -15.975], [18.078, -15.998], [18.095, -16.005],
    ],
  },
  {
    color: '#e53935',
    rings: [
      [18.070, -15.950], [18.068, -15.930], [18.052, -15.925], [18.042, -15.942],
      [18.048, -15.962], [18.062, -15.965],
    ],
  },
  {
    color: '#43a047',
    rings: [
      [18.100, -16.018], [18.108, -16.008], [18.102, -15.998], [18.090, -16.002],
      [18.088, -16.015],
    ],
  },
  {
    color: '#1e88e5',
    rings: [
      [18.085, -16.022], [18.092, -16.016], [18.086, -16.008], [18.076, -16.012],
      [18.074, -16.022],
    ],
  },
  {
    color: '#8e24aa',
    rings: [
      [18.072, -16.018], [18.078, -16.010], [18.070, -16.000], [18.060, -16.006],
      [18.062, -16.018],
    ],
  },
  {
    color: '#ec407a',
    rings: [
      [18.060, -16.012], [18.066, -16.002], [18.058, -15.992], [18.048, -15.998],
      [18.050, -16.012],
    ],
  },
  {
    color: '#fb8c00',
    rings: [
      [18.055, -15.990], [18.062, -15.980], [18.055, -15.970], [18.045, -15.975],
      [18.046, -15.988],
    ],
  },
  {
    color: '#00acc1',
    rings: [
      [18.115, -15.985], [18.120, -15.972], [18.112, -15.962], [18.105, -15.970],
      [18.108, -15.985],
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
  const [zoom, setZoom] = useState(14);
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
    const map = L.map(host.current, { center: CENTER, zoom: 14, zoomControl: false, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    drawLayer.current = L.layerGroup().addTo(map);

    const zones = L.layerGroup();
    OVERVIEW_ZONES.forEach((z) => {
      L.polygon(z.rings, {
        color: z.color,
        weight: 1.5,
        opacity: 0.85,
        fillColor: z.color,
        fillOpacity: 0.38,
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
            onClick={() => mapRef.current?.setView(CENTER, 14)} />} />
      </div>
    </div>
  );
}

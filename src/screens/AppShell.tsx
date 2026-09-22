import { useState } from 'react';
import { TopBar } from '../components/navigation/TopBar';
import { ModuleTab } from '../components/navigation/ModuleTab';
import { ToolStrip } from '../components/navigation/ToolStrip';
import { MapStatusBar } from '../components/map/MapStatusBar';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { MapCanvas, type MapFocusRequest } from './MapCanvas';
import { StreetPanel } from './StreetPanel';
import { AddressPointPanel } from './AddressPointPanel';
import { FieldValidationPanel, type ValidationDecision } from './FieldValidationPanel';
import { HierarchicalAddressSearchModal } from './HierarchicalAddressSearchModal';
import { DynamicQueryPanel } from './DynamicQueryPanel';
import { CitizenLoginModal } from './CitizenLoginModal';
import { AdresTespitButton, AdresTespitModal } from './AdresTespitModal';
import type { MapFocus } from '../data/hierarchySearch';

export type ModuleId = 'address' | 'hier' | 'query' | 'task';
export type ToolId = 'draw' | 'point' | 'move' | 'ainfo' | null;
type PanelId = 'street' | 'address' | 'validation' | null;

const STRIP_TOOL_DEFS = [
  { id: 'draw', iconName: 'tool-street-draw', label: 'Draw Street' },
  { id: 'point', iconName: 'tool-address-point', label: 'Draw Address Point' },
  { id: 'move', iconName: 'tool-address-move', label: 'Move Point' },
] as const;

export function AppShell() {
  const [module, setModule] = useState<ModuleId>('address');
  const [tool, setTool] = useState<ToolId>(null);
  const [railTool, setRailTool] = useState('pan');
  const [panel, setPanel] = useState<PanelId>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [decision, setDecision] = useState<ValidationDecision>(null);
  const [cursor, setCursor] = useState({ lat: '18.089500', lon: '-15.975500' });
  const [crs, setCrs] = useState('WGS84 (EPSG:4326)');
  const [scale, setScale] = useState('1:50,000');
  const [focusRequest, setFocusRequest] = useState<MapFocusRequest | null>(null);
  const [hierModalOpen, setHierModalOpen] = useState(true);
  const [queryOpen, setQueryOpen] = useState(true);
  const [citizenLoginOpen, setCitizenLoginOpen] = useState(false);
  const [adresTespitOpen, setAdresTespitOpen] = useState(false);

  const pickTool = (id: string) => {
    const next = (tool === id ? null : id) as ToolId;
    setTool(next);
    if (next === 'draw' || next === 'point') { setPanel(null); setPoint(null); }
    if (next !== null && railTool === 'info') setRailTool('pan');
  };
  const pickModule = (id: string) => {
    const m = id as ModuleId;
    setModule(m);
    setPanel(m === 'task' ? 'validation' : null);
    if (m === 'task') setDecision(null);
    if (m === 'hier') setHierModalOpen(true);
    if (m === 'query') {
      setQueryOpen(true);
    }
  };
  const handleHierarchyShow = (focus: MapFocus) => {
    setFocusRequest({ ...focus, id: Date.now() });
  };
  const pickRailTool = (id: string) => {
    setRailTool(id);
    if (id === 'info') {
      setTool('ainfo');
    } else if (tool === 'ainfo') {
      setTool(null);
    }
  };

  const stripTools = STRIP_TOOL_DEFS.map((t) => ({ ...t, icon: <Icon name={t.iconName} size={24} /> }));

  return (
    <div style={{ position: 'absolute', inset: 8, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', background: 'var(--gray-0)' }}>
      <div style={{ position: 'relative', zIndex: 3, background: 'var(--gray-0)', borderRadius: '0 0 var(--radius-2xl) var(--radius-2xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          navLabel="Modules"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AdresTespitButton onClick={() => setAdresTespitOpen(true)} />
              <IconButton shape="round" tone="solid" icon={<Icon name="nav-user" size={18} />} label="Account" onClick={() => setCitizenLoginOpen(true)} />
            </div>
          }
        >
          <ModuleTab icon={<Icon name="nav-home" size={22} />} active={module === 'address'} onClick={() => pickModule('address')}>Addresses</ModuleTab>
          <ModuleTab icon={<Icon name="nav-hierarchy" size={22} />} active={module === 'hier'} onClick={() => pickModule('hier')}>Hierarchy</ModuleTab>
          <ModuleTab icon={<Icon name="map-info" size={22} />} active={module === 'query'} onClick={() => pickModule('query')}>Query</ModuleTab>
          <ModuleTab icon={<Icon name="nav-tasks" size={22} />} active={module === 'task'} onClick={() => pickModule('task')}>Tasks</ModuleTab>
        </TopBar>
        {module === 'address' && <ToolStrip tools={stripTools} value={tool ?? ''} onChange={pickTool} stripLabel="Tools" />}
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', minHeight: 0 }}>
        <MapCanvas railTool={railTool} onRailTool={pickRailTool} tool={tool} selectedPoint={point} cursor={cursor} onCursor={setCursor}
          onSelectPoint={(id) => { if (tool === 'point' || tool === 'draw') return; setPoint(id); setModule('address'); setRailTool('info'); setTool('ainfo'); setPanel('address'); }}
          onSelectStreet={() => { setModule('address'); setPanel('street'); }}
          focusRequest={focusRequest} />
        {panel && (
          <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, display: 'flex', zIndex: 700 }}>
            {panel === 'street' && <StreetPanel onClose={() => setPanel(null)} />}
            {panel === 'address' && <AddressPointPanel onClose={() => setPanel(null)} />}
            {panel === 'validation' && <FieldValidationPanel decision={decision} onDecision={setDecision} onClose={() => setPanel(null)} />}
          </div>
        )}
        {module === 'hier' && hierModalOpen && (
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 720 }}>
            <HierarchicalAddressSearchModal
              onClose={() => setHierModalOpen(false)}
              onShow={handleHierarchyShow}
            />
          </div>
        )}
        {module === 'query' && queryOpen && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 12,
            width: 'min(920px, calc(100% - 48px))',
            zIndex: 720,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}>
            <div style={{ pointerEvents: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <DynamicQueryPanel
                onClose={() => setQueryOpen(false)}
              />
            </div>
          </div>
        )}
        {citizenLoginOpen && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 740 }}>
            <CitizenLoginModal onClose={() => setCitizenLoginOpen(false)} />
          </div>
        )}
        {adresTespitOpen && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 750, maxHeight: 'calc(100% - 24px)', overflow: 'auto' }}>
            <AdresTespitModal onClose={() => setAdresTespitOpen(false)} />
          </div>
        )}
      </div>
      <MapStatusBar crs={crs} crsOptions={['WGS84 (EPSG:4326)', 'UTM 28N (EPSG:32628)']} onCrsChange={(e) => setCrs(e.target.value)}
        crsLabel="Coordinate system" scaleLabel="Scale"
        latLabel="Lat" lonLabel="Lon" copyLabel="Copy coordinates" lat={cursor.lat} lon={cursor.lon}
        scale={scale} scaleOptions={['1:50,000', '1:25,000', '1:10,000']} onScaleChange={(e) => setScale(e.target.value)} />
    </div>
  );
}

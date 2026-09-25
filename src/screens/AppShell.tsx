import { useState, type ReactNode } from 'react';
import { WorkspaceNav, DotsIcon } from '../components/navigation/WorkspaceNav';
import { MapStatusBar } from '../components/map/MapStatusBar';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { MapCanvas, type MapFocusRequest, type MapPlaceRequest } from './MapCanvas';
import { StreetPanel } from './StreetPanel';
import { AddressPointPanel } from './AddressPointPanel';
import { DemandVerificationPanel } from './DemandVerificationPanel';
import { buildAddressDemand } from '../data/addressDemand';
import { HierarchicalAddressSearchModal } from './HierarchicalAddressSearchModal';
import { DynamicQueryPanel } from './DynamicQueryPanel';
import { CitizenLoginModal } from './CitizenLoginModal';
import { AdresTespitButton, AdresTespitModal } from './AdresTespitModal';
import { SearchGeocodeModal } from './SearchGeocodeModal';
import { TaskListModal } from './TaskListModal';
import type { DutyPlaceMode } from './TaskDetailsWizard';
import type { MapFocus } from '../data/hierarchySearch';
import type { GeocodeResult } from '../data/geocodeSearch';
import type { RoadAddress } from '../data/roadAddresses';

export type ModuleId = 'address' | 'search' | 'hier' | 'task' | 'dashboard' | null;
export type ToolId = 'draw' | 'point' | 'move' | 'ainfo' | null;
type PanelId = 'street' | 'address' | null;

const ADDRESS_TOOLS = [
  { id: 'draw', iconName: 'tool-street-draw', label: 'Draw Street' },
  { id: 'point', iconName: 'tool-address-point', label: 'Draw Address Point' },
  { id: 'move', iconName: 'tool-address-move', label: 'Move Point' },
] as const;

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="var(--navy-800)" />
      <path d="M8 14l2.5-3 2 2.2L16 9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppShell() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [module, setModule] = useState<ModuleId>(null);
  const [tool, setTool] = useState<ToolId>(null);
  const [railTool, setRailTool] = useState('pan');
  const [panel, setPanel] = useState<PanelId>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [demandOpen, setDemandOpen] = useState(false);
  const [street, setStreet] = useState<string | null>(null);
  const [streetAddresses, setStreetAddresses] = useState<RoadAddress[]>([]);
  const [deleteNonce, setDeleteNonce] = useState(0);
  const [cursor, setCursor] = useState({ lat: '18.089500', lon: '-15.975500' });
  const [crs, setCrs] = useState('WGS84 (EPSG:4326)');
  const [scale, setScale] = useState('1:50,000');
  const [focusRequest, setFocusRequest] = useState<MapFocusRequest | null>(null);
  const [placeRequest, setPlaceRequest] = useState<MapPlaceRequest | null>(null);
  const [hierModalOpen, setHierModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [taskListOpen, setTaskListOpen] = useState(false);
  const [dutyMode, setDutyMode] = useState<DutyPlaceMode>('hierarchical');
  const [dutyPolygon, setDutyPolygon] = useState<[number, number][] | null>(null);
  const [citizenLoginOpen, setCitizenLoginOpen] = useState(false);
  const [adresTespitOpen, setAdresTespitOpen] = useState(false);
  const [geocodeOpen, setGeocodeOpen] = useState(false);

  const polygonDrawActive = taskListOpen && dutyMode === 'polygon';

  const pickTool = (id: string) => {
    const next = (tool === id ? null : id) as ToolId;
    setTool(next);
    setModule('address');
    if (next === 'draw' || next === 'point') { setPanel(null); setPoint(null); }
    if (next !== null && railTool === 'info') setRailTool('pan');
  };

  const pickModule = (id: string) => {
    const m = id as ModuleId;
    setModule(m);
    if (m !== 'address') setTool(null);
    setPanel(null);
    setTaskListOpen(m === 'task');
    if (m !== 'task') {
      setDutyMode('hierarchical');
      setDutyPolygon(null);
    }
    setHierModalOpen(m === 'hier');
    setSearchOpen(m === 'search');
  };

  const closeTaskList = () => {
    setTaskListOpen(false);
    setModule(null);
    setDutyMode('hierarchical');
    setDutyPolygon(null);
  };

  const handleHierarchyShow = (focus: MapFocus) => {
    setFocusRequest({ ...focus, id: Date.now() });
  };

  const handleGeocodeSearch = (result: GeocodeResult) => {
    setPlaceRequest({ ...result, id: Date.now() });
  };

  const pickRailTool = (id: string) => {
    setRailTool(id);
    if (id === 'clear') {
      if (point || street) setDeleteNonce((n) => n + 1);
      return;
    }
    if (id === 'info') {
      setTool('ainfo');
      setModule('address');
    } else if (tool === 'ainfo') {
      setTool(null);
    }
  };

  const handleDeleteSelection = () => {
    setDeleteNonce((n) => n + 1);
  };

  const clearSelectionAfterDelete = () => {
    setPanel(null);
    setPoint(null);
    setStreet(null);
    setStreetAddresses([]);
    setDemandOpen(false);
    if (railTool === 'clear') setRailTool('pan');
  };

  const navItems = [
    {
      id: 'address',
      label: 'Addresses',
      icon: <Icon name="nav-home" size={16} />,
      dropdown: ADDRESS_TOOLS.map((t) => ({
        id: t.id,
        label: t.label,
        icon: <Icon name={t.iconName} size={20} /> as ReactNode,
      })),
    },
    { id: 'search', label: 'Quick Search', icon: <DotsIcon /> },
    { id: 'hier', label: 'Hierarchical Address Search', icon: <Icon name="nav-hierarchy" size={16} /> },
    { id: 'task', label: 'Task Management', icon: <Icon name="nav-tasks" size={16} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <DashIcon /> },
  ];

  const guestChrome = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <AdresTespitButton onClick={() => setAdresTespitOpen(true)} />
      <IconButton
        shape="round"
        tone="solid"
        icon={<Icon name="nav-user" size={18} />}
        label="Account"
        onClick={() => setCitizenLoginOpen(true)}
      />
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 8, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', background: 'var(--gray-0)' }}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', minHeight: 0 }}>
        <MapCanvas
          railTool={railTool}
          onRailTool={pickRailTool}
          tool={tool}
          selectedPoint={point}
          selectedStreet={street}
          cursor={cursor}
          onCursor={setCursor}
          onSelectPoint={(id) => {
            if (tool === 'point' || tool === 'draw' || polygonDrawActive) return;
            setPoint(id);
            setDemandOpen(false);
            setStreet(null);
            setModule('address');
            setRailTool('info');
            setTool('ainfo');
            setPanel('address');
          }}
          onSelectStreet={(id, addresses) => {
            setStreet(id);
            setStreetAddresses(addresses);
            setPoint(null);
            setModule('address');
            setPanel('street');
          }}
          deleteNonce={deleteNonce}
          onPointDeleted={clearSelectionAfterDelete}
          onStreetDeleted={clearSelectionAfterDelete}
          focusRequest={focusRequest}
          placeRequest={placeRequest}
          onGeocodeClick={() => setGeocodeOpen(true)}
          polygonDrawActive={polygonDrawActive}
          dutyPolygon={dutyPolygon}
          onPolygonComplete={(ring) => setDutyPolygon(ring)}
        />

        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 730, display: 'flex', alignItems: 'flex-start' }}>
          {guestChrome}
        </div>

        {loggedIn && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 730,
            pointerEvents: 'auto',
          }}>
            <WorkspaceNav
              items={navItems}
              activeId={module}
              dropdownValue={tool}
              onSelect={(id) => {
                if (id === 'address') {
                  setModule(id);
                  setSearchOpen(false);
                  setTaskListOpen(false);
                  setDutyMode('hierarchical');
                  setDutyPolygon(null);
                  return;
                }
                if (id === 'search') {
                  setModule('search');
                  setSearchOpen(true);
                  setHierModalOpen(false);
                  setTaskListOpen(false);
                  setDutyMode('hierarchical');
                  setDutyPolygon(null);
                  setPanel(null);
                  setTool(null);
                  return;
                }
                if (id === 'dashboard') {
                  setModule(id);
                  setHierModalOpen(false);
                  setSearchOpen(false);
                  setTaskListOpen(false);
                  setDutyMode('hierarchical');
                  setDutyPolygon(null);
                  setPanel(null);
                  return;
                }
                pickModule(id);
              }}
              onDropdownSelect={(itemId, optionId) => {
                if (itemId === 'address') {
                  setSearchOpen(false);
                  setTaskListOpen(false);
                  setDutyMode('hierarchical');
                  setDutyPolygon(null);
                  pickTool(optionId);
                }
              }}
            />
          </div>
        )}

        {panel && loggedIn && (
          <div style={{ position: 'absolute', top: 64, right: 12, bottom: 12, display: 'flex', gap: 12, alignItems: 'stretch', zIndex: 700 }}>
            {panel === 'street' && (
              <StreetPanel
                addresses={streetAddresses}
                onClose={() => { setPanel(null); setStreet(null); setStreetAddresses([]); }}
                onDelete={handleDeleteSelection}
                onCenterAddress={(address) => {
                  setPlaceRequest({
                    lat: address.lat,
                    lon: address.lon,
                    zoom: 17,
                    id: Date.now(),
                    number: address.number,
                    pointId: street ? `${street}-${address.number}` : `addr-${address.number}`,
                  });
                }}
              />
            )}
            {panel === 'address' && (
              <>
                {demandOpen && point && (
                  <DemandVerificationPanel
                    demand={buildAddressDemand(point)}
                    onClose={() => setDemandOpen(false)}
                  />
                )}
                <AddressPointPanel
                  pointId={point}
                  demandOpen={demandOpen}
                  onOpenDemand={() => setDemandOpen(true)}
                  onClose={() => { setPanel(null); setPoint(null); setDemandOpen(false); }}
                  onDelete={handleDeleteSelection}
                />
              </>
            )}
          </div>
        )}

        {loggedIn && module === 'hier' && hierModalOpen && (
          <div style={{ position: 'absolute', top: 64, left: '50%', transform: 'translateX(-50%)', zIndex: 720 }}>
            <HierarchicalAddressSearchModal
              onClose={() => { setHierModalOpen(false); setModule(null); }}
              onShow={handleHierarchyShow}
            />
          </div>
        )}

        {loggedIn && module === 'task' && taskListOpen && (
          <div style={{
            position: 'absolute',
            top: 64,
            zIndex: 720,
            maxHeight: 'calc(100% - 76px)',
            ...(polygonDrawActive
              ? { right: 12, left: 'auto', transform: 'none' }
              : { left: '50%', transform: 'translateX(-50%)' }),
          }}>
            <TaskListModal
              onClose={closeTaskList}
              onDutyModeChange={setDutyMode}
              dutyPolygon={dutyPolygon}
              onClearPolygon={() => setDutyPolygon(null)}
              onHierarchyFocus={handleHierarchyShow}
              mapDrawMode={polygonDrawActive}
            />
          </div>
        )}

        {loggedIn && module === 'search' && searchOpen && (
          <div style={{
            position: 'absolute',
            top: 64,
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
                onClose={() => { setSearchOpen(false); setModule(null); }}
              />
            </div>
          </div>
        )}

        {citizenLoginOpen && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 740 }}>
            <CitizenLoginModal
              onClose={() => setCitizenLoginOpen(false)}
              onLogin={() => setLoggedIn(true)}
            />
          </div>
        )}

        {adresTespitOpen && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 750, maxHeight: 'calc(100% - 24px)', overflow: 'auto' }}>
            <AdresTespitModal onClose={() => setAdresTespitOpen(false)} />
          </div>
        )}

        {geocodeOpen && (
          <div style={{ position: 'absolute', top: 64, left: 72, zIndex: 740 }}>
            <SearchGeocodeModal
              onClose={() => setGeocodeOpen(false)}
              onSearch={handleGeocodeSearch}
            />
          </div>
        )}
      </div>

      <MapStatusBar
        crs={crs}
        crsOptions={['WGS84 (EPSG:4326)', 'UTM 28N (EPSG:32628)']}
        onCrsChange={(e) => setCrs(e.target.value)}
        crsLabel="Coordinate system"
        scaleLabel="Scale"
        latLabel="Lat"
        lonLabel="Lon"
        copyLabel="Copy coordinates"
        lat={cursor.lat}
        lon={cursor.lon}
        scale={scale}
        scaleOptions={['1:50,000', '1:25,000', '1:10,000']}
        onScaleChange={(e) => setScale(e.target.value)}
      />
    </div>
  );
}

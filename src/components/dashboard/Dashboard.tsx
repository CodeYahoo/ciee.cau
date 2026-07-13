import { useState, type CSSProperties } from 'react'
import type { Tractor } from '../../types'
import campusMain from '../../../beijing1.jpg'
import { Stats } from './Stats'
import { MapView } from './MapView'
import { Detail } from './Detail'
import { VehicleTable } from './VehicleTable'

export function Dashboard({ tractors, selected, onSelect, onNavigate }: { tractors: Tractor[]; selected?: Tractor; onSelect: (id: string) => void; onNavigate: (v: 'tracks') => void }) {
  const [locate, setLocate] = useState(0)
  return <div className="dashboard" style={{ '--campus-main': `url(${campusMain})` } as CSSProperties}>
    <div className="dashboard-photo" aria-hidden="true" />
    <Stats tractors={tractors} />
    <div className="monitor-grid"><MapView key={locate} tractors={tractors} selected={selected} onSelect={onSelect} /><Detail tractor={selected} onTrack={() => onNavigate('tracks')} onLocate={() => setLocate(value => value + 1)} /></div>
    <VehicleTable tractors={tractors} selected={selected?.id} onSelect={onSelect} />
  </div>
}

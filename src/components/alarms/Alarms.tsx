import { useMemo, useState } from 'react'
import { AlertTriangle, BatteryLow, CheckCircle2, WifiOff, ShieldAlert } from 'lucide-react'
import type { Alarm, Tractor } from '../../types'

const icons = { '低电量': BatteryLow, '离线': WifiOff, '越界': ShieldAlert }

export function Alarms({ alarms, tractors }: { alarms: Alarm[]; tractors: Tractor[] }) {
  const [filter, setFilter] = useState('all')
  const [handled, setHandled] = useState<string[]>([])
  const list = useMemo(() => alarms.filter(a => filter === 'all' || a.type === filter), [alarms, filter])

  return <div className="feature-page">
    <header className="page-heading"><div><h1>告警中心</h1><p>集中处理农机异常、终端离线与作业越界事件</p></div></header>
    <div className="alarm-stats">
      <div><AlertTriangle/><strong>{alarms.length}</strong><span>今日告警</span></div>
      <div><ShieldAlert/><strong>{alarms.filter(a => a.level === 'critical').length}</strong><span>紧急事件</span></div>
      <div><CheckCircle2/><strong>{handled.length}</strong><span>已处理</span></div>
    </div>
    <section className="panel alarm-panel">
      <div className="filterbar"><span>告警类型</span>{['all', '低电量', '离线', '越界'].map(v => <button className={filter === v ? 'active' : ''} onClick={() => setFilter(v)} key={v}>{v === 'all' ? '全部' : v}</button>)}</div>
      {list.map(a => {
        const Icon = icons[a.type]
        const tractor = tractors.find(t => t.id === a.tractorId)
        const done = handled.includes(a.id)
        return <article className={`alarm-row ${done ? 'handled' : ''}`} key={a.id}>
          <div className={`alarm-icon ${a.level}`}><Icon/></div>
          <div><strong>{a.type} · {tractor?.plate}</strong><p>{a.message}</p></div>
          <span>{a.time}</span>
          <button disabled={done} onClick={() => setHandled(v => [...v, a.id])}>{done ? '已处理' : '标记处理'}</button>
        </article>
      })}
    </section>
  </div>
}

import { useMemo, useState } from 'react'
import { Bell, Clock3, LogOut, MapPinned, MonitorDot, RadioTower, Route, Satellite, Tractor as TractorIcon, UserRound } from 'lucide-react'
import type { Alarm, Tractor } from '../types'
import { Dashboard } from './dashboard/Dashboard'
import { Fleet } from './fleet/Fleet'
import { Tracks } from './tracks/Tracks'
import { Alarms } from './alarms/Alarms'
type View='overview'|'fleet'|'tracks'|'alarms'
const nav=[['overview','监控总览',MonitorDot],['fleet','农机管理',TractorIcon],['tracks','轨迹回放',Route],['alarms','告警中心',Bell]] as const
export function Shell({tractors,alarms,onLogout}:{tractors:Tractor[];alarms:Alarm[];onLogout:()=>void}){
 const [view,setView]=useState<View>('overview'),[selected,setSelected]=useState('T001')
 const selectedTractor=useMemo(()=>tractors.find(t=>t.id===selected)||tractors[0],[tractors,selected])
 const content={overview:<Dashboard tractors={tractors} selected={selectedTractor} onSelect={setSelected} onNavigate={setView}/>,fleet:<Fleet tractors={tractors} selected={selected} onSelect={setSelected}/>,tracks:<Tracks tractors={tractors} selected={selected} onSelect={setSelected}/>,alarms:<Alarms alarms={alarms} tractors={tractors}/>} 
 return <div className="app-shell"><aside className="sidebar"><div className="logo"><Satellite/><span>中农北斗CIEE<small>农机监控平台</small></span></div><nav>{nav.map(([id,label,Icon])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}><Icon/><span>{label}</span>{id==='alarms'?<b>{alarms.length}</b>:null}</button>)}</nav><button className="logout" onClick={onLogout}><LogOut/><span>退出登录</span></button></aside>
 <header className="topbar"><div className="mobile-logo"><Satellite/>中农北斗</div><div className="region"><MapPinned/>当前区域：<strong>新疆示范农场</strong></div><div className="top-status"><span className="connected"><i/>连接状态：在线</span><span><Clock3/>{new Date().toLocaleDateString('zh-CN')}</span><button onClick={onLogout}><UserRound/>demo_user</button></div></header>
 <section className="page">{content[view]}</section>
 <nav className="mobile-nav">{nav.map(([id,label,Icon])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}><Icon/><span>{label}</span></button>)}</nav></div>
}

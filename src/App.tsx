import { useEffect, useMemo, useState } from 'react'
import { MockTractorDataService } from './data/mockService'
import type { Alarm, Tractor } from './types'
import { Login } from './components/Login'
import { Shell } from './components/Shell'

const service = new MockTractorDataService()
export default function App(){
  const [authed,setAuthed]=useState(()=>sessionStorage.getItem('bd-auth')==='1')
  const [tractors,setTractors]=useState<Tractor[]>([])
  const [alarms,setAlarms]=useState<Alarm[]>([])
  useEffect(()=>{ Promise.all([service.getTractors(),service.getAlarms()]).then(([t,a])=>{setTractors(t);setAlarms(a)}) },[])
  useEffect(()=>{ const id=setInterval(()=>setTractors(v=>service.tick(v)),3000); return()=>clearInterval(id) },[])
  const login=(u:string,p:string)=>{ if(u==='admin'&&p==='123456'){sessionStorage.setItem('bd-auth','1');setAuthed(true);return true} return false }
  const logout=()=>{sessionStorage.removeItem('bd-auth');setAuthed(false)}
  const stable = useMemo(()=>({tractors,alarms}),[tractors,alarms])
  return authed?<Shell {...stable} onLogout={logout}/>:<Login onLogin={login}/>
}

import { useState, type CSSProperties, type FormEvent } from 'react'
import { LockKeyhole, Satellite, UserRound } from 'lucide-react'
import campusMain from '../../beijing1.jpg'
import campusGate from '../../beijing2.png'
import campusDetail from '../../beijing3.jpg'
export function Login({onLogin}:{onLogin:(u:string,p:string)=>boolean}){
 const [user,setUser]=useState('admin'),[pass,setPass]=useState('123456'),[error,setError]=useState('')
 const submit=(e:FormEvent)=>{e.preventDefault(); if(!onLogin(user,pass)) setError('账号或密码错误，请使用演示账号登录')}
 return <main className="login-page" style={{'--campus-main':`url(${campusMain})`,'--campus-gate':`url(${campusGate})`,'--campus-detail':`url(${campusDetail})`} as CSSProperties}><div className="login-backdrop" aria-hidden="true"/><div className="login-orbit orbit-a"/><div className="login-orbit orbit-b"/>
   <section className="login-brand"><div className="brand-mark"><Satellite/></div><h1>中农北斗智能农机监管平台V1.0</h1><p>农机监控管理平台</p><div className="signal-line"><span/> 北斗定位服务运行正常</div></section>
   <form className="login-card" onSubmit={submit}><div className="login-card-art art-gate" aria-hidden="true"/><div className="login-card-art art-detail" aria-hidden="true"/><div className="login-heading"><h2>欢迎登录</h2><p>新疆示范农场 · 智能作业监管系统</p></div>
    <label>账号<div className="input-wrap"><UserRound/><input aria-label="账号" value={user} onChange={e=>setUser(e.target.value)}/></div></label>
    <label>密码<div className="input-wrap"><LockKeyhole/><input aria-label="密码" type="password" value={pass} onChange={e=>setPass(e.target.value)}/></div></label>
    {error?<p className="form-error" role="alert">{error}</p>:null}<button className="primary login-btn">进入监控平台</button>
    <div className="demo-tip">演示账号：admin　密码：123456</div>
   </form><footer>© 2026 中农北斗农机监管平台 · CAU · CIEE</footer></main>
}

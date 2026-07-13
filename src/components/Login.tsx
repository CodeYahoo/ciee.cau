import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { LockKeyhole, Satellite, UserRound } from 'lucide-react'
import campusMain from '../../beijing1.jpg'
import campusGate from '../../beijing2.png'
import campusDetail from '../../beijing3.jpg'

export function Login({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const slides = [campusMain, campusGate, campusDetail]
  const [slide, setSlide] = useState(0)
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('123456')
  const [error, setError] = useState('')

  useEffect(() => {
    const id = window.setInterval(() => setSlide(value => (value + 1) % slides.length), 5000)
    return () => window.clearInterval(id)
  }, [slides.length])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!onLogin(user, pass)) setError('账号或密码错误，请使用演示账号登录')
  }

  return <main className="login-page" style={{ '--campus-main': `url(${slides[slide]})`, '--campus-gate': `url(${campusGate})`, '--campus-detail': `url(${campusDetail})` } as CSSProperties}>
    <div className="login-backdrop" aria-hidden="true" />
    <div className="login-orbit orbit-a" /><div className="login-orbit orbit-b" />
    <section className="login-brand"><div className="brand-mark"><Satellite /></div><h1>中农北斗智能农机监控平台 V1.0</h1><p>农机监控管理平台</p><div className="signal-line"><span /> 北斗定位服务运行正常</div></section>
    <form className="login-card" onSubmit={submit}>
      <div className="login-card-art art-gate" aria-hidden="true" /><div className="login-card-art art-detail" aria-hidden="true" />
      <div className="login-heading"><h2>欢迎登录</h2><p>新疆示范农场 · 智能作业监控系统</p></div>
      <label>账号<div className="input-wrap"><UserRound /><input aria-label="账号" value={user} onChange={event => setUser(event.target.value)} /></div></label>
      <label>密码<div className="input-wrap"><LockKeyhole /><input aria-label="密码" type="password" value={pass} onChange={event => setPass(event.target.value)} /></div></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="primary login-btn">进入监控平台</button>
      <div className="demo-tip">演示账号：admin　密码：123456</div>
    </form>
    <div className="login-carousel-dots" aria-label="登录背景轮播"><span>背景</span>{slides.map((_, index) => <button type="button" key={index} className={slide === index ? 'active' : ''} aria-label={`切换到第${index + 1}张背景`} onClick={() => setSlide(index)} />)}</div>
    <footer>© 2026 中农北斗农机监控平台 · CAU · CIEE</footer>
  </main>
}

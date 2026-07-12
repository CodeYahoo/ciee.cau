import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Crosshair, Layers3, Minus, Plus, Tractor as TractorIcon } from 'lucide-react'
import type { Tractor } from '../../types'
import { statusMeta } from '../common'

declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string }
    __APP_CONFIG__?: { AMAP_KEY?: string; AMAP_SECURITY_CODE?: string }
  }
}

export function MapView({ tractors, selected, onSelect }: { tractors: Tractor[]; selected?: Tractor; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [satellite, setSatellite] = useState(true)
  const key = window.__APP_CONFIG__?.AMAP_KEY || import.meta.env.VITE_AMAP_KEY || ''
  const securityCode = window.__APP_CONFIG__?.AMAP_SECURITY_CODE || import.meta.env.VITE_AMAP_SECURITY_CODE || ''

  useEffect(() => {
    if (!key || !securityCode || !el.current) return
    window._AMapSecurityConfig = { securityJsCode: securityCode }
    let alive = true
    AMapLoader.load({ key, version: '2.0' }).then((AMap: any) => {
      if (!alive || !el.current) return
      const layers = satellite
        ? [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()]
        : [AMap.createDefaultLayer()]
      map.current = new AMap.Map(el.current, { center: [87.307, 44.022], zoom: 12, layers })
      tractors.forEach(tractor => {
        const marker = new AMap.Marker({
          position: [tractor.position.lng, tractor.position.lat],
          content: `<div class="amap-tractor ${tractor.status}"><span>🚜</span></div>`,
          offset: new AMap.Pixel(-18, -36),
        })
        marker.on('click', () => onSelect(tractor.id))
        map.current.add(marker)
      })
    }).catch(() => undefined)
    return () => { alive = false; map.current?.destroy() }
  }, [key, securityCode, satellite])

  const focus = () => {
    if (selected && map.current) map.current.setZoomAndCenter(15, [selected.position.lng, selected.position.lat])
  }

  return <div className="map-wrap">
    <div ref={el} className="amap-host"/>
    {!key || !securityCode ? <div className="fallback-map">
      <div className="field-lines"/>
      <span className="place p1">昌吉回族自治州</span>
      <span className="place p2">玛纳斯县</span>
      <span className="place p3">新疆维吾尔自治区</span>
      {tractors.map((tractor, index) => {
        const x = 10 + (index % 5) * 19 + (Math.floor(index / 5) % 2) * 3
        const y = 15 + Math.floor(index / 5) * 19
        return <button aria-label={tractor.plate} key={tractor.id} onClick={() => onSelect(tractor.id)} className={`map-marker ${tractor.status} ${selected?.id === tractor.id ? 'selected' : ''}`} style={{ left: `${x}%`, top: `${y}%` }}><TractorIcon/><span>{tractor.plate}</span></button>
      })}
      {selected ? <svg className="track-line" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="15,70 28,65 36,50 54,58 72,37 87,42"/></svg> : null}
      <div className="map-notice">演示地图 · 配置高德 Key 后自动启用卫星图</div>
    </div> : null}
    <div className="map-tools"><button aria-label="放大" onClick={() => map.current?.zoomIn()}><Plus/></button><button aria-label="缩小" onClick={() => map.current?.zoomOut()}><Minus/></button><button aria-label="定位车辆" onClick={focus}><Crosshair/></button></div>
    <div className="layer-toggle"><button className={satellite ? 'active' : ''} onClick={() => setSatellite(true)}>卫星</button><button className={!satellite ? 'active' : ''} onClick={() => setSatellite(false)}>标准</button></div>
    <div className="legend">{Object.entries(statusMeta).map(([status, meta]) => <span key={status}><i style={{ background: meta.color }}/>{meta.label}</span>)}</div>
    <button className="layer-mobile" aria-label="图层"><Layers3/></button>
  </div>
}

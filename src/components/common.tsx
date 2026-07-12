import type { TractorStatus } from '../types'
export const statusMeta:Record<TractorStatus,{label:string;color:string}>={online:{label:'在线',color:'#49d17d'},working:{label:'作业中',color:'#ffc43d'},alarm:{label:'告警',color:'#ff565c'},offline:{label:'离线',color:'#8794a3'}}
export function Status({value}:{value:TractorStatus}){const m=statusMeta[value];return <span className="status" style={{color:m.color}}><i style={{background:m.color}}/>{m.label}</span>}
export function Empty(){return <div className="empty">没有符合条件的数据</div>}

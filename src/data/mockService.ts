import type { Alarm, TrackPoint, Tractor, TractorDataService, TractorStatus } from '../types'

const center = { lng: 87.307, lat: 44.022 }
const names = ['张师傅','李师傅','王师傅','赵师傅','刘师傅','陈师傅','杨师傅','周师傅','吴师傅','郑师傅']
const states: TractorStatus[] = ['online','working','online','online','alarm','working','online','offline','working','online','online','alarm','working','online','offline','online','working','online','online','online']

function trackFor(lng: number, lat: number, i: number): TrackPoint[] {
  return Array.from({ length: 24 }, (_, p) => ({ lng: lng - .013 + p * .0011, lat: lat + Math.sin((p + i) / 3) * .003, accuracy: 1.2, heading: 35 + p, updatedAt: new Date(Date.now() - (23-p)*60000).toISOString(), timestamp: Date.now() - (23-p)*60000 }))
}

const tractors: Tractor[] = Array.from({ length: 20 }, (_, i) => {
  const col = i % 5, row = Math.floor(i / 5)
  const lng = center.lng + (col - 2) * .025 + (row % 2) * .008
  const lat = center.lat + (row - 1.5) * .021 + Math.sin(i) * .004
  const status = states[i]
  const progress = 35 + ((i * 11) % 61)
  return { id: `T${String(i+1).padStart(3,'0')}`, plate: `新A·T${String(i+1).padStart(3,'0')}`, model: i%3===0?'东方红 LX2204':i%3===1?'雷沃 M2004-5G':'约翰迪尔 8R', operator: names[i%names.length], status, speed: status==='offline'||status==='alarm'?0:Number((6+(i*1.7)%12).toFixed(1)), battery: status==='alarm'?18:58+(i*7)%40, position: { lng, lat, accuracy: 1.2+(i%4)*.3, heading: (35+i*27)%360, updatedAt: new Date().toISOString() }, task: { name: i%2?'耕整地作业':'播种作业', field: `地块${String.fromCharCode(65+(i%4))}${String(i+1).padStart(2,'0')}`, progress, completedMu: Math.round(63*progress/100), totalMu: 63 }, track: trackFor(lng,lat,i) }
})

const alarms: Alarm[] = [
  { id:'A01', tractorId:'T005', type:'低电量', level:'critical', message:'设备电量低于 20%，请及时充电', time:'10:21', handled:false },
  { id:'A02', tractorId:'T008', type:'离线', level:'warning', message:'北斗终端连续 15 分钟无数据', time:'09:46', handled:false },
  { id:'A03', tractorId:'T012', type:'越界', level:'critical', message:'车辆驶出指定作业地块', time:'08:32', handled:false }
]

export class MockTractorDataService implements TractorDataService {
  async getTractors() { return structuredClone(tractors) }
  async getAlarms() { return structuredClone(alarms) }
  tick(items: Tractor[]) { return items.map((t,i) => t.status==='working'||t.status==='online' ? { ...t, speed: Number(Math.max(0,t.speed+(i%2?.2:-.1)).toFixed(1)), position:{ ...t.position, lng:t.position.lng+Math.cos(t.position.heading*Math.PI/180)*.00008, lat:t.position.lat+Math.sin(t.position.heading*Math.PI/180)*.00008, updatedAt:new Date().toISOString() }} : t) }
}

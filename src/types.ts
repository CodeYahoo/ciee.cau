export type TractorStatus = 'online' | 'working' | 'alarm' | 'offline'
export type Position = { lng: number; lat: number; accuracy: number; heading: number; updatedAt: string }
export type TrackPoint = Position & { timestamp: number }
export type Task = { name: string; field: string; progress: number; completedMu: number; totalMu: number }
export type Tractor = { id: string; plate: string; model: string; operator: string; status: TractorStatus; speed: number; battery: number; position: Position; task: Task; track: TrackPoint[] }
export type Alarm = { id: string; tractorId: string; type: '低电量' | '离线' | '越界'; level: 'warning' | 'critical'; message: string; time: string; handled: boolean }
export interface TractorDataService { getTractors(): Promise<Tractor[]>; getAlarms(): Promise<Alarm[]>; tick(items: Tractor[]): Tractor[] }

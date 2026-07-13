import { useEffect, useMemo, useState, type DragEvent } from 'react'
import { CheckCircle2, Clock3, GripVertical, Layers3, Pause, Play, Tractor as TractorIcon } from 'lucide-react'
import type { Tractor } from '../../types'

const operations = ['耙地', '犁地', '旋地', '播种', '施肥', '喷药', '收获']
const fields = ['A-01', 'A-02', 'A-03', 'B-01', 'B-02', 'B-03', 'C-01', 'C-02', 'C-03', 'D-01', 'D-02', 'D-03']
type Assignment = { tractorId: string; fieldId: string; operation: string; elapsed: number; remaining: number; duration: number; running: boolean; completed: boolean }

const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`

export function WorkPlan({ tractors }: { tractors: Tractor[] }) {
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({})
  const [dragging, setDragging] = useState<string>()
  const [notice, setNotice] = useState('将右侧农机拖入左侧地块，开始编制作业计划')

  useEffect(() => {
    const timer = window.setInterval(() => setAssignments(current => {
      let changed = false
      const next = Object.fromEntries(Object.entries(current).map(([fieldId, assignment]) => {
        if (!assignment.running || assignment.completed) return [fieldId, assignment]
        changed = true
        const elapsed = Math.min(assignment.duration, assignment.elapsed + 1)
        return [fieldId, { ...assignment, elapsed, remaining: assignment.duration - elapsed, completed: elapsed >= assignment.duration, running: elapsed < assignment.duration }]
      }))
      return changed ? next : current
    }), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const assignedIds = useMemo(() => new Set(Object.values(assignments).map(item => item.tractorId)), [assignments])
  const tractorById = useMemo(() => new Map(tractors.map(tractor => [tractor.id, tractor])), [tractors])

  const assign = (fieldId: string, tractorId: string) => {
    const index = tractors.findIndex(tractor => tractor.id === tractorId)
    const duration = 90 + (Math.max(index, 0) % 4) * 45
    setAssignments(current => ({ ...current, [fieldId]: { tractorId, fieldId, operation: operations[Math.max(index, 0) % operations.length], elapsed: 0, remaining: duration, duration, running: false, completed: false } }))
    setNotice(`${tractorById.get(tractorId)?.plate ?? tractorId} 已投入 ${fieldId}，点击农机图标开始模拟作业`)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>, fieldId: string) => {
    event.preventDefault()
    const tractorId = event.dataTransfer.getData('text/plain') || dragging
    if (tractorId) assign(fieldId, tractorId)
    setDragging(undefined)
  }

  const toggle = (fieldId: string) => setAssignments(current => {
    const assignment = current[fieldId]
    if (!assignment || assignment.completed) return current
    setNotice(`${tractorById.get(assignment.tractorId)?.plate ?? assignment.tractorId} ${assignment.running ? '已暂停' : '开始作业'}`)
    return { ...current, [fieldId]: { ...assignment, running: !assignment.running } }
  })

  const changeOperation = (fieldId: string, operation: string) => setAssignments(current => ({ ...current, [fieldId]: { ...current[fieldId], operation } }))

  return <div className="feature-page workplan-page">
    <div className="page-heading"><div><h1>作业计划</h1><p>拖拽农机到地块，安排作业并实时查看作业时长</p></div><div className="workplan-notice"><Layers3 />{notice}</div></div>
    <div className="workplan-layout">
      <section className="field-board panel"><div className="panel-title"><div><strong>示范农场作业地块</strong><span>12 个可排期地块 · 新疆示范农场</span></div><span className="board-hint">拖入即可投入作业</span></div><div className="field-grid">{fields.map(fieldId => {
        const assignment = assignments[fieldId]
        const tractor = assignment ? tractorById.get(assignment.tractorId) : undefined
        const progress = assignment ? Math.round(assignment.elapsed / assignment.duration * 100) : 0
        return <div key={fieldId} className={`field-slot ${assignment ? 'occupied' : ''} ${assignment?.running ? 'running' : ''} ${assignment?.completed ? 'completed' : ''}`} onDragOver={event => event.preventDefault()} onDrop={event => onDrop(event, fieldId)}>
          <div className="field-label"><strong>{fieldId}</strong><span>{assignment ? assignment.operation : '空闲地块'}</span></div>
          <div className="field-lines" aria-hidden="true" />
          {assignment && tractor ? <button className="assigned-tractor" title={`${tractor.plate} · ${assignment.operation}`} onClick={() => toggle(fieldId)}><TractorIcon /><i>{assignment.running ? <Pause /> : assignment.completed ? <CheckCircle2 /> : <Play />}</i><b>{tractor.plate}</b></button> : <div className="drop-target"><GripVertical /><span>拖入农机</span></div>}
          {assignment ? <div className="field-progress"><span style={{ width: `${progress}%` }} /></div> : null}
        </div>
      })}</div></section>
      <aside className="tractor-rail panel"><div className="panel-title"><div><strong>待安排农机</strong><span>{tractors.length - assignedIds.size} 台可投入</span></div><TractorIcon /></div><div className="tractor-rail-list">{tractors.map(tractor => <div key={tractor.id} className={`plan-tractor ${assignedIds.has(tractor.id) ? 'assigned' : ''}`} draggable={!assignedIds.has(tractor.id)} onDragStart={event => { event.dataTransfer.setData('text/plain', tractor.id); setDragging(tractor.id) }} onDragEnd={() => setDragging(undefined)}><GripVertical className="drag-handle" /><span className={`plan-tractor-icon ${tractor.status}`}><TractorIcon /></span><div><strong>{tractor.plate}</strong><small>{tractor.model}</small></div><em>{assignedIds.has(tractor.id) ? '已排期' : '拖拽'}</em></div>)}</div></aside>
    </div>
    <section className="plan-timeline panel"><div className="panel-title"><div><strong>作业执行状态</strong><span>点击地块中的农机图标开始或暂停模拟</span></div><Clock3 /></div><div className="plan-status-list">{Object.values(assignments).length === 0 ? <div className="empty">尚未安排作业</div> : Object.entries(assignments).map(([fieldId, assignment]) => { const tractor = tractorById.get(assignment.tractorId); const progress = Math.round(assignment.elapsed / assignment.duration * 100); return <div className="plan-status-row" key={fieldId}><span className="status-field">{fieldId}</span><strong>{tractor?.plate}</strong><select value={assignment.operation} onChange={event => changeOperation(fieldId, event.target.value)}>{operations.map(operation => <option key={operation}>{operation}</option>)}</select><div className="status-bar"><i style={{ width: `${progress}%` }} /></div><span>{formatTime(assignment.elapsed)} / {formatTime(assignment.duration)}</span><b className={assignment.completed ? 'done' : assignment.running ? 'live' : ''}>{assignment.completed ? '已完成' : assignment.running ? '作业中' : '待开始'}</b></div> })}</div></section>
  </div>
}

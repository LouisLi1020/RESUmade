import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Experience } from '@/types/resume'
import type { Education } from '@/types/resume'

interface SortableItemProps {
  id: string
  title: string
  subtitle?: string
}

function SortableItem({ id, title, subtitle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 py-2 px-3 rounded border bg-white border-slate-200 ${isDragging ? 'shadow-lg opacity-90' : ''}`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 6a1 1 0 011 1v1a1 1 0 11-2 0V9a1 1 0 011-1zm0 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm8-12a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zm0 6a1 1 0 00-1 1v1a1 1 0 102 0V9a1 1 0 00-1-1zm0 6a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 truncate">{subtitle}</div>}
      </div>
    </div>
  )
}

interface DraggableExperienceListProps {
  experiences: Experience[]
  onReorder: (reordered: Experience[]) => void
}

export function DraggableExperienceList({ experiences, onReorder }: DraggableExperienceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const ids = experiences.map((e) => e.id)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = experiences.findIndex((e) => e.id === active.id)
    const newIndex = experiences.findIndex((e) => e.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(experiences, oldIndex, newIndex))
  }

  if (experiences.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-600">Drag to reorder experience</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {experiences.map((exp) => (
              <SortableItem
                key={exp.id}
                id={exp.id}
                title={exp.companyOrProjectName || 'Untitled'}
                subtitle={exp.title || exp.timePeriod}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

interface DraggableEducationListProps {
  education: Education[]
  onReorder: (reordered: Education[]) => void
}

export function DraggableEducationList({ education, onReorder }: DraggableEducationListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const ids = education.map((e) => e.id)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = education.findIndex((e) => e.id === active.id)
    const newIndex = education.findIndex((e) => e.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(education, oldIndex, newIndex))
  }

  if (education.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-600">Drag to reorder education</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {education.map((ed) => (
              <SortableItem
                key={ed.id}
                id={ed.id}
                title={ed.schoolName || 'Untitled'}
                subtitle={ed.degreeOrTitle || ed.timePeriod}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

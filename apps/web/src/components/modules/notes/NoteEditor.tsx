import type { ReactNode } from 'react'
import type { CaseFile, OfficerNote, Person, Vehicle } from '../../../types'
import { AttachPicker } from '../shared/AttachPicker'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader } from '../shared/ui'
import { BackIcon } from '../people/icons'

interface NoteEditorProps {
  note: OfficerNote
  people: Person[]
  vehicles: Vehicle[]
  cases: CaseFile[]
  onChange: (note: OfficerNote) => void
  onDelete: (noteId: string) => void
  onBack: () => void
}

/** Simple textarea editor for a single `OfficerNote`, with an optional
 * single link out to a person/vehicle/case (the "провалиться" EntityChip). */
export function NoteEditor({ note, people, vehicles, cases, onChange, onDelete, onBack }: NoteEditorProps) {
  const linkedPerson = note.linkedPersonId ? people.find((p) => p.id === note.linkedPersonId) : undefined
  const linkedVehicle = note.linkedVehicleId ? vehicles.find((v) => v.id === note.linkedVehicleId) : undefined
  const linkedCase = note.linkedCaseId ? cases.find((c) => c.id === note.linkedCaseId) : undefined

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title="Заметка" subtitle={note.time} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <input
          value={note.title}
          onChange={(e) => onChange({ ...note, title: e.target.value })}
          placeholder="Заголовок"
          className="rounded-[8px] bg-ink/5 px-3 py-2 text-[15px] font-semibold text-ink placeholder:text-ink/30 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <input
            value={note.category}
            onChange={(e) => onChange({ ...note, category: e.target.value })}
            placeholder="Категория"
            className="w-40 rounded-[6px] bg-ink/5 px-2.5 py-1.5 text-[12px] text-ink placeholder:text-ink/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange({ ...note, isPinned: !note.isPinned })}
            className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[12px] font-medium ${
              note.isPinned ? 'bg-[#48adec]/20 text-[#48adec]' : 'bg-ink/10 text-ink/50 hover:text-ink/80'
            }`}
          >
            {note.isPinned ? '★ Закреплена' : '☆ Закрепить'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            className="ml-auto rounded-[6px] bg-[#e8637a]/15 px-2.5 py-1.5 text-[12px] font-medium text-[#ff8ba0] hover:bg-[#e8637a]/25"
          >
            Удалить
          </button>
        </div>

        <textarea
          value={note.content}
          onChange={(e) => onChange({ ...note, content: e.target.value })}
          placeholder="Текст заметки..."
          rows={8}
          className="w-full resize-none rounded-[8px] bg-ink/5 p-3 text-[13px] leading-relaxed text-ink/90 placeholder:text-ink/30 focus:outline-none"
        />

        <div className="rounded-[8px] bg-ink/5 p-4">
          <div className="mb-2 text-[13px] font-semibold text-ink/70">Связанная запись</div>
          <div className="flex flex-col gap-2">
            <LinkSlot
              label="Человек"
              chip={linkedPerson && <EntityChip type="person" id={linkedPerson.id} label={`${linkedPerson.firstName} ${linkedPerson.lastName}`} />}
              onRemove={() => onChange({ ...note, linkedPersonId: undefined })}
              picker={
                !linkedPerson && (
                  <AttachPicker
                    items={people}
                    getId={(p) => p.id}
                    getLabel={(p) => `${p.firstName} ${p.lastName}`}
                    excludeIds={[]}
                    placeholder="Найти человека..."
                    onAttach={(p) => onChange({ ...note, linkedPersonId: p.id })}
                  />
                )
              }
            />
            <LinkSlot
              label="Транспорт"
              chip={linkedVehicle && <EntityChip type="vehicle" id={linkedVehicle.id} label={linkedVehicle.model} sublabel={linkedVehicle.plate} />}
              onRemove={() => onChange({ ...note, linkedVehicleId: undefined })}
              picker={
                !linkedVehicle && (
                  <AttachPicker
                    items={vehicles}
                    getId={(v) => v.id}
                    getLabel={(v) => v.model}
                    getSublabel={(v) => v.plate}
                    excludeIds={[]}
                    placeholder="Найти транспорт..."
                    onAttach={(v) => onChange({ ...note, linkedVehicleId: v.id })}
                  />
                )
              }
            />
            <LinkSlot
              label="Дело"
              chip={linkedCase && <EntityChip type="case" id={linkedCase.id} label={linkedCase.title} sublabel={linkedCase.caseNumber} />}
              onRemove={() => onChange({ ...note, linkedCaseId: undefined })}
              picker={
                !linkedCase && (
                  <AttachPicker
                    items={cases}
                    getId={(c) => c.id}
                    getLabel={(c) => c.title}
                    getSublabel={(c) => c.caseNumber}
                    excludeIds={[]}
                    placeholder="Найти дело..."
                    onAttach={(c) => onChange({ ...note, linkedCaseId: c.id })}
                  />
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkSlot({
  label,
  chip,
  picker,
  onRemove,
}: {
  label: string
  chip: ReactNode
  picker: ReactNode
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="w-20 shrink-0 text-ink/40">{label}</span>
      {chip ? (
        <div className="flex flex-1 items-center justify-between gap-2">
          {chip}
          <button type="button" onClick={onRemove} className="text-[11px] text-ink/40 hover:text-ink/80">
            Убрать
          </button>
        </div>
      ) : (
        <div className="flex-1">{picker}</div>
      )}
    </div>
  )
}

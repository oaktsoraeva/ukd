import { useState } from 'react'
import { Cell, Dropdown } from '@ds'
import { CONTRACTORS, DOC_STATUS, SOURCE_DOCS } from '../data'

interface DocumentPickerProps {
  value: string | null
  onChange: (docId: string) => void
  isError?: boolean
  errorMessage?: string
}

/**
 * «Основание УКД» — обязательный выбор УПД или счёта-фактуры
 * (узлы 4774:67451 и 4788:110741). Подпись под полем постоянная и
 * при ошибке заменяется красной — это штатное поведение китового Dropdown.
 */
export function DocumentPicker({ value, onChange, isError, errorMessage }: DocumentPickerProps) {
  const [query, setQuery] = useState('')

  const selected = SOURCE_DOCS.find((d) => d.id === value)
  const needle = query.trim().toLowerCase()

  const matches = SOURCE_DOCS.filter((doc) => {
    if (!needle) return true
    const contractor = CONTRACTORS.find((c) => c.id === doc.contractorId)
    return (
      doc.title.toLowerCase().includes(needle) ||
      (contractor?.listName ?? '').toLowerCase().includes(needle)
    )
  })

  return (
    <Dropdown
      label="Основание УКД"
      placeholder="Название документа или контрагента"
      description="Выберите УПД или счёт‑фактуру для корректировки"
      value={selected?.title}
      hasSearch
      searchPlaceholder="Поиск"
      onSearchChange={setQuery}
      isEmpty={matches.length === 0}
      isError={isError}
      errorMessage={errorMessage ?? 'Выберите УПД или счёт‑фактуру'}
    >
      {matches.map((doc) => (
        <Cell
          key={doc.id}
          /* Статус стоит над названием — узел 4774:67858 */
          subtitle={DOC_STATUS[doc.status].label}
          title={doc.title}
          description={CONTRACTORS.find((c) => c.id === doc.contractorId)?.listName}
          leftAccessory={
            <img
              className="ukd-doc-logo"
              src={DOC_STATUS[doc.status].logo}
              width={32}
              height={32}
              alt=""
            />
          }
          onClick={() => onChange(doc.id)}
        />
      ))}
    </Dropdown>
  )
}

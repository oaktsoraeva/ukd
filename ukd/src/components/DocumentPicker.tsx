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
 *
 * Поиска в справочнике нет: в макете 4774:67858 попап открывается сразу
 * списком, документов-оснований всего пять.
 */
export function DocumentPicker({ value, onChange, isError, errorMessage }: DocumentPickerProps) {
  const selected = SOURCE_DOCS.find((d) => d.id === value)

  return (
    <Dropdown
      label="Основание УКД"
      placeholder="Название документа или контрагента"
      description="Выберите УПД или счёт‑фактуру для корректировки"
      value={selected?.title}
      isError={isError}
      errorMessage={errorMessage ?? 'Выберите УПД или счёт‑фактуру'}
    >
      {SOURCE_DOCS.map((doc) => (
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

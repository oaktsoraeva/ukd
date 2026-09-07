import type { ReactNode } from 'react'
import { FieldRow } from '../ui/FieldRow'
import { SchemaField } from '../ui/SchemaField'
import type { BlockValues, CorrectionBlock } from '../../types'

interface SchemaBlockBodyProps {
  block: CorrectionBlock
  values: BlockValues
  errors: Record<string, string>
  onChange: (name: string, value: string) => void
  /** Месяц, на котором открывается календарь при пустом поле даты */
  dateAnchor: string
  /** Дополнительные поля перед схемой — шапка пикера у «Грузополучателя» */
  children?: ReactNode
}

/**
 * Тело секции для блоков, которые являются списком подписанных полей.
 * Поля со span='half' группируются в строки по два — «Номер» и «Дата»
 * стоят рядом в колонке 720 (узел 4827:88391).
 */
export function SchemaBlockBody({
  block,
  values,
  errors,
  onChange,
  dateAnchor,
  children,
}: SchemaBlockBodyProps) {
  const rows: ReactNode[] = []
  let index = 0

  while (index < block.fields.length) {
    const field = block.fields[index]
    const pair = field.span === 'half' && block.fields[index + 1]?.span === 'half'
      ? block.fields[index + 1]
      : null

    const cell = (schema: typeof field) => (
      <SchemaField
        field={schema}
        name={schema.name}
        value={values[schema.name] ?? ''}
        error={errors[schema.name]}
        onChange={onChange}
        dateAnchor={dateAnchor}
      />
    )

    if (pair) {
      rows.push(
        <FieldRow key={field.name}>
          {cell(field)}
          {cell(pair)}
        </FieldRow>,
      )
      index += 2
      continue
    }

    rows.push(<div key={field.name}>{cell(field)}</div>)
    index += 1
  }

  return (
    <>
      {children}
      {rows}
    </>
  )
}

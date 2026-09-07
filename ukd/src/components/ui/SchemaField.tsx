import { Input } from '@ds'
import { CounterInput } from './CounterInput'
import { DateField } from './DateField'
import { digitsOnly, maskMoney, maskQuantity } from '../../lib/format'
import type { FieldSchema } from '../../types'

interface SchemaFieldProps {
  field: FieldSchema
  /** Ключ в BlockValues — у копий повторяемой группы отличается от field.name */
  name: string
  value: string
  error?: string
  onChange: (name: string, value: string) => void
  /** Месяц, на котором открывается календарь при пустом поле даты */
  dateAnchor?: string
}

/** Маска по типу поля. Все значения в модели — строки */
function applyMask(field: FieldSchema, raw: string): string {
  switch (field.kind) {
    case 'digits':
      return digitsOnly(raw, field.digits)
    case 'money':
      return maskMoney(raw)
    case 'quantity':
      return maskQuantity(raw)
    default:
      // Не обрезаем по maxLength: макет требует дать переполнить поле
      // и показать «Сократите название до N символов» (узел 4574:110642)
      return raw
  }
}

/** Одно поле формы по FieldSchema */
export function SchemaField({
  field,
  name,
  value,
  error,
  onChange,
  dateAnchor = '',
}: SchemaFieldProps) {
  if (field.kind === 'date') {
    return (
      <DateField
        label={field.label}
        value={value}
        anchor={dateAnchor}
        placeholder={field.placeholder}
        isDisabled={field.isDisabled}
        isError={Boolean(error)}
        errorMessage={error}
        onChange={(next) => onChange(name, next)}
      />
    )
  }

  if (field.maxLength !== undefined) {
    return (
      <CounterInput
        label={field.label}
        value={value}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        isDisabled={field.isDisabled}
        isError={Boolean(error)}
        errorMessage={error}
        isMultiline={field.isMultiline}
        onChange={(next) => onChange(name, applyMask(field, next))}
      />
    )
  }

  return (
    <Input
      label={field.label}
      placeholder={field.placeholder}
      value={value}
      isDisabled={field.isDisabled}
      isError={Boolean(error)}
      errorMessage={error}
      onChange={(next) => onChange(name, applyMask(field, next))}
    />
  )
}

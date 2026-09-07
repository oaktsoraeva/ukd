import { ContractorPicker } from '../ContractorPicker'
import { SchemaField } from '../ui/SchemaField'
import type { BlockValues, Contractor, CorrectionBlock, FieldSchema } from '../../types'

interface PartyBlockBodyProps {
  block: CorrectionBlock
  values: BlockValues
  errors: Record<string, string>
  onChange: (name: string, value: string) => void
  onPickContractor: (contractor: Contractor) => void
}

/**
 * Тело секции «Грузополучатель» — узел 4827:88396.
 * Первое поле — пикер из справочника, он же автозаполняет остальные.
 * Поля видны сразу, даже пустыми: плейсхолдеры узла 4871:93835.
 */
export function PartyBlockBody({
  block,
  values,
  errors,
  onChange,
  onPickContractor,
}: PartyBlockBodyProps) {
  const [picker, ...rest] = block.fields as [FieldSchema, ...FieldSchema[]]

  return (
    <>
      <ContractorPicker
        label={picker.label}
        placeholder={picker.placeholder ?? ''}
        value={values.name ?? ''}
        onPick={onPickContractor}
        isError={Boolean(errors[picker.name])}
        errorMessage={errors[picker.name]}
      />

      {rest.map((field) => (
        <SchemaField
          key={field.name}
          field={field}
          name={field.name}
          value={values[field.name] ?? ''}
          error={errors[field.name]}
          onChange={onChange}
        />
      ))}
    </>
  )
}

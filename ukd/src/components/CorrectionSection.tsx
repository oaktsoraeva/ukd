import { SchemaBlockBody } from './blocks/SchemaBlockBody'
import { PartyBlockBody } from './blocks/PartyBlockBody'
import { SectionHeader } from './ui/SectionHeader'
import type { BlockValues, Contractor, CorrectionBlock } from '../types'

interface CorrectionSectionProps {
  block: CorrectionBlock
  values: BlockValues
  /** Значения основания — подпись «Было: …» */
  sourceValues: BlockValues
  errors: Record<string, string>
  onChange: (name: string, value: string) => void
  onPickContractor: (contractor: Contractor) => void
  onDelete: () => void
  dateAnchor: string
}

/** Одна инлайн-секция шага «Корректировка документа» — узел 4827:88387 */
export function CorrectionSection({
  block,
  values,
  sourceValues,
  errors,
  onChange,
  onPickContractor,
  onDelete,
  dateAnchor,
}: CorrectionSectionProps) {
  const body = () => {
    switch (block.body) {
      case 'party':
        return (
          <PartyBlockBody
            block={block}
            values={values}
            errors={errors}
            onChange={onChange}
            onPickContractor={onPickContractor}
          />
        )
      default:
        return (
          <SchemaBlockBody
            block={block}
            values={values}
            errors={errors}
            onChange={onChange}
            dateAnchor={dateAnchor}
          />
        )
    }
  }

  return (
    <section className="ukd-section">
      <SectionHeader
        title={block.title}
        prevValue={block.summarize(sourceValues)}
        onDelete={onDelete}
      />
      <div className="ukd-fields">{body()}</div>
    </section>
  )
}

import { CorrectionSection } from '../components/CorrectionSection'
import type { BlockValues, Contractor, CorrectionBlock, CorrectionBlockId } from '../types'

interface BlocksStepProps {
  /** Только выбранные на шаге 1 блоки — стикер 4827:75269 */
  blocks: CorrectionBlock[]
  blockValues: Record<CorrectionBlockId, BlockValues>
  sourceValues: Record<CorrectionBlockId, BlockValues>
  errors: Record<CorrectionBlockId, Record<string, string>>
  onChange: (id: CorrectionBlockId, name: string, value: string) => void
  onPickContractor: (id: CorrectionBlockId, contractor: Contractor) => void
  onDelete: (id: CorrectionBlockId) => void
  dateAnchor: string
}

/** Шаг «Корректировка документа» — узел 4827:88387 */
export function BlocksStep({
  blocks,
  blockValues,
  sourceValues,
  errors,
  onChange,
  onPickContractor,
  onDelete,
  dateAnchor,
}: BlocksStepProps) {
  return (
    <div className="ukd-page">
      <div className="ukd-page__header">
        <h1 className="ts-600-4xl ukd-page__title">Корректировка документа</h1>
      </div>

      {blocks.map((block) => (
        <CorrectionSection
          key={block.id}
          block={block}
          values={blockValues[block.id]}
          sourceValues={sourceValues[block.id]}
          errors={errors[block.id] ?? {}}
          onChange={(name, value) => onChange(block.id, name, value)}
          onPickContractor={(contractor) => onPickContractor(block.id, contractor)}
          onDelete={() => onDelete(block.id)}
          dateAnchor={dateAnchor}
        />
      ))}
    </div>
  )
}

import { Input } from '@ds'
import { DocumentPicker } from '../components/DocumentPicker'
import { ChangeChecklist } from '../components/ChangeChecklist'
import { DateField } from '../components/ui/DateField'
import { FieldRow } from '../components/ui/FieldRow'
import type { BlockValues, CorrectionBlock, CorrectionBlockId } from '../types'

interface DocumentStepProps {
  sourceDocId: string | null
  onPickSourceDoc: (docId: string) => void
  ukdNumber: string
  onUkdNumberChange: (value: string) => void
  ukdDate: string
  onUkdDateChange: (value: string) => void
  /** Применимые к основанию блоки: у счёта-фактуры нет документа об отгрузке */
  blocks: CorrectionBlock[]
  /** Значения документа-основания — описания в чеклисте */
  sourceValues: Record<CorrectionBlockId, BlockValues>
  selectedBlocks: Record<CorrectionBlockId, boolean>
  onToggleBlock: (id: CorrectionBlockId) => void
  itemsOn: boolean
  onToggleItems: (next: boolean) => void
  selectedItemCount: number
  sourceItemCount: number
  onOpenPicker: () => void
  /** Валидация зажигается только после нажатия «Продолжить» */
  attempted: boolean
}

/** Шаг 1 «Документ» — узлы 4774:67451 / 4788:88948 / 4788:107434 */
export function DocumentStep({
  sourceDocId,
  onPickSourceDoc,
  ukdNumber,
  onUkdNumberChange,
  ukdDate,
  onUkdDateChange,
  blocks,
  sourceValues,
  selectedBlocks,
  onToggleBlock,
  itemsOn,
  onToggleItems,
  selectedItemCount,
  sourceItemCount,
  onOpenPicker,
  attempted,
}: DocumentStepProps) {
  const hasSource = sourceDocId !== null
  // Скрытый блок не должен держать шаг: считаем только применимые
  const nothingPicked =
    !blocks.some((b) => selectedBlocks[b.id]) && !(itemsOn && selectedItemCount > 0)

  return (
    <div className="ukd-page">
      <div className="ukd-page__header">
        <h1 className="ts-600-4xl ukd-page__title">Документ</h1>
      </div>

      {/* Основание обязательно: свитча «Создать на основе другого документа»
          в новом сценарии нет (узел 4774:67451) */}
      <DocumentPicker
        value={sourceDocId}
        onChange={onPickSourceDoc}
        isError={attempted && !hasSource}
      />

      <div className="ukd-group">
        <div className="ukd-group__header">
          <h2 className="ts-600-xl ukd-group__title">УКД</h2>
        </div>
        <FieldRow>
          <Input label="Номер" placeholder="№" value={ukdNumber} onChange={onUkdNumberChange} />
          <DateField label="Дата" value={ukdDate} anchor={ukdDate} onChange={onUkdDateChange} />
        </FieldRow>
      </div>

      {/* Чеклист появляется только после выбора основания — его описания
          берутся из значений этого документа (узел 4788:88948) */}
      {hasSource && (
        <ChangeChecklist
          blocks={blocks}
          sourceValues={sourceValues}
          selectedBlocks={selectedBlocks}
          onToggleBlock={onToggleBlock}
          itemsOn={itemsOn}
          onToggleItems={onToggleItems}
          selectedItemCount={selectedItemCount}
          sourceItemCount={sourceItemCount}
          onOpenPicker={onOpenPicker}
          error={attempted && nothingPicked ? 'Выберите хотя бы один пункт для корректировки' : undefined}
        />
      )}
    </div>
  )
}

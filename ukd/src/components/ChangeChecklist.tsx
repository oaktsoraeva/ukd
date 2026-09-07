import { ActionFormCell, FormCell, Switch } from '@ds'
import type { BlockValues, CorrectionBlock, CorrectionBlockId } from '../types'

interface ChangeChecklistProps {
  /** Только применимые к основанию блоки — см. availableBlocks */
  blocks: CorrectionBlock[]
  sourceValues: Record<CorrectionBlockId, BlockValues>
  selectedBlocks: Record<CorrectionBlockId, boolean>
  onToggleBlock: (id: CorrectionBlockId) => void
  itemsOn: boolean
  onToggleItems: (next: boolean) => void
  selectedItemCount: number
  sourceItemCount: number
  onOpenPicker: () => void
  /** Ошибка на группу, а не на поле: в ките таких нет */
  error?: string
}

/** Блок «Что изменилось» — узел 4788:107434 */
export function ChangeChecklist({
  blocks,
  sourceValues,
  selectedBlocks,
  onToggleBlock,
  itemsOn,
  onToggleItems,
  selectedItemCount,
  sourceItemCount,
  onOpenPicker,
  error,
}: ChangeChecklistProps) {
  /**
   * Все строки блока — один стек без зазоров: в макете 4788:89302 это одна
   * серая карточка на четыре строки с волосяными разделителями, а не два
   * отдельных стека. Пункты блоков идут первыми, за ними тоггл позиций и
   * переход к их выбору
   */
  const rowCount = blocks.length + 2
  const stackVariant = (index: number) =>
    index === 0 ? 'stack-top' : index === rowCount - 1 ? 'stack-bottom' : 'stack-middle'

  return (
    <div className="ukd-group">
      <div className="ukd-group__header">
        <h2 className="ts-600-xl ukd-group__title">Что изменилось</h2>
        {error && <p className="ts-400-s ukd-group__error">{error}</p>}
      </div>

      <div className="ukd-checklist">
        {blocks.map((block, index) => (
          /* Свитч презентационный: клик обрабатывает строка — иначе он
             всплывает до обработчика строки и переключает дважды */
          <div
            key={block.id}
            className="ukd-checklist__row"
            role="button"
            tabIndex={0}
            onClick={() => onToggleBlock(block.id)}
          >
            <FormCell
              title={block.title}
              description={block.summarize(sourceValues[block.id])}
              variant={stackVariant(index)}
              right={<Switch isSelected={selectedBlocks[block.id]} label={block.title} />}
            />
          </div>
        ))}

        <FormCell
          title="Изменились позиции"
          description="Корректировка товаров и услуг"
          variant={stackVariant(blocks.length)}
          right={
            <Switch isSelected={itemsOn} onChange={onToggleItems} label="Изменились позиции" />
          }
        />
        <ActionFormCell
          title="К выбору позиций"
          description={`Выбрано ${selectedItemCount} из ${sourceItemCount}`}
          variant={stackVariant(blocks.length + 1)}
          onClick={onOpenPicker}
        />
      </div>
    </div>
  )
}

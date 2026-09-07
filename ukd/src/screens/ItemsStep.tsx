import { ActionFormCell } from '@ds'
import { ArrowUpUnderline, PlusCircle } from '@ds/icons'
import { ItemSection } from '../components/ItemSection'
import type { ItemValues, LineItem } from '../types'

interface ItemsStepProps {
  /** Только выбранные на шаге 1 позиции — стикер 4867:34460 */
  items: LineItem[]
  errors: Record<string, Record<string, string>>
  onChange: (id: string, patch: Partial<ItemValues>) => void
  onDelete: (id: string) => void
  onAddItem: () => void
  onUploadCodes: () => void
}

/** Шаг «Корректировка позиций» — узел 4827:109373 */
export function ItemsStep({
  items,
  errors,
  onChange,
  onDelete,
  onAddItem,
  onUploadCodes,
}: ItemsStepProps) {
  return (
    <div className="ukd-page">
      <div className="ukd-page__header">
        <h1 className="ts-600-4xl ukd-page__title">Корректировка позиций</h1>
      </div>

      {items.map((item, index) => (
        <ItemSection
          key={item.id}
          item={item}
          index={index + 1}
          errors={errors[item.id] ?? {}}
          onChange={(patch) => onChange(item.id, patch)}
          onDelete={() => onDelete(item.id)}
        />
      ))}

      <div className="ukd-actions-card">
        <ActionFormCell
          title="Добавить позицию"
          variant="stack-top"
          left={<PlusCircle />}
          onClick={onAddItem}
        />
        <ActionFormCell
          title="Загрузить коды маркировки"
          variant="stack-bottom"
          left={<ArrowUpUnderline />}
          onClick={onUploadCodes}
        />
      </div>
    </div>
  )
}

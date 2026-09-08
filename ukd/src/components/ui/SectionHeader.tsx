import { Trash } from '@ds/icons'

interface SectionHeaderProps {
  title: string
  /** Значение из документа-основания. Пусто — подпись не рисуем (узел 4871:93835) */
  prevValue?: string
  onDelete: () => void
}

/**
 * Заголовок инлайн-секции с подписью «Было: …» и корзиной — узел 4827:88387.
 * В ките нет подходящего: Cell ставит subtitle над заголовком, а его правый
 * аксессуар не кнопка; у WidgetTitle другая типографика.
 *
 * Корзина в макете нарисована без подложки — просто глиф 20px, поэтому
 * китовый icon-button с его плашкой здесь не подходит.
 */
export function SectionHeader({ title, prevValue, onDelete }: SectionHeaderProps) {
  return (
    <div className="ukd-section__header">
      <div className="ukd-section__titles">
        <h2 className="ts-500-xl ukd-section__title">{title}</h2>
        {prevValue && <p className="ts-400-s ukd-section__prev">Было: {prevValue}</p>}
      </div>
      <button type="button" className="ukd-section__delete" onClick={onDelete}>
        <span className="ds-icon ds-icon--m" aria-hidden="true">
          <Trash />
        </span>
        <span className="visually-hidden">Удалить из корректировки</span>
      </button>
    </div>
  )
}

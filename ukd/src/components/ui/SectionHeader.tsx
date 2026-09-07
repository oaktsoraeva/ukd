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
 */
export function SectionHeader({ title, prevValue, onDelete }: SectionHeaderProps) {
  return (
    <div className="ukd-section__header">
      <div className="ukd-section__titles">
        <h2 className="ts-600-xl ukd-section__title">{title}</h2>
        {prevValue && <p className="ts-400-s ukd-section__prev">Было: {prevValue}</p>}
      </div>
      <button
        type="button"
        className="icon-button icon-button--32 ukd-section__delete"
        onClick={onDelete}
      >
        <span className="ds-icon ds-icon--s" aria-hidden="true">
          <Trash />
        </span>
        <span className="visually-hidden">Удалить из корректировки</span>
      </button>
    </div>
  )
}

import emptyArt from '../../assets/empty-corrections.png'

interface EmptyStateProps {
  text: string
  /** Ссылка-действие под текстом. Без неё рисуем только картинку и подпись */
  actionLabel?: string
  onAction?: () => void
}

/**
 * Пустое состояние — узлы 4888:138152 (обзор) и 1093:32162 (список).
 * В ките нет ни компонента пустого состояния, ни иллюстраций, поэтому
 * картинка выгружена из макета; в обоих узлах она одна и та же.
 */
export function EmptyState({ text, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="ukd-empty">
      <img className="ukd-empty__art" src={emptyArt} width={200} height={120} alt="" />
      <p className="ts-400-m ukd-empty__text">{text}</p>
      {actionLabel && onAction && (
        <button type="button" className="ts-400-m ukd-empty__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

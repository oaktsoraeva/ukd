import emptyArt from '../../assets/empty-corrections.png'

interface EmptyStateProps {
  text: string
  actionLabel: string
  onAction: () => void
}

/**
 * Пустое состояние — узел 4888:138152. В ките нет ни компонента пустого
 * состояния, ни иллюстраций, поэтому картинка выгружена из макета.
 */
export function EmptyState({ text, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="ukd-empty">
      <img className="ukd-empty__art" src={emptyArt} width={200} height={120} alt="" />
      <p className="ts-400-m ukd-empty__text">{text}</p>
      <button type="button" className="ts-400-m ukd-empty__action" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

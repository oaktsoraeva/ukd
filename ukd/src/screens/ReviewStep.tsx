import { EmptyState } from '../components/ui/EmptyState'
import type { ReviewItem, ReviewPair } from '../lib/review'

interface ReviewStepProps {
  pairs: ReviewPair[]
  items: ReviewItem[]
  /** Ни одной корректировки не осталось — узел 4888:138152 */
  isEmpty: boolean
  onRestart: () => void
}

/** Шаг «Проверка данных» — узел 4945:151066 */
export function ReviewStep({
  pairs,
  items,
  isEmpty,
  onRestart,
}: ReviewStepProps) {
  return (
    <div className="ukd-page">
      <div className="ukd-page__header">
        <h1 className="ts-600-4xl ukd-page__title">Проверка данных</h1>
        {!isEmpty && (
          <p className="ts-400-s ukd-page__subtitle">
            Убедитесь, что внесли все нужные правки
          </p>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          text="Нет ни одной корректировки в документе"
          actionLabel="Добавить корректировку"
          onAction={onRestart}
        />
      ) : (
        /* Обе группы обзора лежат в одном блоке с зазором 48 — узел 5360:93409 */
        <div className="ukd-review-groups">
          {pairs.length > 0 && (
            /* Заголовков у групп на обзоре нет: пары и позиции читаются
               по подписям полей (узел 4978:152263) */
            <div className="ukd-group">
              <div className="ukd-review">
                {pairs.map((pair) => (
                  <div key={pair.label} className="ukd-review__pair">
                    <span className="ts-400-s ukd-review__label">{pair.label}</span>
                    <span className="ts-500-l ukd-review__value">{pair.value}</span>
                    {pair.was && <s className="ts-400-s ukd-review__was">{pair.was}</s>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="ukd-group">
              <div className="ukd-review ukd-review--items">
                {items.map((item) => (
                  <div key={item.id} className="ukd-review__item">
                    <div className="ukd-review__item-head">
                      {item.gtin && (
                        <span className="ts-400-s ukd-review__label">{item.gtin}</span>
                      )}
                      <span className="ts-500-l">{item.name}</span>
                      {item.nameWas && (
                        <s className="ts-400-s ukd-review__was">{item.nameWas}</s>
                      )}
                    </div>
                    <div className="ukd-review__fields">
                      {item.fields.map((f) => (
                        <div key={f.label} className="ukd-review__field">
                          <span className="ts-400-s ukd-review__label">{f.label}</span>
                          <span className="ts-500-m">{f.value}</span>
                          {/* Прежнее значение зачёркнуто — стиль
                              TTN 400 Strikethrough/S из узла 4945:151397 */}
                          {f.was && <s className="ts-400-s ukd-review__was">{f.was}</s>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

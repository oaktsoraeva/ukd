import type { ReactNode } from 'react'

export interface NavigatorRow {
  /** Подпись над названием — например статус связанного документа */
  subtitle?: string
  title: string
  /** Подпись под названием: ИНН, оператор ЭДО, сумма */
  description?: string
  accessory: ReactNode
}

interface NavigatorCardProps {
  title: string
  rows: NavigatorRow[]
}

/**
 * Карточка-навигатор — узел 5040:12722. В ките такого компонента нет:
 * белая плашка с тенью, заголовок TTN 600/XL и список строк по 8px
 * скруглением внутри 8px отступа.
 */
export function NavigatorCard({ title, rows }: NavigatorCardProps) {
  return (
    <section className="ukd-navigator">
      <h2 className="ts-600-xl ukd-navigator__title">{title}</h2>
      <div className="ukd-navigator__list">
        {rows.map((row) => (
          <div key={row.title} className="ukd-navigator__row">
            <span className="ukd-navigator__accessory">{row.accessory}</span>
            <span className="ukd-navigator__text">
              {row.subtitle && (
                <span className="ts-400-s ukd-navigator__meta">{row.subtitle}</span>
              )}
              <span className="ts-500-m ukd-navigator__name">{row.title}</span>
              {row.description && (
                <span className="ts-400-s ukd-navigator__meta">{row.description}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

import type { ReactNode } from 'react'

/**
 * Обёртка глифа для слотов кита, которые отдают иконку как есть.
 *
 * `fill: currentColor` кит вешает на `.ds-icon svg`, а у ActionFormCell,
 * PageAction, ActionSheet и Cell слот иконки этого класса не добавляет —
 * без обёртки у SVG остаётся дефолтная чёрная заливка вместо цвета строки.
 */
export function DsIcon({ children, size = 'm' }: { children: ReactNode; size?: 'm' | '30' }) {
  return (
    <span className={`ds-icon ds-icon--${size}`} aria-hidden="true">
      {children}
    </span>
  )
}

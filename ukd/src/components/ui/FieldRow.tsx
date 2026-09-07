import type { ReactNode } from 'react'

/**
 * Раскладка полей формы: поля со span='half' встают парами в одну строку
 * с зазором 16px (узел 4574:111333 — два Input по 332px в колонке 680px).
 */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="ukd-field-row">{children}</div>
}

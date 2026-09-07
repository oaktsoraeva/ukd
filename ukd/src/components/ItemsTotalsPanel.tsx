import { formatMoney, formatQuantity } from '../lib/format'
import type { ItemsTotals } from '../lib/items'

/**
 * Панель итогов справа от контента — узел 4867:92597.
 * PageLayout отдаёт под rightPanel пустой контейнер, компонента итогов
 * в ките нет.
 */
export function ItemsTotalsPanel({ totals }: { totals: ItemsTotals }) {
  const rows = [
    { label: 'Количество', value: formatQuantity(String(totals.quantity)) || '0' },
    { label: 'Из них с КИЗ', value: formatQuantity(String(totals.kizQuantity)) || '0' },
    { label: 'НДС', value: formatMoney(totals.vat) },
  ]

  return (
    <aside className="ukd-totals">
      {rows.map((row) => (
        <div key={row.label} className="ukd-totals__row">
          <span className="ts-400-m ukd-totals__label">{row.label}</span>
          <span className="ts-400-m ukd-totals__value">{row.value}</span>
        </div>
      ))}
      <div className="ukd-totals__row ukd-totals__row--total">
        {/* Строка итога в макете 26px — это TTN 600/XL, а не 500/L */}
        <span className="ts-600-xl">Итого</span>
        <span className="ts-600-xl">{formatMoney(totals.total)}</span>
      </div>
    </aside>
  )
}

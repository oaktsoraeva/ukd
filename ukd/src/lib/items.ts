import { UNITS, VAT_RATES } from '../data'
import { formatMoney, formatQuantity, toNumber } from './format'
import type { ItemValues } from '../types'

/** Сумма позиции: количество × цена */
export function itemTotal(item: ItemValues): number {
  return toNumber(item.quantity) * toNumber(item.price)
}

/** НДС в рублях. null — «без НДС» */
export function itemVat(item: ItemValues): number | null {
  const rate = VAT_RATES.find((v) => v.id === item.vatId)?.rate ?? null
  if (rate === null) return null
  return (itemTotal(item) * rate) / 100
}

/**
 * Сводка позиции в description строки — узел 4583:164482:
 * «GTIN: 4600109001373 300 шт., 22 500 ₽, без НДС» либо
 * «150 шт., 11 250 ₽, НДС: 1 125 ₽».
 * Суммы считаем, а не берём из фикстуры: иначе демо, где сумма не следует
 * за ценой, читается как сломанное.
 */
export function itemSummary(item: ItemValues): string {
  const unit = UNITS.find((u) => u.id === item.unitId)?.label ?? 'ед. измер.'
  const vat = itemVat(item)
  const parts = [
    `${formatQuantity(item.quantity) || '0'} ${unit}`,
    formatMoney(itemTotal(item)),
    vat === null ? 'без НДС' : `НДС: ${formatMoney(vat)}`,
  ]
  const tail = parts.join(', ')
  return item.gtin ? `GTIN: ${item.gtin} ${tail}` : tail
}


/** Подписи «Было: …» под полями позиции — узел 4827:109373 */
export interface ItemPrevLabels {
  quantity: string
  unit: string
  price: string
  vat: string
}

export function itemPrevLabels(origin: ItemValues | null): ItemPrevLabels | null {
  if (!origin) return null
  return {
    quantity: formatQuantity(origin.quantity) || '0',
    unit: UNITS.find((u) => u.id === origin.unitId)?.label ?? '',
    price: formatMoney(toNumber(origin.price)),
    vat: VAT_RATES.find((v) => v.id === origin.vatId)?.label ?? '',
  }
}

/** Итоги правой панели — узел 4867:92597 */
export interface ItemsTotals {
  /** Сумма количеств */
  quantity: number
  /** Из них по позициям с кодами маркировки */
  kizQuantity: number
  /** НДС в рублях */
  vat: number
  /** Сумма строк плюс НДС — в макете 424 800 + 93 456 = 518 256 */
  total: number
}

export function itemsTotals(items: ItemValues[]): ItemsTotals {
  let quantity = 0
  let kizQuantity = 0
  let net = 0
  let vat = 0

  for (const item of items) {
    const count = toNumber(item.quantity)
    quantity += count
    if (item.gtin) kizQuantity += count
    net += itemTotal(item)
    vat += itemVat(item) ?? 0
  }

  return { quantity, kizQuantity, vat, total: net + vat }
}

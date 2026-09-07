import { UNITS, VAT_RATES } from '../data'
import { formatMoney, formatQuantity, toNumber } from './format'
import type { BlockValues, CorrectionBlock, CorrectionBlockId, LineItem } from '../types'

/** Пара «подпись / значение» в секции «Корректировка документа» */
export interface ReviewPair {
  label: string
  value: string
  /** Прежнее значение, если блок правили — рисуется зачёркнутым */
  was?: string
}

/**
 * Что показать на «Проверке данных» — узел 4978:152261.
 * Значение берём отредактированное, прежнее — из документа-основания
 */
export function reviewBlockPairs(
  blocks: CorrectionBlock[],
  blockValues: Record<CorrectionBlockId, BlockValues>,
  sourceValues: Record<CorrectionBlockId, BlockValues>,
): ReviewPair[] {
  return blocks.map((block) => {
    const value = block.summarize(blockValues[block.id]) || '—'
    const was = block.summarize(sourceValues[block.id])
    return was && was !== value ? { label: block.title, value, was } : { label: block.title, value }
  })
}

/**
 * Поле позиции в обзоре: подпись, значение и — если поле изменили —
 * прежнее значение, которое рисуется зачёркнутым (узел 4945:151397)
 */
export interface ReviewItemField {
  label: string
  value: string
  was?: string
}

export interface ReviewItem {
  id: string
  /** Пусто у позиций без кодов маркировки */
  gtin: string
  name: string
  /**
   * Прежнее название, если его правили. У позиций с кодами маркировки
   * название заблокировано, так что бывает только без GTIN
   */
  nameWas?: string
  fields: ReviewItemField[]
}

const unitLabel = (id: string) => UNITS.find((u) => u.id === id)?.label ?? ''
const vatLabel = (id: string) => VAT_RATES.find((v) => v.id === id)?.label ?? ''
const quantityLabel = (value: string) => formatQuantity(String(toNumber(value))) || '0'
const priceLabel = (value: string) => formatMoney(toNumber(value))

/** Прежнее значение показываем только там, где оно отличается */
function field(label: string, value: string, was: string | null): ReviewItemField {
  return was !== null && was !== value ? { label, value, was } : { label, value }
}

export function reviewItems(items: LineItem[]): ReviewItem[] {
  return items.map((item) => {
    const origin = item.origin
    const name = item.name || 'Название товара или услуги'
    const nameWas = origin && origin.name !== item.name ? origin.name : undefined
    return {
      id: item.id,
      gtin: item.gtin ? `GTIN: ${item.gtin}` : '',
      name,
      nameWas,
      fields: [
        field(
          'Количество',
          quantityLabel(item.quantity),
          origin ? quantityLabel(origin.quantity) : null,
        ),
        field(
          'Единица измерения',
          unitLabel(item.unitId),
          origin ? unitLabel(origin.unitId) : null,
        ),
        field('Цена', priceLabel(item.price), origin ? priceLabel(origin.price) : null),
        field('НДС', vatLabel(item.vatId), origin ? vatLabel(origin.vatId) : null),
      ],
    }
  })
}

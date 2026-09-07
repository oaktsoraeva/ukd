import { DEFAULT_VALUES, SOURCE_DOCS } from '../data'
import type { BlockValues, CorrectionBlockId, LineItem, SourceDoc } from '../types'

export interface PrefillResult {
  /** Редактируемые значения блоков */
  blockValues: Record<CorrectionBlockId, BlockValues>
  /**
   * Значения из документа-основания. Пишутся один раз при выборе основания
   * и дальше не меняются — это данные для подписей «Было: …», а не
   * знаменатель сравнения, как было в прошлой версии сценария
   */
  sourceValues: Record<CorrectionBlockId, BlockValues>
  items: LineItem[]
}

/**
 * Отличаются ли значения. Пустая строка и отсутствующий ключ — одно и то же.
 * Единственное оставшееся сравнение: гейт подтверждения удаления секции
 * (стикер 4827:90762 — нетронутый блок удаляем без вопросов)
 */
export function isDiff(a: BlockValues, b: BlockValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].some((k) => (a[k] ?? '').trim() !== (b[k] ?? '').trim())
}

/** Основание ещё не выбрано */
export function emptyPrefill(): PrefillResult {
  return {
    blockValues: structuredClone(DEFAULT_VALUES),
    sourceValues: structuredClone(DEFAULT_VALUES),
    items: [],
  }
}

/** Подстановка из документа-основания */
export function applySourceDoc(docId: string): PrefillResult {
  const doc = SOURCE_DOCS.find((d) => d.id === docId)
  if (!doc) return emptyPrefill()

  const blockValues = structuredClone(DEFAULT_VALUES)
  for (const [blockId, values] of Object.entries(doc.prefill)) {
    const id = blockId as CorrectionBlockId
    blockValues[id] = { ...blockValues[id], ...values }
  }

  const items: LineItem[] = doc.items.map((item, index) => ({
    ...item,
    id: `${doc.id}-item-${index}`,
    origin: { ...item },
  }))

  return { blockValues, sourceValues: structuredClone(blockValues), items }
}

export function findSourceDoc(id: string | null): SourceDoc | null {
  return SOURCE_DOCS.find((d) => d.id === id) ?? null
}

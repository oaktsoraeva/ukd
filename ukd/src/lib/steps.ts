import type { StepDescriptor, StepId } from '../types'

const LABELS: Record<StepId, string> = {
  document: 'Документ',
  blocks: 'Корректировка документа',
  items: 'Корректировка позиций',
  review: 'Проверка данных',
}

interface StepGates {
  /** Сколько выбрано блоков, применимых к текущему основанию */
  selectedBlockCount: number
  itemsOn: boolean
  selectedItemCount: number
}

/**
 * Видимые шаги. Два средних появляются по выбору на первом шаге:
 * стикеры 4827:75269 («показываем только выбранные блоки, иначе шаг не
 * показываем») и 4867:34460 — то же про позиции.
 * По умолчанию остаются только «Документ» и «Проверка данных».
 */
export function visibleSteps({
  selectedBlockCount,
  itemsOn,
  selectedItemCount,
}: StepGates): StepDescriptor[] {
  const ids: StepId[] = ['document']
  if (selectedBlockCount > 0) ids.push('blocks')
  if (itemsOn && selectedItemCount > 0) ids.push('items')
  ids.push('review')
  return ids.map((id) => ({ id, label: LABELS[id] }))
}

export function nextStep(steps: StepDescriptor[], current: StepId): StepId | null {
  const index = steps.findIndex((s) => s.id === current)
  return index >= 0 ? steps[index + 1]?.id ?? null : null
}

export function prevStep(steps: StepDescriptor[], current: StepId): StepId | null {
  const index = steps.findIndex((s) => s.id === current)
  return index > 0 ? steps[index - 1].id : null
}

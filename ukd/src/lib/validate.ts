import { digitsOnly, isValidDate, toNumber } from './format'
import type { BlockValues, CorrectionBlock, FieldSchema, ItemValues } from '../types'

export const MAX_QUANTITY = 9_999_999.999
export const MAX_PRICE = 999_999_999

/**
 * Сообщение об ошибке поля или null. Тексты — дословно из «Вариаций полей»
 * (узел 4574:110642) и «Валидации позиции» (узел 4583:165650).
 */
export function validateField(field: FieldSchema, rawValue: string | undefined): string | null {
  const value = (rawValue ?? '').trim()
  // «Сократите название…», но «В КПП должно быть…» — аббревиатуру не трогаем
  const label = field.errorLabel ?? field.label.toLowerCase()

  if (!value) {
    return field.isRequired ? field.requiredMessage ?? `Укажите ${label}` : null
  }

  if (field.maxLength !== undefined && value.length > field.maxLength) {
    return `Сократите ${label} до ${field.maxLength.toLocaleString('ru-RU')} символов`
  }

  if (field.kind === 'date' && !isValidDate(value)) {
    return 'Укажите дату в формате дд.мм.гггг'
  }

  if (field.kind === 'digits' && field.digits !== undefined) {
    const digits = digitsOnly(value)
    if (digits.length !== field.digits) {
      return `В ${label} должно быть ${field.digits} цифр`
    }
  }

  if (field.kind === 'quantity' && toNumber(value) > MAX_QUANTITY) {
    return 'Макс. 9 999 999,999'
  }

  if (field.kind === 'money' && toNumber(value) > MAX_PRICE) {
    return 'Макс. 999 999 999 ₽'
  }

  return null
}

/** Ошибки всех полей блока */
export function validateBlock(block: CorrectionBlock, values: BlockValues): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of block.fields) {
    const message = validateField(field, values[field.name])
    if (message) errors[field.name] = message
  }
  return errors
}

/** Схема полей позиции. Обязательность — узел 4888:122822 */
export const ITEM_FIELDS: FieldSchema[] = [
  {
    name: 'name',
    label: 'Название',
    kind: 'text',
    placeholder: 'Название товара или услуги',
    maxLength: 2000,
    span: 'full',
    isMultiline: true,
    isRequired: true,
    requiredMessage: 'Укажите название',
  },
  {
    name: 'quantity',
    label: 'Количество',
    kind: 'quantity',
    placeholder: '0',
    span: 'half',
    isRequired: true,
    requiredMessage: 'Укажите количество',
  },
  {
    name: 'price',
    label: 'Цена',
    kind: 'money',
    placeholder: '0 ₽',
    span: 'half',
    isRequired: true,
    requiredMessage: 'Укажите цену',
  },
]

export function validateItem(values: ItemValues): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of ITEM_FIELDS) {
    const message = validateField(field, values[field.name as keyof ItemValues] ?? '')
    if (message) errors[field.name] = message
  }
  return errors
}

/** Дата УКД на шаге «Документ» — узел 4788:110740 */
export function ukdDateError(value: string): string | undefined {
  if (value.trim() === '') return 'Укажите дату'
  if (!isValidDate(value)) return 'Укажите дату в формате дд.мм.гггг'
  return undefined
}

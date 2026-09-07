/** Маски и форматтеры. Все значения в модели — строки, форматирование живёт здесь */

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

/** Неразрывный пробел — разделитель разрядов, чтобы сумма не рвалась по строкам */
const NBSP = ' '

export function digitsOnly(value: string, max?: number): string {
  const digits = value.replace(/\D/g, '')
  return max === undefined ? digits : digits.slice(0, max)
}

/** Ввод даты: только цифры, точки расставляются сами — дд.мм.гггг */
export function maskDate(value: string): string {
  const d = digitsOnly(value, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}.${d.slice(2)}`
  return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`
}

/** Группировка цифр по три справа: 1000000 → 1 000 000 */
function groupDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

/** Количество: до 9 999 999,999 — три знака после запятой */
export function maskQuantity(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/\./g, ',')
  const [whole = '', fraction] = cleaned.split(',')
  const head = whole.replace(/\D/g, '').slice(0, 7)
  if (fraction === undefined) return head
  return `${head},${fraction.replace(/\D/g, '').slice(0, 3)}`
}

/** Цена: до 999 999 999 — два знака после запятой */
export function maskMoney(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/\./g, ',')
  const [whole = '', fraction] = cleaned.split(',')
  const head = whole.replace(/\D/g, '').slice(0, 9)
  if (fraction === undefined) return head
  return `${head},${fraction.replace(/\D/g, '').slice(0, 2)}`
}

/** Строку из маски — в число. '1 234,50' → 1234.5 */
export function toNumber(value: string): number {
  const normalized = value.replace(/[^\d,.]/g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Число — в сумму с рублём: 22500 → «22 500 ₽» */
export function formatMoney(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  const [whole, fraction] = rounded.toFixed(2).split('.')
  const head = groupDigits(whole)
  return fraction === '00' ? `${head}${NBSP}₽` : `${head},${fraction}${NBSP}₽`
}

/** Количество — в текст: 300 → «300», 1.5 → «1,5» */
export function formatQuantity(value: string): string {
  const n = toNumber(value)
  const text = Number.isInteger(n) ? String(n) : String(n).replace('.', ',')
  const [whole, fraction] = text.split(',')
  return fraction ? `${groupDigits(whole)},${fraction}` : groupDigits(whole)
}

/** '01.01.2027' → '01 января 2027'. Невалидную строку возвращаем как есть */
export function formatLongDate(value: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!match) return value
  const [, day, month, year] = match
  const monthName = MONTHS_GENITIVE[Number(month) - 1]
  if (!monthName) return value
  return `${day} ${monthName} ${year}`
}

/** Дата валидна как календарная, а не только по формату */
export function isValidDate(value: string): boolean {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!match) return false
  const d = Number(match[1])
  const m = Number(match[2])
  const y = Number(match[3])
  const date = new Date(y, m - 1, d)
  return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y
}

/** '01.01.2027' → Date. Для невалидной строки — null */
export function parseDate(value: string): Date | null {
  if (!isValidDate(value)) return null
  const [d, m, y] = value.trim().split('.').map(Number)
  return new Date(y, m - 1, d)
}

export function toDateString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

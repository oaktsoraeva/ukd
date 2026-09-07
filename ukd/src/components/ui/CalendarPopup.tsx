import { useEffect, useLayoutEffect, useRef } from 'react'
import { MONTHS_NOMINATIVE, parseDate, toDateString } from '../../lib/format'

/** Сколько месяцев прокручивается в поповере */
const MONTHS_BACK = 3
const MONTHS_FORWARD = 12

interface CalendarPopupProps {
  /** Текущее значение в формате дд.мм.гггг */
  value: string
  /** Месяц, на котором открываемся, если значение пустое */
  anchor: string
  onPick: (value: string) => void
  onClose: () => void
}

interface MonthCells {
  key: string
  year: number
  month: number
  /** Пустые ячейки до первого числа + числа месяца */
  cells: (number | null)[]
}

function buildMonth(year: number, month: number): MonthCells {
  const first = new Date(year, month, 1)
  // В неделе первый день — понедельник, а getDay() считает от воскресенья
  const lead = (first.getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return {
    key: `${year}-${month}`,
    year,
    month,
    cells: [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ],
  }
}

/**
 * Календарь — узел 4593:170120. В UI-ките календаря нет.
 * Прокручиваемый список месяцев: заголовок «Июль 2026», сетка Пн–Вс,
 * выходные красным. Рендерится внутри .ukd-date, без портала —
 * так он работает и внутри Drawer.
 */
export function CalendarPopup({ value, anchor, onPick, onClose }: CalendarPopupProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const selected = parseDate(value)
  const base = selected ?? parseDate(anchor) ?? new Date(2027, 0, 1)
  const anchorKey = `${base.getFullYear()}-${base.getMonth()}`

  const months: MonthCells[] = []
  for (let offset = -MONTHS_BACK; offset <= MONTHS_FORWARD; offset += 1) {
    const d = new Date(base.getFullYear(), base.getMonth() + offset, 1)
    months.push(buildMonth(d.getFullYear(), d.getMonth()))
  }

  useLayoutEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'start' })
  }, [anchorKey])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="ukd-calendar" ref={rootRef} role="dialog" aria-label="Выберите дату">
      <div className="ukd-calendar__weekdays" aria-hidden="true">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
          <span
            key={day}
            className={`ts-400-xs ukd-calendar__weekday${index > 4 ? ' ukd-calendar__weekday--weekend' : ''}`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="ukd-calendar__scroll">
        {months.map((m) => (
          <div
            key={m.key}
            className="ukd-calendar__month"
            ref={m.key === anchorKey ? anchorRef : undefined}
          >
            <p className="ts-500-s ukd-calendar__title">
              {MONTHS_NOMINATIVE[m.month]} {m.year}
            </p>
            <div className="ukd-calendar__grid">
              {m.cells.map((day, index) =>
                day === null ? (
                  <span key={`gap-${index}`} />
                ) : (
                  <button
                    key={day}
                    type="button"
                    className={[
                      'ts-400-m',
                      'ukd-calendar__day',
                      index % 7 > 4 ? 'ukd-calendar__day--weekend' : '',
                      selected &&
                      selected.getDate() === day &&
                      selected.getMonth() === m.month &&
                      selected.getFullYear() === m.year
                        ? 'ukd-calendar__day--selected'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onPick(toDateString(new Date(m.year, m.month, day)))}
                  >
                    {day}
                  </button>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

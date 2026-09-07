import { useState } from 'react'
import { Input } from '@ds'
import { Calendar } from '@ds/icons'
import { CalendarPopup } from './CalendarPopup'
import { maskDate } from '../../lib/format'

interface DateFieldProps {
  label: string
  /** Всегда строка дд.мм.гггг */
  value: string
  onChange: (value: string) => void
  /** Месяц, на котором открывается календарь при пустом поле */
  anchor: string
  placeholder?: string
  isDisabled?: boolean
  isError?: boolean
  errorMessage?: string
}

/**
 * Поле даты: китовый Input с маской плюс свой календарь.
 * Клонировать Input не нужно — label, isError, errorMessage и слот right
 * у него уже есть.
 *
 * Корень Input — это <label>, поэтому клик по иконке всё равно фокусирует
 * поле: открываем поповер и по фокусу, и по клику, а в слот right кладём
 * span, а не button — иначе вложенные интерактивные элементы конфликтуют.
 */
export function DateField({
  label,
  value,
  onChange,
  anchor,
  placeholder = 'дд.мм.гггг',
  isDisabled = false,
  isError = false,
  errorMessage,
}: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="ukd-date">
      {/* Открываем и по клику, и по фокусу: с клавиатуры до поля доходят табом,
          а мышью клик по любому месту Input фокусирует поле, потому что его
          корень — <label> */}
      <div
        onClick={() => !isDisabled && setIsOpen(true)}
        onFocus={() => !isDisabled && setIsOpen(true)}
      >
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          isDisabled={isDisabled}
          isError={isError}
          errorMessage={errorMessage}
          onChange={(next) => onChange(maskDate(next))}
          right={
            <span className="ds-icon ds-icon--m ukd-date__icon" aria-hidden="true">
              <Calendar />
            </span>
          }
        />
      </div>

      {isOpen && (
        <CalendarPopup
          value={value}
          anchor={anchor}
          onPick={(next) => {
            onChange(next)
            setIsOpen(false)
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

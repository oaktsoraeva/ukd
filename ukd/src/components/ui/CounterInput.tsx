import { useEffect, useId, useRef } from 'react'
import '@ds/components/Input/input.css'

interface CounterInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Счётчик символов виден всегда: «12 / 255» */
  maxLength: number
  placeholder?: string
  isDisabled?: boolean
  isError?: boolean
  errorMessage?: string
  /** Длинные названия и адреса переносятся по строкам */
  isMultiline?: boolean
}

/**
 * Поле со счётчиком символов в шапке — узел 4574:110642.
 * В ките такого нет: Input рисует .input__header внутри себя и слота не даёт,
 * а maxLength и счётчика у него нет вовсе. Поэтому повторяем разметку Input,
 * но подключаем его же input.css — при рестайле кита мы наследуем изменения.
 *
 * Нативный maxLength специально не ставим: макет требует дать переполнить поле
 * и показать «Сократите название до N символов».
 */
export function CounterInput({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  isDisabled = false,
  isError = false,
  errorMessage,
  isMultiline = false,
}: CounterInputProps) {
  const id = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isOverflowing = value.length > maxLength

  // field-sizing: content поддержан не везде, поэтому подстраховываем высоту
  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
  }, [value, isMultiline])

  const classNames = [
    'input',
    'ukd-counter-input',
    isDisabled ? 'input--disabled' : '',
    isError ? 'input--error' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const field = isMultiline ? (
    <textarea
      ref={textareaRef}
      id={id}
      className="input__field ukd-counter-input__field"
      rows={1}
      placeholder={placeholder}
      value={value}
      disabled={isDisabled}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input
      id={id}
      className="input__field"
      type="text"
      placeholder={placeholder}
      value={value}
      disabled={isDisabled}
      onChange={(e) => onChange(e.target.value)}
    />
  )

  return (
    <div className={classNames}>
      <div className="input__content">
        <div className="input__main">
          <div className="input__header">
            <label className="input__title" htmlFor={id}>
              {label}
            </label>
            <span
              className={`ukd-counter${isOverflowing ? ' ukd-counter--over' : ''}`}
              aria-hidden="true"
            >
              {value.length} / {maxLength.toLocaleString('ru-RU')}
            </span>
          </div>
          {field}
        </div>
      </div>

      {isError && errorMessage && (
        <div className="input__meta">
          <div className="input__divider" />
          <p className="input__description">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

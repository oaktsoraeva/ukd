import { useState } from 'react'
import { Avatar, Cell, Dropdown } from '@ds'
import { CONTRACTORS } from '../data'
import type { Contractor } from '../types'

interface ContractorPickerProps {
  label: string
  placeholder: string
  /** Название выбранного контрагента */
  value: string
  onPick: (contractor: Contractor) => void
  isError?: boolean
  errorMessage?: string
}

/**
 * Справочник контрагентов — узел 4593:170120.
 * В макете это автокомплит с вводом прямо в поле; берём китовый Dropdown
 * с hasSearch — поиск живёт в попапе, зато адаптивный шит идёт из кита.
 */
export function ContractorPicker({
  label,
  placeholder,
  value,
  onPick,
  isError,
  errorMessage,
}: ContractorPickerProps) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()

  const matches = CONTRACTORS.filter((c) => {
    if (!needle) return true
    return (
      c.listName.toLowerCase().includes(needle) ||
      c.inn.replace(/\s/g, '').includes(needle.replace(/\s/g, ''))
    )
  })

  return (
    <Dropdown
      label={label}
      placeholder={placeholder}
      value={value || undefined}
      hasSearch
      searchPlaceholder="Название или ИНН"
      onSearchChange={setQuery}
      isEmpty={matches.length === 0}
      isError={isError}
      errorMessage={errorMessage}
    >
      {matches.map((contractor) => (
        <Cell
          key={contractor.id}
          title={contractor.listName}
          description={`ИНН: ${contractor.inn}`}
          leftAccessory={
            <Avatar
              label={contractor.initials}
              size="m"
              style={{ '--avatar-surface': contractor.color } as React.CSSProperties}
            />
          }
          onClick={() => onPick(contractor)}
        />
      ))}
    </Dropdown>
  )
}

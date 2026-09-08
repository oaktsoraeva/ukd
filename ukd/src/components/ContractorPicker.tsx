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
 * Справочник контрагентов — узел 4827:91214: попап открывается сразу
 * списком, поиска в нём нет.
 */
export function ContractorPicker({
  label,
  placeholder,
  value,
  onPick,
  isError,
  errorMessage,
}: ContractorPickerProps) {
  return (
    <Dropdown
      label={label}
      placeholder={placeholder}
      value={value || undefined}
      isError={isError}
      errorMessage={errorMessage}
    >
      {CONTRACTORS.map((contractor) => (
        <Cell
          key={contractor.id}
          title={contractor.listName}
          description={`ИНН: ${contractor.inn}`}
          leftAccessory={
            <Avatar
              className="ukd-avatar"
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

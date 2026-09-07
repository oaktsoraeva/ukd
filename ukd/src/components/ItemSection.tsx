import { Cell, Dropdown, Input } from '@ds'
import { CounterInput } from './ui/CounterInput'
import { PrevValue } from './ui/PrevValue'
import { SectionHeader } from './ui/SectionHeader'
import { UNITS, VAT_RATES } from '../data'
import { formatMoney, maskMoney, maskQuantity } from '../lib/format'
import { itemPrevLabels, itemTotal } from '../lib/items'
import type { ItemValues, LineItem } from '../types'

interface ItemSectionProps {
  item: LineItem
  /** Номер в списке: заголовок «Позиция N» */
  index: number
  errors: Record<string, string>
  onChange: (patch: Partial<ItemValues>) => void
  onDelete: () => void
}

/** Одна позиция на шаге «Корректировка позиций» — узел 4827:109373 */
export function ItemSection({ item, index, errors, onChange, onDelete }: ItemSectionProps) {
  const prev = itemPrevLabels(item.origin)
  /* Позиции с кодами маркировки: название и количество КИЗ не редактируются
     (стикер 4888:122952) */
  const hasCodes = item.gtin !== ''

  const unitLabel = UNITS.find((u) => u.id === item.unitId)?.label ?? ''
  const vatLabel = VAT_RATES.find((v) => v.id === item.vatId)?.label ?? ''

  return (
    <section className="ukd-section">
      <SectionHeader title={`Позиция ${index}`} onDelete={onDelete} />

      <div className="ukd-item">
        <CounterInput
          label="Название"
          placeholder="Название товара или услуги"
          value={item.name}
          maxLength={2000}
          isMultiline
          isDisabled={hasCodes}
          isError={Boolean(errors.name)}
          errorMessage={errors.name}
          onChange={(value) => onChange({ name: value })}
        />

        {hasCodes && (
          <Input label="GTIN" value={item.gtin} isDisabled onChange={() => undefined} />
        )}

        <div className="ukd-field-grid">
          <div className="ukd-field-cell">
            <Input
              label={hasCodes ? 'Количество КИЗ' : 'Количество'}
              placeholder="0"
              value={item.quantity}
              isDisabled={hasCodes}
              isError={Boolean(errors.quantity)}
              errorMessage={errors.quantity}
              onChange={(value) => onChange({ quantity: maskQuantity(value) })}
            />
            {prev && <PrevValue value={prev.quantity} />}
          </div>

          <div className="ukd-field-cell">
            {/* 45 значений в справочнике — без поиска пользоваться неудобно */}
            <Dropdown label="Ед. измерения" value={unitLabel} hasSearch searchPlaceholder="Поиск">
              {UNITS.map((unit) => (
                <Cell
                  key={unit.id}
                  hasLeftAccessory={false}
                  title={unit.label}
                  onClick={() => onChange({ unitId: unit.id })}
                />
              ))}
            </Dropdown>
            {prev && <PrevValue value={prev.unit} />}
          </div>

          <div className="ukd-field-cell">
            <Input
              label="Цена"
              placeholder="0 ₽"
              value={item.price}
              isError={Boolean(errors.price)}
              errorMessage={errors.price}
              onChange={(value) => onChange({ price: maskMoney(value) })}
            />
            {prev && <PrevValue value={prev.price} />}
          </div>

          <div className="ukd-field-cell">
            <Dropdown label="НДС" value={vatLabel}>
              {VAT_RATES.map((rate) => (
                <Cell
                  key={rate.id}
                  hasLeftAccessory={false}
                  title={rate.label}
                  onClick={() => onChange({ vatId: rate.id })}
                />
              ))}
            </Dropdown>
            {prev && <PrevValue value={prev.vat} />}
          </div>
        </div>

        {/* Построчный итог без НДС — узел 4827:109373 */}
        <p className="ts-400-s ukd-item__total">Итого: {formatMoney(itemTotal(item))}</p>
      </div>
    </section>
  )
}

import { Cell, Dropdown, Input } from '@ds'
import { CounterInput } from './ui/CounterInput'
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

/**
 * Одна позиция на шаге «Корректировка позиций» — узел 4827:109373.
 *
 * Все строки позиции — плашки кита с зазором 2px, поэтому они читаются
 * как одна карточка. Подпись «Было: …» отдаём в `description`: китовый
 * Input рисует её внутри плашки под разделителем, ровно как в макете,
 * и при ошибке сам подменяет её текстом ошибки.
 */
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

        {/* GTIN в макете — не поле, а строка текста на такой же плашке */}
        {hasCodes && <p className="ts-400-s ukd-item__row">GTIN: {item.gtin}</p>}

        <div className="ukd-field-grid">
          <Input
            label={hasCodes ? 'Количество КИЗ' : 'Количество'}
            placeholder="0"
            value={item.quantity}
            isDisabled={hasCodes}
            description={prev ? `Было: ${prev.quantity}` : undefined}
            isError={Boolean(errors.quantity)}
            errorMessage={errors.quantity}
            onChange={(value) => onChange({ quantity: maskQuantity(value) })}
          />

          {/* 45 значений в справочнике — без поиска пользоваться неудобно */}
          <Dropdown
            label="Ед. измерения"
            value={unitLabel}
            description={prev ? `Было: ${prev.unit}` : undefined}
            hasSearch
            searchPlaceholder="Поиск"
          >
            {UNITS.map((unit) => (
              <Cell
                key={unit.id}
                hasLeftAccessory={false}
                title={unit.label}
                onClick={() => onChange({ unitId: unit.id })}
              />
            ))}
          </Dropdown>

          <Input
            label="Цена"
            placeholder="0 ₽"
            value={item.price}
            description={prev ? `Было: ${prev.price}` : undefined}
            isError={Boolean(errors.price)}
            errorMessage={errors.price}
            onChange={(value) => onChange({ price: maskMoney(value) })}
          />

          <Dropdown
            label="НДС"
            value={vatLabel}
            description={prev ? `Было: ${prev.vat}` : undefined}
          >
            {VAT_RATES.map((rate) => (
              <Cell
                key={rate.id}
                hasLeftAccessory={false}
                title={rate.label}
                onClick={() => onChange({ vatId: rate.id })}
              />
            ))}
          </Dropdown>
        </div>

        {/* Построчный итог без НДС — тоже плашка, узел 4827:109373 */}
        <p className="ts-400-s ukd-item__row">Итого: {formatMoney(itemTotal(item))}</p>
      </div>
    </section>
  )
}

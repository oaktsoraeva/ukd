import { Cell, Checkbox, Drawer, DrawerFooter, DrawerHeader } from '@ds'
import { itemSummary } from '../lib/items'
import type { LineItem } from '../types'

interface ItemPickerDrawerProps {
  /** Черновик выбора: null — дровер закрыт, выбор провизорен до «Применить» */
  draft: string[] | null
  /** Позиции документа-основания */
  items: LineItem[]
  onToggle: (id: string) => void
  onToggleAll: () => void
  onClose: () => void
  onApply: () => void
}

/** Дровер «Выбор позиций» — узел 4788:107929 */
export function ItemPickerDrawer({
  draft,
  items,
  onToggle,
  onToggleAll,
  onClose,
  onApply,
}: ItemPickerDrawerProps) {
  const selected = draft ?? []
  const allSelected = items.length > 0 && selected.length === items.length

  return (
    <Drawer
      isOpen={draft !== null}
      onClose={onClose}
      className="ukd-picker-drawer"
      header={<DrawerHeader title="Выбор позиций" onClose={onClose} />}
      footer={
        /* Пока ничего не выбрано, применять нечего — кнопки нет вовсе */
        selected.length > 0 ? (
          <DrawerFooter
            layout="1-button"
            primaryAction={{ label: 'Применить', onClick: onApply, isSelected: true }}
          />
        ) : undefined
      }
    >
      <div className="drawer-body">
        <div className="ukd-picker-list">
          {/* Первая строка — выбрать все, с тем же счётчиком, что в чеклисте */}
          <div className="ukd-picker-list__row" role="button" tabIndex={0} onClick={onToggleAll}>
            <Cell
              hasLeftAccessory={false}
              title={`Выбрано ${selected.length} из ${items.length}`}
              titleClassName="ts-400-m"
              verticalPadding="3x"
              rightAccessory={
                <Checkbox
                  isChecked={allSelected}
                  isIndeterminate={selected.length > 0 && !allSelected}
                  label="Выбрать все позиции"
                />
              }
            />
          </div>

          {items.map((item) => (
            /* Checkbox презентационный: клик обрабатывает строка — иначе
               событие всплывает и переключает дважды */
            <div
              key={item.id}
              className="ukd-picker-list__row"
              role="button"
              tabIndex={0}
              onClick={() => onToggle(item.id)}
            >
              <Cell
                hasLeftAccessory={false}
                title={item.name}
                titleClassName="ts-400-m"
                description={itemSummary(item)}
                verticalPadding="3x"
                rightAccessory={
                  <Checkbox isChecked={selected.includes(item.id)} label={item.name} />
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  )
}

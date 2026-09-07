import { Fragment, useMemo, useState } from 'react'
import {
  Checkbox,
  Chip,
  ContextMenu,
  HeaderButton,
  NavigationBar,
  PageLayout,
  Table,
  TableCell,
} from '@ds'
import {
  ArrowUpUnderline,
  CoinsPlane,
  DocumentListAcsPlus,
  DotsThreeHorizontal,
  Filters,
  Gear,
  PlusCircle,
  RequisitesT,
  Trash,
  Truck,
} from '@ds/icons'
import { DocStatusText } from '../components/DocStatusText'
import { SearchBar } from '../components/SearchBar'
import { EmptyState } from '../components/ui/EmptyState'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CONTRACTORS } from '../data'
import type { ListDocument } from '../types'

const FILTERS = ['Все', 'Входящие', 'Исходящие', 'На подпись'] as const
type Filter = (typeof FILTERS)[number]

/** Раскладка колонок задана в CSS — там же живут адаптивные варианты */
const TABLE_COLUMNS = 'var(--ukd-table-columns)'

interface DocumentListScreenProps {
  documents: ListDocument[]
  onCreate: () => void
  onOpenDocument: (id: string) => void
  /** «Оформить УКД» из быстрых действий строки — узел 4450:89058 */
  onCreateUkd: (sourceDocId: string) => void
  onNotImplemented: () => void
}

/** Точка входа: список «Документооборот» — узел 4450:88803 */
export function DocumentListScreen({
  documents,
  onCreate,
  onOpenDocument,
  onCreateUkd,
  onNotImplemented,
}: DocumentListScreenProps) {
  /**
   * Таблица перестраивается в список карточек (узел 4450:88963) ниже ширины
   * макета: с боковой навигацией на 280px шести колонкам с такими названиями
   * места не остаётся, и они начинают обрезаться все сразу.
   */
  const isCompact = useMediaQuery('(max-width: 1279px)')
  const [filter, setFilter] = useState<Filter>('Все')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  /** ContextMenu в ките управляемый — держим id открытой строки */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const contractorById = useMemo(
    () => Object.fromEntries(CONTRACTORS.map((c) => [c.id, c])),
    [],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return documents.filter((doc) => {
      if (filter === 'Входящие' && doc.direction !== 'incoming') return false
      if (filter === 'Исходящие' && doc.direction !== 'outgoing') return false
      if (filter === 'На подпись' && doc.status !== 'awaiting_client') return false
      if (!needle) return true
      const contractor = contractorById[doc.contractorId]
      const haystack = `${doc.title} ${doc.date} ${doc.amount} ${contractor?.listName ?? ''}`
      return haystack.toLowerCase().includes(needle)
    })
  }, [documents, filter, query, contractorById])

  const allSelected = visible.length > 0 && visible.every((d) => selectedIds.includes(d.id))

  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : visible.map((d) => d.id))

  const toggleOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  /** Быстрые действия строки — узел 4450:89058 */
  const renderRowMenu = (doc: ListDocument) => (
    <ContextMenu
      isOpen={openMenuId === doc.id}
      onClose={() => setOpenMenuId(null)}
      placement="left"
      trigger={
        <button
          type="button"
          className="icon-button icon-button--32"
          aria-label="Действия с документом"
          onClick={() => setOpenMenuId(doc.id)}
        >
          <span className="ds-icon ds-icon--m ukd-cell__menu" aria-hidden="true">
            <DotsThreeHorizontal />
          </span>
        </button>
      }
      items={[
        {
          key: 'ukd',
          label: 'Оформить УКД',
          icon: <DocumentListAcsPlus />,
          onClick: () => doc.sourceDocId && onCreateUkd(doc.sourceDocId),
        },
        {
          key: 'delete',
          label: 'Удалить',
          icon: <Trash />,
          variant: 'danger',
          onClick: onNotImplemented,
        },
      ]}
    />
  )

  return (
    <PageLayout
      size="l"
      topOffset={74}
      navigationBar={
        <NavigationBar
          className="ukd-nav"
          hasDescription={false}
          hasRootLink={false}
          hasActionButton={false}
          title="Документооборот"
          backButtonLabel="Назад"
          items={[
            { kind: 'link', label: 'Создать платёж', onClick: onNotImplemented },
            { kind: 'link', label: 'Контрагенты', onClick: onNotImplemented },
            { kind: 'link', label: 'Бухгалтерия', onClick: onNotImplemented },
          ]}
        />
      }
    >
      <div className="ukd-list">
        <div className="ukd-list__actions">
          <div className="ukd-list__actions-group">
            <HeaderButton variant="primary" icon={<PlusCircle />} onClick={onCreate}>
              Создать
            </HeaderButton>
            <HeaderButton variant="secondary" icon={<ArrowUpUnderline />} onClick={onNotImplemented}>
              Загрузить
            </HeaderButton>
            {/* В макете это тот же Header Button, но без подписи */}
            <span className="ukd-list__icon-action">
              <HeaderButton variant="secondary" icon={<Gear />} onClick={onNotImplemented}>
                <span className="visually-hidden">Настройки таблицы</span>
              </HeaderButton>
            </span>
          </div>
          <HeaderButton variant="secondary" icon={<RequisitesT />} onClick={onNotImplemented}>
            Тарифы
          </HeaderButton>
        </div>

        <div className="ukd-list__search">
          <SearchBar
            value={query}
            placeholder="Документ, дата, сумма или контрагент"
            onChange={setQuery}
          />
        </div>

        {isCompact && (
          <button type="button" className="ts-500-m ukd-list__select-all" onClick={toggleAll}>
            {allSelected ? 'Снять всё' : 'Выбрать'}
          </button>
        )}

        <div className="ukd-list__toolbar">
          <button
            type="button"
            className="icon-button icon-button--32"
            aria-label="Фильтры"
            onClick={onNotImplemented}
          >
            {/* В макете глиф фильтров вписан в 16px, а не в 24px */}
            <span className="ds-icon ds-icon--xs" aria-hidden="true">
              <Filters />
            </span>
          </button>
          {FILTERS.map((f) => (
            <Chip key={f} variant="tab" isSelected={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
          <div className="ukd-list__toolbar-tail">
            <Chip
              variant="chip"
              leftAccessory="icon"
              leftIcon={<CoinsPlane />}
              onClick={onNotImplemented}
            >
              Авансовые отчёты
            </Chip>
            <Chip
              variant="chip"
              leftAccessory="icon"
              leftIcon={<Truck />}
              onClick={onNotImplemented}
            >
              Транспортный ЭДО
            </Chip>
          </div>
        </div>

        {visible.length === 0 ? (
          /* Список без документов — узел 1093:32162 */
          <div className="ukd-list__empty">
            <EmptyState text="Здесь будут документы. Пока их нет." />
          </div>
        ) : isCompact ? (
          /* Узел 4450:88963: таблица становится списком карточек */
          <Table className="ukd-cards" gridTemplateColumns="minmax(0, 1fr)">
            {visible.map((doc) => {
              const contractor = contractorById[doc.contractorId]

              return (
                <div key={doc.id} className="ukd-card-row">
                  <div className="ukd-card-row__main">
                    <p className="ts-500-l ukd-card-row__title">{doc.title}</p>
                    <p className="ts-400-s ukd-card-row__meta">{contractor?.listName ?? '—'}</p>
                    <p className="ts-400-s ukd-card-row__meta">{doc.date}</p>
                    <div className="ukd-card-row__bottom">
                      <DocStatusText status={doc.status} />
                      <span className="ts-500-l">{doc.amount}</span>
                    </div>
                  </div>
                  <div className="ukd-card-row__menu">{renderRowMenu(doc)}</div>
                </div>
              )
            })}
          </Table>
        ) : (
        <Table className="ukd-table" gridTemplateColumns={TABLE_COLUMNS}>
          <TableCell
            className="ukd-cell--center ukd-cell--action"
            hasTitle={false}
            hasLeftAccessory
            leftAccessory={
              <Checkbox
                isChecked={allSelected}
                isIndeterminate={!allSelected && visible.some((d) => selectedIds.includes(d.id))}
                onChange={toggleAll}
                label="Выбрать все документы"
              />
            }
          />
          <TableCell title="Документ" titleStyle="500" />
          <TableCell title="Контрагент" titleStyle="500" />
          <TableCell className="ukd-cell--center-text" title="Дата" titleStyle="500" />
          <TableCell className="ukd-cell--right" title="Сумма" titleStyle="500" />
          <TableCell className="ukd-cell--center-text" title="в 1С" titleStyle="500" />
          <TableCell hasTitle={false} />

          {visible.map((doc) => {
            const contractor = contractorById[doc.contractorId]

            return (
              <Fragment key={doc.id}>
                <TableCell
                  className="ukd-cell--center ukd-cell--action"
                  hasTitle={false}
                  hasLeftAccessory
                  leftAccessory={
                    <Checkbox
                      isChecked={selectedIds.includes(doc.id)}
                      onChange={() => toggleOne(doc.id)}
                      label={`Выбрать ${doc.title}`}
                    />
                  }
                />
                <TableCell
                  title={doc.title}
                  hasDescription
                  description={<DocStatusText status={doc.status} />}
                  onClick={() => onOpenDocument(doc.id)}
                />
                <TableCell
                  title={contractor?.listName ?? '—'}
                  hasDescription
                  description={`ИНН: ${contractor?.inn ?? '—'}`}
                  onClick={() => onOpenDocument(doc.id)}
                />
                <TableCell className="ukd-cell--center-text" title={doc.date} />
                <TableCell className="ukd-cell--right" title={doc.amount} />
                <TableCell className="ukd-cell--center-text" hasTitle={false} />
                <TableCell
                  className="ukd-cell--center ukd-cell--action"
                  hasTitle={false}
                  hasRightAccessory
                  rightAccessory={renderRowMenu(doc)}
                />
              </Fragment>
            )
          })}
        </Table>
        )}
      </div>
    </PageLayout>
  )
}

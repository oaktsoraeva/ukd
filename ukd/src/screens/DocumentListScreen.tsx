import { Fragment, useMemo, useState } from 'react'
import {
  Checkbox,
  ContextMenu,
  HeaderButton,
  NavigationBar,
  PageLayout,
  Table,
  TableCell,
  TabsCarousel,
} from '@ds'
import {
  ArrowUpUnderline,
  DocumentListAcsPlus,
  DotsThreeHorizontal,
  Gear,
  PlusCircle,
  RequisitesT,
  Trash,
} from '@ds/icons'
import { DocStatusText } from '../components/DocStatusText'
import { EmptyState } from '../components/ui/EmptyState'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CONTRACTORS } from '../data'
import type { ListDocument } from '../types'

/** Разделы ЭДО. Кроме первого ничего не собрано — узел 1195:34189 */
const SECTIONS = ['Документооборот', 'Перевозки', 'Чеки']

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

/** Точка входа: раздел «Документооборот» — узел 1195:34185 */
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
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  /** ContextMenu в ките управляемый — держим id открытой строки */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const contractorById = useMemo(
    () => Object.fromEntries(CONTRACTORS.map((c) => [c.id, c])),
    [],
  )

  const allSelected = documents.length > 0 && documents.every((d) => selectedIds.includes(d.id))

  const toggleAll = () => setSelectedIds(allSelected ? [] : documents.map((d) => d.id))

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
        /* Заголовок раздела переехал в контент табами, поэтому у боковой
           навигации остаются только кнопка «Назад» и ссылки (узел 1195:34373) */
        <NavigationBar
          className="ukd-nav ukd-list-nav"
          hasDescription={false}
          hasRootLink={false}
          hasActionButton={false}
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
        {/* Табы разделов и «Тарифы» в одной строке — узел 1195:34188.
            Своя кнопка действия у TabsCarousel без подложки, а в макете
            это обычный HeaderButton, поэтому ставим его рядом */}
        <div className="ukd-list__navbar">
          <TabsCarousel
            className="ukd-list__tabs"
            size="2xl"
            selectedIndex={0}
            tabs={SECTIONS.map((label) => ({ label }))}
            onTabChange={(index) => index !== 0 && onNotImplemented()}
          />
          <HeaderButton variant="secondary" icon={<RequisitesT />} onClick={onNotImplemented}>
            Тарифы
          </HeaderButton>
        </div>

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

        {documents.length === 0 ? (
          /* Раздел без документов — узел 1320:46761 */
          <div className="ukd-list__empty">
            <EmptyState text="Здесь будут документы. Пока их нет." />
          </div>
        ) : isCompact ? (
          /* Узел 4450:88963: таблица становится списком карточек */
          <Table className="ukd-cards" gridTemplateColumns="minmax(0, 1fr)">
            {documents.map((doc) => {
              const contractor = contractorById[doc.contractorId]

              return (
                <div key={doc.id} className="ukd-card-row">
                  {/* В карточной раскладке строка тоже открывает документ */}
                  <div
                    className="ukd-card-row__main"
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenDocument(doc.id)}
                  >
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
                  isIndeterminate={!allSelected && documents.some((d) => selectedIds.includes(d.id))}
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

            {documents.map((doc) => {
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

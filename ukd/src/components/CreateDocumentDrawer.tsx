import { useState } from 'react'
import { Cell, Drawer, DrawerHeader, TabsCarousel } from '@ds'
import {
  DocumentList,
  DocumentProfile,
  DocumentListBulleted,
  DocumentReport,
  FileAcsPen,
  FileAcsPencil,
  FileListShortReverse,
  FileListShortReverseAcsCalendar,
  FileListShortReverseAcsChartBar,
  FileListShortReverseAcsCoinsPlane,
  FileAcsMagnifier,
  FileListShortReverseAcsPercent,
  ReceiptListShort,
  TruckAcsPlus,
} from '@ds/icons'

/** Тип документа, который умеет создать прототип */
const UKD_ID = 'ukd'

type Group = 'main' | 'build' | 'transport'

interface DocType {
  id: string
  group: Group
  title: string
  description: string
  icon: React.ReactNode
}

/** Список типов документов — узел 4424:58101 */
const DOC_TYPES: DocType[] = [
  { id: 'invoice-pay', group: 'main', title: 'Счёт на оплату', description: 'Отправляется покупателю для оплаты товара или услуги', icon: <ReceiptListShort /> },
  { id: 'act', group: 'main', title: 'Акт', description: 'Подтверждает факт предоставления услуги', icon: <FileAcsPen /> },
  { id: 'upd', group: 'main', title: 'УПД', description: 'Подтверждает оказание услуги или отгрузку и сумму НДС', icon: <FileListShortReverse /> },
  { id: 'waybill', group: 'main', title: 'Товарная накладная', description: 'Подтверждает отгрузку товаров и их стоимость', icon: <DocumentListBulleted /> },
  { id: 'contract', group: 'main', title: 'Договор', description: 'Фиксирует договорённости между вами и контрагентом', icon: <DocumentList /> },
  { id: 'invoice', group: 'main', title: 'Счёт‑фактура', description: 'Отправляется вместе с актом или накладной и подтверждает сумму НДС', icon: <FileListShortReverseAcsPercent /> },
  { id: 'reconciliation', group: 'main', title: 'Акт сверки', description: 'Сверяет расчёты с контрагентами и проверяет наличие задолженностей', icon: <FileAcsMagnifier /> },
  { id: UKD_ID, group: 'main', title: 'УКД', description: 'Корректирует стоимость товаров, работ или услуг в УПД или счёт‑фактуре', icon: <FileAcsPencil /> },
  { id: 'requisites-addendum', group: 'main', title: 'Допсоглашение о смене реквизитов', description: 'Закрепляет новые реквизиты для действующей сделки', icon: <DocumentProfile /> },

  { id: 'estimate', group: 'build', title: 'Смета', description: 'Фиксирует перечень и стоимость работ', icon: <FileListShortReverseAcsChartBar /> },
  { id: 'ks2', group: 'build', title: 'КС‑2', description: 'Подтверждает, что строительные работы выполнены и приняты', icon: <DocumentReport /> },
  { id: 'ks3', group: 'build', title: 'КС‑3', description: 'Фиксирует стоимость строительных работ', icon: <FileListShortReverseAcsCalendar /> },

  { id: 'consignment', group: 'transport', title: 'Транспортная накладная', description: 'ЭТрН подтверждает перевозку груза', icon: <TruckAcsPlus /> },
  { id: 'order', group: 'transport', title: 'Заказ‑заявка', description: 'ЭЗЗ фиксирует договорённости об условиях перевозки', icon: <FileListShortReverseAcsCoinsPlane /> },
  { id: 'forwarder', group: 'transport', title: 'Поручение экспедитору', description: 'ЭПЭ фиксирует договорённости об организации перевозки', icon: <FileListShortReverse /> },
]

const GROUP_TITLES: Record<Group, string | null> = {
  main: null,
  build: 'Документы в строительстве',
  transport: 'Перевозочные документы',
}

/** Табы фильтруют список по группам */
const TABS: { label: string; groups: Group[] }[] = [
  { label: 'Все', groups: ['main', 'build', 'transport'] },
  { label: 'Стройка', groups: ['build'] },
  { label: 'Перевозки', groups: ['transport'] },
]

interface CreateDocumentDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCreateUkd: () => void
  onNotImplemented: (label: string) => void
}

/** Точка входа: дровер «Создать документ» — узел 4424:58101 */
export function CreateDocumentDrawer({
  isOpen,
  onClose,
  onCreateUkd,
  onNotImplemented,
}: CreateDocumentDrawerProps) {
  const [tab, setTab] = useState(0)
  const groups = TABS[tab].groups

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      className="ukd-create-drawer"
      header={<DrawerHeader title="Создать документ" onClose={onClose} />}
      footer={null}
    >
      <div className="drawer-body">
        <TabsCarousel
          tabs={TABS.map(({ label }) => ({ label }))}
          size="xl"
          selectedIndex={tab}
          onTabChange={setTab}
        />

        {groups.map((group) => {
          const types = DOC_TYPES.filter((t) => t.group === group)
          if (types.length === 0) return null

          return (
            <div key={group} className="ukd-group">
              {GROUP_TITLES[group] && (
                <h2 className="ts-600-xl ukd-group__title">{GROUP_TITLES[group]}</h2>
              )}
              <div className="ukd-doc-types">
                {types.map((type) => (
                  <Cell
                    key={type.id}
                    title={type.title}
                    description={type.description}
                    verticalPadding="3x"
                    leftAccessory={
                      <span className="ds-icon ds-icon--m ukd-doc-types__icon" aria-hidden="true">
                        {type.icon}
                      </span>
                    }
                    hasRightAccessory={false}
                    onClick={
                      type.id === UKD_ID ? onCreateUkd : () => onNotImplemented(type.title)
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}

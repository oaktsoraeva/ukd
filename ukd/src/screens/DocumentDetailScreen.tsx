import { Avatar, Footer, NavigationBar, PageAction, PageLayout, Tag } from '@ds'
import {
  ArrowDownUnderline,
  ArrowRotationLeft,
  Cards,
  Chain,
  Envelope,
  Pencil,
  Printer,
  Trash,
} from '@ds/icons'
import filePdf from '../assets/file-pdf.svg'
import docPaid from '../assets/logos/doc-paid.png'
import { DsIcon } from '../components/ui/DsIcon'
import { NavigatorCard, type NavigatorRow } from '../components/ui/NavigatorCard'
import { CONTRACTORS, DOC_STATUS, EDO_OPERATOR, SOURCE_DOCS } from '../data'
import { formatMoney } from '../lib/format'
import { sourceDocTotal } from '../lib/items'
import type { ListDocStatus, ListDocument } from '../types'

/** Бейдж статуса под заголовком — узел 5040:12720 */
const STATUS_BADGE: Record<ListDocStatus, { label: string; tone: string }> = {
  awaiting_client: { label: 'Ждёт вашей подписи', tone: 'ukd-tag--brand' },
  awaiting_counterparty: { label: 'Ждёт подписи контрагента', tone: 'ukd-tag--neutral' },
  signed: { label: 'Подписано', tone: 'ukd-tag--success' },
  annulment_in_progress: { label: 'В процессе аннуляции', tone: 'ukd-tag--neutral' },
  withdrawn: { label: 'Отозвано вами', tone: 'ukd-tag--error' },
  rejected: { label: 'Отклонено контрагентом', tone: 'ukd-tag--error' },
  annulled: { label: 'Аннулировано', tone: 'ukd-tag--error' },
}

const ACTION_ICONS = {
  link: <Chain />,
  mail: <Envelope />,
  download: <ArrowDownUnderline />,
  print: <Printer />,
  duplicate: <Cards />,
  edit: <Pencil />,
  history: <ArrowRotationLeft />,
} as const

type ActionKey = keyof typeof ACTION_ICONS

interface DetailAction {
  key: ActionKey
  label: string
}

const LINK = (kind: string): DetailAction => ({
  key: 'link',
  label: `Ссылка на ${kind}`,
})

const MAIL: DetailAction = { key: 'mail', label: 'Отправить на почту' }
const HISTORY: DetailAction = { key: 'history', label: 'История' }

/**
 * Набор действий и кнопка подвала зависят от статуса — узлы 5040:12725
 * (ждёт вашей подписи), 5040:12772 (ждёт контрагента), 5040:12806 (подписано)
 */
function actionsFor(status: ListDocStatus, kind: string): DetailAction[] {
  if (status === 'awaiting_client') {
    return [
      LINK(kind),
      MAIL,
      { key: 'download', label: 'Скачать' },
      { key: 'print', label: 'Распечатать' },
      { key: 'duplicate', label: 'Дублировать' },
      { key: 'edit', label: 'Редактировать' },
      HISTORY,
    ]
  }
  if (status === 'signed') {
    return [
      LINK(kind),
      MAIL,
      { key: 'download', label: 'Скачать архив' },
      { key: 'duplicate', label: 'Дублировать' },
      HISTORY,
    ]
  }
  return [LINK(kind), MAIL, { key: 'download', label: 'Скачать архив' }, HISTORY]
}

/** Кнопка подвала: подписываем сами, иначе отзываем или аннулируем */
function footerFor(status: ListDocStatus) {
  if (status === 'awaiting_client') {
    return { label: 'Подписать и отправить', isPrimary: true }
  }
  if (status === 'signed') return { label: 'Аннулировать', isPrimary: false }
  return { label: 'Отозвать', isPrimary: false }
}

const KIND_TITLES: Record<string, string> = {
  'outgoing-upd': 'Исходящий УПД',
  'outgoing-invoice': 'Исходящий счёт-фактура',
  'incoming-upd': 'Входящий УПД',
  'incoming-invoice': 'Входящий счёт-фактура',
  'outgoing-ukd': 'Исходящий УКД',
  'incoming-ukd': 'Входящий УКД',
}

/** Подстановка в «Ссылка на …» */
const KIND_LABELS: Record<string, string> = {
  upd: 'УПД',
  invoice: 'счёт-фактуру',
  ukd: 'УКД',
}

interface DocumentDetailScreenProps {
  document: ListDocument
  onBack: () => void
  onSign: () => void
  onNotImplemented: () => void
}

/** Детализация документа — узел 5040:12714 */
export function DocumentDetailScreen({
  document,
  onBack,
  onSign,
  onNotImplemented,
}: DocumentDetailScreenProps) {
  const contractor = CONTRACTORS.find((c) => c.id === document.contractorId)
  const kindTitle = KIND_TITLES[`${document.direction}-${document.kind}`] ?? 'Документ'
  const shortTitle = document.title.replace(/^(УПД|УКД|Счёт-фактура)\s/, '')
  const docLabel = KIND_LABELS[document.kind] ?? 'документ'
  const badge = STATUS_BADGE[document.status]
  const footer = footerFor(document.status)

  const basis = SOURCE_DOCS.find((d) => d.id === document.sourceDocId)

  const linkedRows: NavigatorRow[] = basis
    ? [
        {
          subtitle: DOC_STATUS[basis.status].label,
          title: basis.title,
          description: formatMoney(sourceDocTotal(basis)),
          accessory: <img className="ukd-navigator__tile" src={docPaid} width={40} height={40} alt="" />,
        },
      ]
    : []

  return (
    <>
      <PageLayout
        size="s"
        topOffset={74}
        navigationBar={
          <NavigationBar
            className="ukd-nav"
            title={kindTitle}
            rootLinkLabel="Документооборот"
            hasDescription={false}
            hasActionButton={false}
            backButtonLabel="Назад"
            onBackClick={onBack}
            onRootLinkClick={onBack}
          />
        }
      >
        <div className="ukd-page">
          <div className="ukd-page__header">
            <h1 className="ts-600-4xl ukd-page__title">{shortTitle}</h1>
            <p className="ts-400-s ukd-page__subtitle">
              Сумма: {document.amount}&emsp;НДС: {document.vat}
            </p>
            <div className="ukd-detail__badge">
              <Tag shape="square" size="s" className={`ukd-tag ${badge.tone}`}>
                {badge.label}
              </Tag>
            </div>
          </div>

          <div className="ukd-detail__cards">
            <NavigatorCard
              title="Контрагент"
              rows={[
                {
                  title: contractor?.listName ?? '—',
                  description: `ИНН: ${contractor?.inn ?? '—'}\n${EDO_OPERATOR}`,
                  accessory: (
                    <Avatar
                      className="ukd-avatar"
                      label={contractor?.initials}
                      size="m"
                      style={{ '--avatar-surface': contractor?.color } as React.CSSProperties}
                    />
                  ),
                },
              ]}
            />

            <NavigatorCard
              title="Документ"
              rows={[
                {
                  title: document.title,
                  accessory: (
                    <img
                      className="ukd-navigator__tile ukd-navigator__tile--file"
                      src={filePdf}
                      width={24}
                      height={24}
                      alt=""
                    />
                  ),
                },
              ]}
            />

            {linkedRows.length > 0 && (
              <NavigatorCard title="Связанные документы" rows={linkedRows} />
            )}
          </div>

          <div className="ukd-detail__actions">
            {actionsFor(document.status, docLabel).map((action) => (
              <PageAction
                key={action.label}
                title={action.label}
                hasDescription={false}
                leftAccessory={<DsIcon>{ACTION_ICONS[action.key]}</DsIcon>}
                onClick={onNotImplemented}
              />
            ))}
            <PageAction
              title="Удалить"
              hasDescription={false}
              variant="danger"
              leftAccessory={<DsIcon><Trash /></DsIcon>}
              onClick={onNotImplemented}
            />
          </div>
        </div>
      </PageLayout>

      <Footer
        className={footer.isPrimary ? undefined : 'ukd-footer--neutral'}
        layout="1-button"
        primaryAction={{
          label: footer.label,
          onClick: footer.isPrimary ? onSign : onNotImplemented,
        }}
      />
    </>
  )
}

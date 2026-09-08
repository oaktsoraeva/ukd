import { Avatar, Cell, Footer, NavigationBar, PageAction, PageLayout, Tag } from '@ds'
import {
  ArrowDownUnderline,
  ArrowRightTopOutgoingSquare,
  ArrowRotationLeft,
  Chain,
  DocumentListAcsPlus,
  Envelope,
  FileListShortReverse,
  Cards,
  Trash,
} from '@ds/icons'
import { docStatusLabel } from '../components/DocStatusText'
import { CONTRACTORS } from '../data'
import type { ListDocStatus, ListDocument } from '../types'

/** Цвет тега статуса — узел 4428:76370 */
const STATUS_TAG: Record<ListDocStatus, string> = {
  signed: 'ukd-tag--success',
  awaiting_client: 'ukd-tag--neutral',
  annulment_in_progress: 'ukd-tag--neutral',
  withdrawn: 'ukd-tag--error',
  rejected: 'ukd-tag--error',
  annulled: 'ukd-tag--error',
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
  onCreateUkd: () => void
  onNotImplemented: () => void
}

/** Точка входа: карточка документа — узел 4428:76370 */
export function DocumentDetailScreen({
  document,
  onBack,
  onCreateUkd,
  onNotImplemented,
}: DocumentDetailScreenProps) {
  const contractor = CONTRACTORS.find((c) => c.id === document.contractorId)
  const kindTitle = KIND_TITLES[`${document.direction}-${document.kind}`] ?? 'Документ'
  const shortTitle = document.title.replace(/^(УПД|УКД|Счёт-фактура)\s/, '')
  const docLabel = KIND_LABELS[document.kind] ?? 'документ'

  const actions = [
    { label: 'Отправить в 1С', icon: <ArrowRightTopOutgoingSquare /> },
    { label: `Ссылка на ${docLabel}`, icon: <Chain /> },
    { label: 'Отправить на почту', icon: <Envelope /> },
    { label: 'Скачать архив', icon: <ArrowDownUnderline /> },
    { label: 'Дублировать', icon: <Cards /> },
    { label: 'Создать связанный документ', icon: <DocumentListAcsPlus /> },
    { label: 'История', icon: <ArrowRotationLeft /> },
  ]

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
              <Tag shape="square" size="s" className={`ukd-tag ${STATUS_TAG[document.status]}`}>
                {docStatusLabel(document.status)}
              </Tag>
            </div>
          </div>

          <div className="ukd-detail__cards">
            <div className="ukd-card">
              <p className="ts-500-l ukd-card__title">Контрагент</p>
              <Cell
                title={contractor?.listName ?? '—'}
                description={`ИНН: ${contractor?.inn ?? '—'}`}
                leftAccessory={
                  <Avatar
                    className="ukd-avatar"
                    label={contractor?.initials}
                    size="m"
                    style={{ '--avatar-surface': contractor?.color } as React.CSSProperties}
                  />
                }
                hasRightAccessory={false}
              />
            </div>

            <div className="ukd-card">
              <p className="ts-500-l ukd-card__title">Документ</p>
              <Cell
                title={document.title}
                leftAccessory={
                  <span className="ds-icon ds-icon--m ukd-card__doc-icon" aria-hidden="true">
                    <FileListShortReverse />
                  </span>
                }
                hasRightAccessory={false}
              />
            </div>
          </div>

          <div className="ukd-detail__actions">
            {/* Главное действие сценария — с описанием, как в макете.
                Сам УКД корректировать нечем, поэтому у него его нет */}
            {document.kind !== 'ukd' && (
              <PageAction
                title="Оформить УКД"
                description={`УКД корректирует стоимость товаров, работ или услуг в ${
                  document.kind === 'upd' ? 'УПД' : 'счёте-фактуре'
                }`}
                leftAccessory={<DocumentListAcsPlus />}
                onClick={onCreateUkd}
              />
            )}
            {actions.map((action) => (
              <PageAction
                key={action.label}
                title={action.label}
                hasDescription={false}
                leftAccessory={action.icon}
                onClick={onNotImplemented}
              />
            ))}
            <PageAction
              title="Удалить"
              hasDescription={false}
              variant="danger"
              leftAccessory={<Trash />}
              onClick={onNotImplemented}
            />
          </div>
        </div>
      </PageLayout>

      <Footer
        className="ukd-footer--neutral"
        layout="1-button"
        primaryAction={{ label: 'Аннулировать', onClick: onNotImplemented }}
      />
    </>
  )
}

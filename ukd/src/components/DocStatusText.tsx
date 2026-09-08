import type { ListDocStatus } from '../types'

const STATUS_CONFIG: Record<ListDocStatus, { label: string; className: string }> = {
  awaiting_client: { label: 'Ждёт подписи', className: 'ukd-status--pending' },
  awaiting_counterparty: { label: 'Ждёт подписи контрагента', className: 'ukd-status--pending' },
  signed: { label: 'Подписано', className: 'ukd-status--signed' },
  annulment_in_progress: { label: 'В процессе аннуляции', className: 'ukd-status--pending' },
  withdrawn: { label: 'Отозвано вами', className: 'ukd-status--danger' },
  rejected: { label: 'Отклонено контрагентом', className: 'ukd-status--danger' },
  annulled: { label: 'Аннулировано', className: 'ukd-status--danger' },
}

export function docStatusLabel(status: ListDocStatus): string {
  return STATUS_CONFIG[status].label
}

/** Статус под названием документа — узел 4450:88803 */
export function DocStatusText({ status }: { status: ListDocStatus }) {
  const config = STATUS_CONFIG[status]
  return <span className={`ts-400-s ${config.className}`}>{config.label}</span>
}

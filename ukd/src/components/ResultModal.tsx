import { Avatar, LinkCell, Modal, ModalFooter, ModalHeader } from '@ds'
import { ArrowDownUnderline, Chain, Checkmark, Envelope } from '@ds/icons'

interface ResultModalProps {
  isOpen: boolean
  /** Название контрагента для подстановки в текст */
  contractorName: string
  onClose: () => void
  onSign: () => void
  onAction: (label: string) => void
}

const ACTIONS = [
  { label: 'Копировать ссылку', icon: <Chain /> },
  { label: 'Отправить на почту', icon: <Envelope /> },
  { label: 'Скачать документ', icon: <ArrowDownUnderline /> },
]

/**
 * «Документ создан!» — узел 4624:91118.
 * Китовый FlowResultView не подошёл: у него футер жёстко зашит на «Готово»
 * и нет кнопки закрытия, а в макете нужны крестик и «Подписать и отправить».
 * Собираем из тех же примитивов кита.
 */
export function ResultModal({
  isOpen,
  contractorName,
  onClose,
  onSign,
  onAction,
}: ResultModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="ukd-result-modal"
      header={<ModalHeader onClose={onClose} />}
      footer={
        <ModalFooter
          layout="1-button"
          primaryAction={{ label: 'Подписать и отправить', isSelected: true, onClick: onSign }}
        />
      }
    >
      <div className="ukd-result">
        <Avatar
          size="l"
          shape="superellipse"
          icon={<Checkmark />}
          style={
            {
              '--avatar-surface': 'var(--bg-success-1)',
              '--avatar-color': 'var(--primitive-success)',
            } as React.CSSProperties
          }
        />

        <div className="ukd-result__content">
          <h2 className="ts-600-2xl ukd-result__title">Документ создан!</h2>
          <p className="ts-400-s ukd-result__text">
            Сохранили его для вас в ЭДО. {contractorName} получит документ, когда вы его подпишете.
          </p>
        </div>

        <div className="ukd-result__actions">
          {ACTIONS.map((action) => (
            <LinkCell
              key={action.label}
              title={action.label}
              icon={action.icon}
              size="m"
              onClick={() => onAction(action.label)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

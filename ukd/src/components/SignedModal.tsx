import { Avatar, LinkCell, Modal, ModalFooter, ModalHeader } from '@ds'
import { ArrowDownUnderline, Chain, Checkmark } from '@ds/icons'

interface SignedModalProps {
  isOpen: boolean
  /** Название контрагента для подстановки в текст */
  contractorName: string
  onClose: () => void
  onAction: (label: string) => void
}

const ACTIONS = [
  { label: 'Копировать ссылку', icon: <Chain /> },
  { label: 'Скачать архив', icon: <ArrowDownUnderline /> },
]

/**
 * «Документ подписан!» — узел 5056:72518. Оболочка та же, что у
 * «Документ создан!»: Flow Result View из примитивов кита.
 */
export function SignedModal({ isOpen, contractorName, onClose, onAction }: SignedModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="ukd-result-modal"
      header={<ModalHeader onClose={onClose} />}
      footer={
        <ModalFooter
          layout="1-button"
          primaryAction={{ label: 'Готово', isSelected: true, onClick: onClose }}
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
              '--avatar-surface': 'var(--bg-success-2)',
              '--avatar-color': 'var(--primitive-success)',
            } as React.CSSProperties
          }
        />

        <div className="ukd-result__content">
          <h2 className="ts-600-4xl ukd-result__title">Документ подписан!</h2>
          <p className="ts-400-m ukd-result__text">
            {contractorName} увидит его в своём сервисе ЭДО
          </p>
        </div>

        <div className="ukd-result__actions">
          {ACTIONS.map((action) => (
            <LinkCell
              key={action.label}
              title={action.label}
              icon={action.icon}
              size="l"
              onClick={() => onAction(action.label)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

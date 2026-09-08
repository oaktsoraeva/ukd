import { Avatar, Modal, ModalFooter, ModalHeader } from '@ds'
import { Watch } from '@ds/icons'

interface CancelledModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * «Создание документа отменено».
 * Как и у ResultModal, китовый FlowResultView не подошёл: его футер зашит
 * на «Готово», а в макете кнопка «Закрыть». Разметку, стили и типографику
 * переиспользуем — это тот же Flow Result View, что в узле 4888:143045.
 */
export function CancelledModal({ isOpen, onClose }: CancelledModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="ukd-result-modal"
      header={<ModalHeader onClose={onClose} />}
      footer={
        <ModalFooter
          layout="1-button"
          primaryAction={{ label: 'Закрыть', isSelected: true, onClick: onClose }}
        />
      }
    >
      <div className="ukd-result">
        <Avatar
          size="l"
          shape="superellipse"
          icon={<Watch />}
          style={
            {
              '--avatar-surface': 'var(--bg-brand-1)',
              '--avatar-color': 'var(--primitive-brand)',
            } as React.CSSProperties
          }
        />

        <div className="ukd-result__content">
          <h2 className="ts-600-4xl ukd-result__title">Создание документа отменено</h2>
          <p className="ts-400-m ukd-result__text">
            Удалили черновик УКД, потому что в нём нет корректировок.
          </p>
        </div>
      </div>
    </Modal>
  )
}

import { useRef } from 'react'
import { ActionSheet, ActionSheetButton, ActionSheetFooter, ActionSheetHeader } from '@ds'
import { Trash } from '@ds/icons'

export interface ConfirmCopy {
  title: string
  action: string
}

interface ConfirmActionSheetProps {
  /** null — шит закрыт */
  copy: ConfirmCopy | null
  onClose: () => void
  onConfirm: () => void
}

/**
 * Подтверждение разрушающего действия — узел 4788:109537.
 * Используется для удаления секции («Удалить из корректировки?») и для
 * сброса выбранных позиций при выключении тоггла (стикер 4788:109516).
 */
export function ConfirmActionSheet({ copy, onClose, onConfirm }: ConfirmActionSheetProps) {
  /* Держим текст, пока шит доигрывает анимацию выхода: иначе заголовок
     на 300 мс становится пустым */
  const lastRef = useRef(copy)
  if (copy) lastRef.current = copy
  const shown = lastRef.current

  return (
    <ActionSheet
      isOpen={copy !== null}
      onClose={onClose}
      header={<ActionSheetHeader title={shown?.title ?? ''} />}
      footer={<ActionSheetFooter onClick={onClose} />}
    >
      <ActionSheetButton
        title={shown?.action ?? 'Удалить'}
        variant="danger"
        icon={<Trash />}
        onClick={onConfirm}
      />
    </ActionSheet>
  )
}

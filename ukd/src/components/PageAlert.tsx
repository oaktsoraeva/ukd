import { Alert } from '@ds'

export interface PageAlertState {
  type: 'success' | 'error'
  text: string
  /** Меняется при каждом показе, чтобы Alert перезапускал анимацию */
  key: number
}

interface PageAlertProps {
  alert: PageAlertState | null
  onHide: () => void
}

/**
 * Полоса уведомления под верхней навигацией — узлы 4580:139012 / 4624:90623.
 * Китовый Alert сам фиксируется у top: 0, поэтому опускаем его на высоту
 * MainPageNavigationBar через свой слот.
 */
export function PageAlert({ alert, onHide }: PageAlertProps) {
  if (!alert) return null

  return (
    <div className="ukd-alert-slot">
      <Alert key={alert.key} type={alert.type} textAlign="center" onHide={onHide}>
        {alert.text}
      </Alert>
    </div>
  )
}

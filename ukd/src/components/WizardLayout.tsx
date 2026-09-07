import type { ReactNode } from 'react'
import { Footer, NavigationBar, PageLayout } from '@ds'
import type { StepDescriptor, StepId } from '../types'

interface WizardLayoutProps {
  /** Видимые шаги — считает lib/steps.ts, набор меняется по ходу сценария */
  steps: StepDescriptor[]
  step: StepId
  /** Подпись кнопки футера: «Продолжить» на всех шагах, кроме последнего */
  primaryLabel: string
  onPrimary: () => void
  onBack: () => void
  onStepClick: (step: StepId) => void
  /** Панель итогов шага «Корректировка позиций» (узел 4867:92597) */
  rightPanel?: ReactNode
  children: ReactNode
}

/**
 * Каркас всех шагов: боковая навигация с прогрессом, колонка контента 720px
 * и залипающий футер. topOffset={74} компенсирует фиксированный
 * MainPageNavigationBar. Footer — сосед PageLayout, а не его ребёнок.
 */
export function WizardLayout({
  steps,
  step,
  primaryLabel,
  onPrimary,
  onBack,
  onStepClick,
  rightPanel,
  children,
}: WizardLayoutProps) {
  const activeIndex = steps.findIndex((s) => s.id === step)

  return (
    <>
      <PageLayout
        size="s"
        topOffset={74}
        rightPanel={rightPanel}
        navigationBar={
          <NavigationBar
            title="Новый УКД"
            rootLinkLabel="Документооборот"
            hasDescription={false}
            hasActionButton={false}
            backButtonLabel="Назад"
            onBackClick={onBack}
            items={steps.map(({ id, label }, index) => ({
              kind: 'step' as const,
              key: id,
              label,
              state:
                index === activeIndex ? ('current' as const)
                : index < activeIndex ? ('completed' as const)
                : ('upcoming' as const),
              // Назад можно, вперёд через шаг — нет
              onClick: index < activeIndex ? () => onStepClick(id) : undefined,
            }))}
          />
        }
      >
        {children}
      </PageLayout>

      <Footer layout="1-button" primaryAction={{ label: primaryLabel, onClick: onPrimary }} />
    </>
  )
}

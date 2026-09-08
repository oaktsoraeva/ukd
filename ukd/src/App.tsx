import { useMemo, useState } from 'react'
import { MainPageNavigationBar } from '@ds'
import { WizardLayout } from './components/WizardLayout'
import { DocumentListScreen } from './screens/DocumentListScreen'
import { DocumentDetailScreen } from './screens/DocumentDetailScreen'
import { DocumentStep } from './screens/DocumentStep'
import { BlocksStep } from './screens/BlocksStep'
import { ItemsStep } from './screens/ItemsStep'
import { ReviewStep } from './screens/ReviewStep'
import { CreateDocumentDrawer } from './components/CreateDocumentDrawer'
import { ItemPickerDrawer } from './components/ItemPickerDrawer'
import { ItemsTotalsPanel } from './components/ItemsTotalsPanel'
import { ConfirmActionSheet, type ConfirmCopy } from './components/ConfirmActionSheet'
import { PageAlert, type PageAlertState } from './components/PageAlert'
import { ResultModal } from './components/ResultModal'
import { SignedModal } from './components/SignedModal'
import { CancelledModal } from './components/CancelledModal'
import { availableBlocks, BLOCK_IDS } from './blocks'
import {
  CONTRACTORS,
  CUSTOMER,
  FAILING_SOURCE_DOC_ID,
  NOT_IMPLEMENTED,
  REQUEST_ERROR,
  UNITS,
  notImplementedFor,
  TODAY,
} from './data'
import { applySourceDoc, emptyPrefill, findSourceDoc, isDiff } from './lib/prefill'
import { ukdDateError, validateBlock, validateItem } from './lib/validate'
import { itemsTotals } from './lib/items'
import { formatMoney } from './lib/format'
import { reviewBlockPairs, reviewItems } from './lib/review'
import { nextStep, prevStep, visibleSteps } from './lib/steps'
import type {
  BlockValues,
  Contractor,
  CorrectionBlockId,
  ItemValues,
  LineItem,
  ListDocument,
  StepId,
} from './types'

/** Экраны: список и карточка — точки входа, дальше визард из четырёх шагов */
type Screen = 'list' | 'detail' | StepId

const WIZARD_STEPS: StepId[] = ['document', 'blocks', 'items', 'review']

const noBlocksSelected = (): Record<CorrectionBlockId, boolean> =>
  Object.fromEntries(BLOCK_IDS.map((id) => [id, false])) as Record<CorrectionBlockId, boolean>

/**
 * Номер следующего УКД. В макете 4788:88953 поле пустое с плейсхолдером,
 * но номер присваивает система, поэтому подставляем его сразу — как и дату
 */
const nextUkdNumber = (docs: ListDocument[]): string =>
  String(docs.filter((d) => d.kind === 'ukd').length + 1)

const noAttempts = (): Record<StepId, boolean> =>
  Object.fromEntries(WIZARD_STEPS.map((id) => [id, false])) as Record<StepId, boolean>

/** Что подтверждаем разрушающим шитом */
type ConfirmKind = { kind: 'items-reset' } | { kind: 'block'; id: CorrectionBlockId }

const CONFIRM_COPY: Record<'items-reset' | 'block', ConfirmCopy> = {
  // Узла в макете нет, текст по стикеру 4788:109516
  'items-reset': { title: 'Сбросить выбранные позиции?', action: 'Сбросить' },
  block: { title: 'Удалить из корректировки?', action: 'Удалить' },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('list')
  /**
   * Список стартует пустым — точка входа прототипа это пустое состояние
   * «Документооборота» (узел 1093:32162). Созданные УКД сюда добавляются,
   * так что карточка документа доступна через них.
   */
  const [documents, setDocuments] = useState<ListDocument[]>([])
  const [detailDocId, setDetailDocId] = useState<string | null>(null)
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)

  /* Шаг «Документ» */
  const [sourceDocId, setSourceDocId] = useState<string | null>(null)
  const [ukdNumber, setUkdNumber] = useState('')
  const [ukdDate, setUkdDate] = useState(TODAY)
  /** Что правим — источник правды и для секций шага 2, и для навигации */
  const [selectedBlocks, setSelectedBlocks] = useState(noBlocksSelected)
  const [itemsOn, setItemsOn] = useState(false)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

  /* Данные */
  const initial = useMemo(() => emptyPrefill(), [])
  const [blockValues, setBlockValues] = useState<Record<CorrectionBlockId, BlockValues>>(
    initial.blockValues,
  )
  /** Значения основания — только для подписей «Было: …», не для сравнения */
  const [sourceValues, setSourceValues] = useState<Record<CorrectionBlockId, BlockValues>>(
    initial.sourceValues,
  )
  const [items, setItems] = useState<LineItem[]>(initial.items)

  /* Валидация зажигается кнопкой футера, отдельно на каждом шаге */
  const [attempted, setAttempted] = useState(noAttempts)

  /* Оверлеи: null/false означает «закрыто» */
  /** Черновик «Выбора позиций»; null одновременно значит «дровер закрыт» */
  const [pickerDraft, setPickerDraft] = useState<string[] | null>(null)
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null)
  const [resultOpen, setResultOpen] = useState(false)
  /** «Документ подписан!» — узел 5056:72518 */
  const [signedOpen, setSignedOpen] = useState(false)
  const [cancelledOpen, setCancelledOpen] = useState(false)
  /** Свитч «Показать значения до корректировки» на обзоре, по умолчанию выключен */
  const [showPrevValues, setShowPrevValues] = useState(false)
  /** «Ошибка создания» срабатывает один раз, повторное нажатие проходит */
  const [createFailed, setCreateFailed] = useState(false)
  const [pageAlert, setPageAlert] = useState<PageAlertState | null>(null)

  const detailDocument = documents.find((d) => d.id === detailDocId) ?? null
  const sourceDoc = findSourceDoc(sourceDocId)

  /** Позиции документа-основания — универсум для «Выбрано N из M» */
  const sourceItems = useMemo(() => items.filter((i) => i.origin !== null), [items])

  /** Блоки, применимые к выбранному основанию */
  const availableBlockList = useMemo(() => availableBlocks(sourceDoc?.kind ?? null), [sourceDoc])

  /** Выбранные блоки в порядке реестра — секции шага 2 */
  const selectedBlockList = useMemo(
    () => availableBlockList.filter((b) => selectedBlocks[b.id]),
    [availableBlockList, selectedBlocks],
  )

  const steps = useMemo(
    () =>
      visibleSteps({
        selectedBlockCount: selectedBlockList.length,
        itemsOn,
        selectedItemCount: selectedItemIds.length,
      }),
    [selectedBlockList.length, itemsOn, selectedItemIds.length],
  )

  const step: StepId = WIZARD_STEPS.includes(screen as StepId) ? (screen as StepId) : 'document'
  const isWizard = WIZARD_STEPS.includes(screen as StepId)

  /** Ошибки полей по блокам. Зажигаются только после нажатия «Продолжить» */
  const blockErrors = useMemo(() => {
    const empty = Object.fromEntries(BLOCK_IDS.map((id) => [id, {}])) as Record<
      CorrectionBlockId,
      Record<string, string>
    >
    if (!attempted.blocks) return empty
    for (const block of selectedBlockList) {
      empty[block.id] = validateBlock(block, blockValues[block.id])
    }
    return empty
  }, [attempted.blocks, selectedBlockList, blockValues])

  /** Выбранные позиции — секции шага 3 и слагаемые правой панели */
  const selectedItems = useMemo(
    () => items.filter((i) => selectedItemIds.includes(i.id)),
    [items, selectedItemIds],
  )

  const totals = useMemo(() => itemsTotals(selectedItems), [selectedItems])

  /** Ошибки полей позиций, зажигаются кнопкой футера */
  const itemErrors = useMemo(() => {
    if (!attempted.items) return {}
    return Object.fromEntries(selectedItems.map((item) => [item.id, validateItem(item)]))
  }, [attempted.items, selectedItems])

  /** Содержимое «Проверки данных» */
  const reviewPairs = useMemo(
    () => reviewBlockPairs(selectedBlockList, blockValues, sourceValues),
    [selectedBlockList, blockValues, sourceValues],
  )
  const reviewList = useMemo(() => reviewItems(selectedItems), [selectedItems])
  const reviewIsEmpty = reviewPairs.length === 0 && reviewList.length === 0

  /** Контрагент открытого документа — для текста «Документ подписан!» */
  const detailContractorName =
    CONTRACTORS.find((c) => c.id === detailDocument?.contractorId)?.name ?? 'Контрагент'

  const resultContractorName =
    CONTRACTORS.find((c) => c.id === blockValues.consignee.contractorId)?.name ?? 'Контрагент'

  const showAlert = (type: 'success' | 'error', text: string) =>
    setPageAlert({ type, text, key: Date.now() })

  /** Сброс сценария при новом входе */
  const resetWizard = () => {
    const reset = emptyPrefill()
    setSourceDocId(null)
    setUkdNumber(nextUkdNumber(documents))
    setUkdDate(TODAY)
    setSelectedBlocks(noBlocksSelected())
    setItemsOn(false)
    setSelectedItemIds([])
    setPickerDraft(null)
    setConfirm(null)
    setCreateFailed(false)
    setShowPrevValues(false)
    setBlockValues(reset.blockValues)
    setSourceValues(reset.sourceValues)
    setItems(reset.items)
    setAttempted(noAttempts())
  }

  const handlePickSourceDoc = (docId: string) => {
    const prefill = applySourceDoc(docId)
    setSourceDocId(docId)
    setBlockValues(prefill.blockValues)
    setSourceValues(prefill.sourceValues)
    setItems(prefill.items)
    // Новое основание — прежний выбор к нему не относится
    setSelectedBlocks(noBlocksSelected())
    setItemsOn(false)
    setSelectedItemIds([])
  }

  /** Вход из дровера «Создать документ»: основание ещё не выбрано */
  const handleStartBlank = () => {
    resetWizard()
    setCreateDrawerOpen(false)
    setScreen('document')
  }

  /** Вход из списка или карточки: основание уже подставлено (стикер 4788:107409) */
  const handleStartFromSource = (docId: string) => {
    resetWizard()
    handlePickSourceDoc(docId)
    setCreateDrawerOpen(false)
    setScreen('document')
  }

  const handleToggleBlock = (id: CorrectionBlockId) =>
    setSelectedBlocks((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleItemChange = (id: string, patch: Partial<ItemValues>) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  /**
   * Новая позиция: без GTIN, без подписей «Было», сразу выбрана.
   * Дефолты по узлу 4888:120673 — «шт.» и «Без НДС»
   */
  const handleAddItem = () => {
    const id = `new-${Date.now()}`
    setItems((prev) => [
      ...prev,
      { id, name: '', gtin: '', quantity: '', unitId: 'pcs', price: '', vatId: 'none', origin: null },
    ])
    setSelectedItemIds((prev) => [...prev, id])
  }

  const handleDeleteItem = (id: string) => {
    const nextIds = selectedItemIds.filter((x) => x !== id)
    setSelectedItemIds(nextIds)
    // Добавленная в УКД позиция удаляется совсем, исходная только снимается
    setItems((prev) => prev.filter((item) => item.origin !== null || item.id !== id))
    keepStepVisible({ selectedItemCount: nextIds.length })
  }

  const handleBlockChange = (id: CorrectionBlockId, name: string, value: string) =>
    setBlockValues((prev) => ({ ...prev, [id]: { ...prev[id], [name]: value } }))

  /** Пикер контрагента автозаполняет весь блок целиком */
  const handlePickContractor = (id: CorrectionBlockId, contractor: Contractor) =>
    setBlockValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        contractorId: contractor.id,
        name: contractor.name,
        inn: contractor.inn,
        kpp: contractor.kpp,
        legalAddress: contractor.legalAddress,
        bik: contractor.bik,
        account: contractor.account,
        signer: contractor.signer,
      },
    }))

  /**
   * Удаление секции — стикер 4827:90762: нетронутый блок убираем сразу,
   * с изменениями просим подтверждения
   */
  const handleDeleteBlock = (id: CorrectionBlockId) => {
    if (isDiff(blockValues[id], sourceValues[id])) {
      setConfirm({ kind: 'block', id })
      return
    }
    removeBlock(id)
  }

  /**
   * Снимаем галочку на шаге 1 — она единственный источник правды, поэтому
   * секцию можно вернуть оттуда же. Значения откатываем к основанию
   */
  const removeBlock = (id: CorrectionBlockId) => {
    const nextSelection = { ...selectedBlocks, [id]: false }
    setSelectedBlocks(nextSelection)
    setBlockValues((prev) => ({ ...prev, [id]: structuredClone(sourceValues[id]) }))
    keepStepVisible({
      selectedBlockCount: availableBlockList.filter((b) => nextSelection[b.id]).length,
    })
  }

  /**
   * После удаления текущий шаг может исчезнуть из навигации — тогда
   * переводим вперёд, иначе пользователь остался бы на шаге без записи
   */
  const keepStepVisible = (patch: {
    selectedBlockCount?: number
    itemsOn?: boolean
    selectedItemCount?: number
  }) => {
    const next = visibleSteps({
      selectedBlockCount: patch.selectedBlockCount ?? selectedBlockList.length,
      itemsOn: patch.itemsOn ?? itemsOn,
      selectedItemCount: patch.selectedItemCount ?? selectedItemIds.length,
    })
    if (next.some((s) => s.id === screen)) return
    setScreen(nextStep(next, 'document') ?? 'review')
  }

  /**
   * Тоггл позиций — стикер 4788:109516: включение сразу открывает дровер,
   * выключение с уже выбранными позициями просит подтвердить сброс
   */
  const handleToggleItems = (next: boolean) => {
    if (next) {
      setItemsOn(true)
      setPickerDraft(selectedItemIds)
      return
    }
    if (selectedItemIds.length > 0) {
      setConfirm({ kind: 'items-reset' })
      return
    }
    setItemsOn(false)
  }

  const handleConfirm = () => {
    if (confirm?.kind === 'items-reset') {
      setItemsOn(false)
      setSelectedItemIds([])
      keepStepVisible({ itemsOn: false, selectedItemCount: 0 })
    }
    if (confirm?.kind === 'block') removeBlock(confirm.id)
    setConfirm(null)
  }

  /**
   * Подписание из детализации — узел 5040:12714. Свою подпись поставили,
   * дальше документ ждёт контрагента (узел 5040:12761)
   */
  const handleSign = () => {
    if (!detailDocId) return
    setDocuments((prev) =>
      prev.map((d) => (d.id === detailDocId ? { ...d, status: 'awaiting_counterparty' } : d)),
    )
    setSignedOpen(true)
  }

  const handleApplyPicker = () => {
    const picked = pickerDraft ?? []
    setSelectedItemIds(picked)
    setPickerDraft(null)
    /* Выбор позиций и тоггл — одно и то же решение: применили непустой выбор,
       значит позиции корректируются. Иначе «Выбрано 7 из 7» висело бы при
       выключенном тоггле, а шага позиций не было */
    setItemsOn(picked.length > 0)
  }

  /** Закрытие крестиком не коммитит черновик */
  const handleClosePicker = () => {
    setPickerDraft(null)
    if (selectedItemIds.length === 0) setItemsOn(false)
  }

  /** Строка списка для только что созданного УКД */
  const createdDocument = (createdCount: number): ListDocument => ({
    id: `ukd-${createdCount + 1}`,
    kind: 'ukd',
    direction: 'outgoing',
    title: `УКД №${ukdNumber} от ${ukdDate}`,
    contractorId: blockValues.consignee.contractorId || (sourceDoc?.contractorId ?? ''),
    date: ukdDate,
    amount: formatMoney(totals.total),
    vat: formatMoney(totals.vat),
    // Документ уходит на подпись — под чип «На подпись»
    status: 'awaiting_client',
    sourceDocId,
  })

  const handlePrimary = () => {
    if (step === 'review') {
      // Нет ни одной корректировки — кнопка отменяет создание (узел 4888:138152)
      if (reviewIsEmpty) {
        setCancelledOpen(true)
        return
      }
      // «Ошибка создания» один раз, потом успех — узел 4888:139206
      if (sourceDocId === FAILING_SOURCE_DOC_ID && !createFailed) {
        setCreateFailed(true)
        showAlert('error', REQUEST_ERROR)
        return
      }
      setDocuments((prev) => [createdDocument(prev.length), ...prev])
      setResultOpen(true)
      return
    }

    if (step === 'document') {
      const nothingPicked =
        selectedBlockList.length === 0 && !(itemsOn && selectedItemIds.length > 0)
      setAttempted((prev) => ({ ...prev, document: true }))
      const numberMissing = ukdNumber.trim() === ''
      if (sourceDocId === null || nothingPicked || numberMissing || ukdDateError(ukdDate)) return
    }

    if (step === 'items') {
      setAttempted((prev) => ({ ...prev, items: true }))
      const hasErrors = selectedItems.some((item) => Object.keys(validateItem(item)).length > 0)
      if (hasErrors) return
    }

    if (step === 'blocks') {
      setAttempted((prev) => ({ ...prev, blocks: true }))
      // Считаем на месте: blockErrors мемоизирован по attempted.blocks
      // и на этом же нажатии ещё пуст
      const hasErrors = selectedBlockList.some(
        (block) => Object.keys(validateBlock(block, blockValues[block.id])).length > 0,
      )
      if (hasErrors) return
    }

    const target = nextStep(steps, step)
    if (target) setScreen(target)
  }

  const handleBack = () => {
    const target = prevStep(steps, step)
    setScreen(target ?? 'list')
  }

  return (
    <>
      <MainPageNavigationBar customer={CUSTOMER.name} avatarInitials={CUSTOMER.initials} />

      <PageAlert alert={pageAlert} onHide={() => setPageAlert(null)} />

      {screen === 'list' && (
        <DocumentListScreen
          documents={documents}
          onCreate={() => setCreateDrawerOpen(true)}
          onOpenDocument={(id) => {
            setDetailDocId(id)
            setScreen('detail')
          }}
          onCreateUkd={handleStartFromSource}
          onNotImplemented={() => window.alert(NOT_IMPLEMENTED)}
        />
      )}

      {screen === 'detail' && detailDocument && (
        <DocumentDetailScreen
          document={detailDocument}
          onBack={() => setScreen('list')}
          onSign={handleSign}
          onNotImplemented={() => window.alert(NOT_IMPLEMENTED)}
        />
      )}

      {isWizard && (
        <WizardLayout
          steps={steps}
          step={step}
          primaryLabel={
            step !== 'review' ? 'Продолжить' : reviewIsEmpty ? 'Отменить создание' : 'Создать'
          }
          onPrimary={handlePrimary}
          onBack={handleBack}
          onStepClick={setScreen}
          rightPanel={step === 'items' ? <ItemsTotalsPanel totals={totals} /> : undefined}
        >
          {step === 'document' && (
            <DocumentStep
              sourceDocId={sourceDocId}
              onPickSourceDoc={handlePickSourceDoc}
              ukdNumber={ukdNumber}
              onUkdNumberChange={setUkdNumber}
              ukdDate={ukdDate}
              onUkdDateChange={setUkdDate}
              blocks={availableBlockList}
              sourceValues={sourceValues}
              selectedBlocks={selectedBlocks}
              onToggleBlock={handleToggleBlock}
              itemsOn={itemsOn}
              onToggleItems={handleToggleItems}
              selectedItemCount={selectedItemIds.length}
              sourceItemCount={sourceItems.length}
              onOpenPicker={() => setPickerDraft(selectedItemIds)}
              attempted={attempted.document}
            />
          )}
          {step === 'blocks' && (
            <BlocksStep
              blocks={selectedBlockList}
              blockValues={blockValues}
              sourceValues={sourceValues}
              errors={blockErrors}
              onChange={handleBlockChange}
              onPickContractor={handlePickContractor}
              onDelete={handleDeleteBlock}
              dateAnchor={ukdDate}
            />
          )}
          {step === 'items' && (
            <ItemsStep
              items={selectedItems}
              errors={itemErrors}
              onChange={handleItemChange}
              onDelete={handleDeleteItem}
              onAddItem={handleAddItem}
              onUploadCodes={() => window.alert(NOT_IMPLEMENTED)}
            />
          )}
          {step === 'review' && (
            <ReviewStep
              pairs={reviewPairs}
              items={reviewList}
              isEmpty={reviewIsEmpty}
              onRestart={() => setScreen('document')}
              showPrev={showPrevValues}
              onTogglePrev={setShowPrevValues}
            />
          )}
        </WizardLayout>
      )}

      <CreateDocumentDrawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onCreateUkd={handleStartBlank}
        onNotImplemented={(label) => window.alert(notImplementedFor(label))}
      />

      <ItemPickerDrawer
        draft={pickerDraft}
        items={sourceItems}
        onToggle={(id) =>
          setPickerDraft((prev) =>
            (prev ?? []).includes(id)
              ? (prev ?? []).filter((x) => x !== id)
              : [...(prev ?? []), id],
          )
        }
        onToggleAll={() =>
          setPickerDraft((prev) =>
            (prev ?? []).length === sourceItems.length ? [] : sourceItems.map((i) => i.id),
          )
        }
        onClose={handleClosePicker}
        onApply={handleApplyPicker}
      />

      <ConfirmActionSheet
        copy={confirm ? CONFIRM_COPY[confirm.kind] : null}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <CancelledModal
        isOpen={cancelledOpen}
        onClose={() => {
          setCancelledOpen(false)
          setScreen('list')
        }}
      />

      <SignedModal
        isOpen={signedOpen}
        contractorName={detailContractorName}
        onClose={() => setSignedOpen(false)}
        onAction={() => window.alert(NOT_IMPLEMENTED)}
      />

      <ResultModal
        isOpen={resultOpen}
        contractorName={resultContractorName}
        onClose={() => {
          setResultOpen(false)
          setScreen('list')
        }}
        onSign={() => window.alert(NOT_IMPLEMENTED)}
        onAction={() => window.alert(NOT_IMPLEMENTED)}
      />
    </>
  )
}

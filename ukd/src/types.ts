/* ───── Справочники ──────────────────────────────────────────────────── */

/** Тип документа-основания */
export type SourceDocKind = 'upd' | 'invoice'

/**
 * Статус документа в справочнике «Основание УКД». От него зависят подпись
 * над названием и плитка с глифом — стикер 4827:91380
 */
export type SourceDocStatus =
  | 'signed'
  | 'paid'
  | 'awaiting_payment'
  | 'awaiting_client'
  | 'awaiting_counterparty'
  | 'rejected'
  | 'withdrawn'
  | 'overdue'

export interface Contractor {
  id: string
  /** Форма для полей и сводок: «ООО «СтройИнвест Групп»» */
  name: string
  /** Форма для списков и пикеров: «СтройИнвест Групп», ООО */
  listName: string
  inn: string
  kpp: string
  initials: string
  /** Токен категорийного цвета аватара, например 'var(--category-sand)' */
  color: string
  legalAddress: string
  bik: string
  account: string
  /** Должность и ФИО подписанта — в макете капсом */
  signer: string
}

export interface Unit {
  id: string
  label: string
}

export interface VatRate {
  id: string
  label: string
  /** null — «без НДС» */
  rate: number | null
}

/* ───── Шаги визарда ─────────────────────────────────────────────────── */

/**
 * Два средних шага появляются по выбору на первом — узлы 4827:75269
 * и 4867:34460. Список видимых шагов считает lib/steps.ts
 */
export type StepId = 'document' | 'blocks' | 'items' | 'review'

export interface StepDescriptor {
  id: StepId
  label: string
}

/* ───── Блоки корректировки ──────────────────────────────────────────── */

export type CorrectionBlockId = 'shipment' | 'consignee'

/**
 * Все значения блока — плоская мапа строк. Отсюда валидация и сводка
 * работают одинаково для любого блока.
 */
export type BlockValues = Record<string, string>

export type FieldKind = 'text' | 'date' | 'digits' | 'money' | 'quantity'

export interface FieldSchema {
  /** Ключ в BlockValues */
  name: string
  label: string
  kind: FieldKind
  placeholder?: string
  /** Включает счётчик символов в шапке поля (CounterInput) */
  maxLength?: number
  /** Ровно N цифр: КПП 9, БИК 9, номер счёта 20 */
  digits?: number
  isDisabled?: boolean
  isRequired?: boolean
  /** «Укажите название», «Укажите дату» */
  requiredMessage?: string
  /**
   * Название поля в тексте ошибки о числе цифр и длине: у КПП и БИК
   * аббревиатуру нельзя опускать в нижний регистр (узел 4574:110642)
   */
  errorLabel?: string
  /** Поля со span='half' встают парами в одну строку */
  span?: 'full' | 'half'
  /** Многострочное поле — длинные названия и адреса */
  isMultiline?: boolean
}

/** Какое тело рисуем в секции: по схеме полей или своё */
export type BlockBodyKind = 'schema' | 'party'

export interface CorrectionBlock {
  id: CorrectionBlockId
  /** «Документ об отгрузке» — заголовок и в чеклисте шага 1, и в секции шага 2 */
  title: string
  body: BlockBodyKind
  fields: FieldSchema[]
  /**
   * Блок применим только к этому типу основания. Пусто — к любому.
   * «Документ об отгрузке» относится к УПД: у счёта-фактуры отгрузки нет
   */
  onlyForKind?: SourceDocKind
  /**
   * Значение из документа-основания. Нужно трижды: описание в чеклисте
   * шага 1, подпись «Было: …» в секции шага 2 и пара в «Проверке данных»
   */
  summarize: (values: BlockValues) => string
}

/* ───── Позиции ──────────────────────────────────────────────────────── */

export interface ItemValues {
  name: string
  /** GTIN есть → режим кодов маркировки: название и количество КИЗ заблокированы */
  gtin: string
  quantity: string
  unitId: string
  price: string
  vatId: string
}

export interface LineItem extends ItemValues {
  id: string
  /**
   * Значения из документа-основания — источник пер-полевых подписей «Было: …»
   * (узел 4827:109373). null — позиция добавлена в УКД, подписей нет
   */
  origin: ItemValues | null
}

/* ───── Документ-основание ───────────────────────────────────────────── */

export interface SourceDoc {
  id: string
  kind: SourceDocKind
  /** «УПД №1 от 01.01.2027» */
  title: string
  status: SourceDocStatus
  contractorId: string
  /** Что подставляем в блоки при выборе этого документа-основания */
  prefill: Partial<Record<CorrectionBlockId, BlockValues>>
  items: ItemValues[]
}

/* ───── Экран списка и карточки документа (точки входа) ──────────────── */

export type ListDocStatus =
  | 'signed'
  | 'awaiting_client'
  | 'annulment_in_progress'
  | 'withdrawn'
  | 'rejected'
  | 'annulled'

export type DocDirection = 'outgoing' | 'incoming'

export interface ListDocument {
  id: string
  kind: SourceDocKind
  direction: DocDirection
  /** «УПД №1 от 01.01.2027» */
  title: string
  contractorId: string
  date: string
  amount: string
  vat: string
  status: ListDocStatus
  /** Связанный документ-основание для действия «Оформить УКД» */
  sourceDocId: string | null
}

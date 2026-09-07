import { CONTRACTORS } from './data'
import { formatLongDate } from './lib/format'
import type { BlockValues, CorrectionBlock, FieldSchema, SourceDocKind } from './types'

/* ───── Сводки значений из документа-основания ────────────────────────
   Каждая используется трижды: описание в чеклисте «Что изменилось»
   (узел 4788:107434), подпись «Было: …» в секции шага 2 (узел 4827:88387)
   и пара в «Проверке данных» (узел 4888:136205) */

/** «Документ №1 от 01 января 2027». Если реквизитов нет — пустая строка */
function documentSummary(values: BlockValues): string {
  const num = (values.num ?? '').trim()
  const date = (values.date ?? '').trim()
  if (!num && !date) return ''
  if (!date) return `Документ №${num}`
  if (!num) return `Документ от ${formatLongDate(date)}`
  return `Документ №${num} от ${formatLongDate(date)}`
}

/**
 * «СтройИнвест Групп, ООО» — в макете у грузополучателя списочная форма
 * названия без ИНН (узлы 4788:107434 и 4827:88387)
 */
function partyListSummary(values: BlockValues): string {
  const contractor = CONTRACTORS.find((c) => c.id === values.contractorId)
  if (contractor) return contractor.listName
  return (values.name ?? '').trim()
}

/* ───── Переиспользуемые поля ────────────────────────────────────────── */

/* «Номер» и «Дата» стоят парой в одну строку: секция шага 2 идёт в колонке
   720, а не в дровере 480 (узел 4827:88391) */
const NUM_FIELD: FieldSchema = {
  name: 'num',
  label: 'Номер',
  kind: 'text',
  placeholder: '№',
  span: 'half',
  isRequired: true,
  requiredMessage: 'Укажите номер',
}

const DATE_FIELD: FieldSchema = {
  name: 'date',
  label: 'Дата',
  kind: 'date',
  placeholder: 'дд.мм.гггг',
  span: 'half',
  isRequired: true,
  requiredMessage: 'Укажите дату',
}

/** Название документа — 255 символов со счётчиком, узел 4574:104904 */
const DOC_NAME_FIELD: FieldSchema = {
  name: 'name',
  label: 'Название',
  kind: 'text',
  placeholder: 'Название документа',
  maxLength: 255,
  span: 'full',
  isMultiline: true,
  isRequired: true,
  requiredMessage: 'Укажите название',
}

/** Пикер контрагента: значение подставляется из справочника целиком */
const PARTY_PICKER_FIELD: FieldSchema = {
  name: 'name',
  label: 'Данные контрагента',
  kind: 'text',
  placeholder: 'Название или ИНН',
  span: 'full',
  isRequired: true,
  requiredMessage: 'Укажите данные контрагента',
}

/** ИНН приходит вместе с контрагентом и не редактируется — узел 4827:88396 */
const INN_FIELD: FieldSchema = {
  name: 'inn',
  label: 'ИНН',
  kind: 'digits',
  placeholder: '0000 0000 00',
  span: 'full',
  isDisabled: true,
}

const KPP_FIELD: FieldSchema = {
  name: 'kpp',
  label: 'КПП',
  errorLabel: 'КПП',
  kind: 'digits',
  placeholder: '000 000 000',
  digits: 9,
  span: 'full',
  isRequired: true,
  requiredMessage: 'Укажите КПП',
}

const LEGAL_ADDRESS_FIELD: FieldSchema = {
  name: 'legalAddress',
  label: 'Юридический адрес',
  kind: 'text',
  placeholder: 'Адрес с индексом',
  maxLength: 1000,
  span: 'full',
  isMultiline: true,
  isRequired: true,
  requiredMessage: 'Укажите юридический адрес',
}

const BIK_FIELD: FieldSchema = {
  name: 'bik',
  label: 'БИК банка',
  errorLabel: 'БИК банка',
  kind: 'digits',
  placeholder: '000 000 000',
  digits: 9,
  span: 'full',
  isRequired: true,
  requiredMessage: 'Укажите БИК банка',
}

const ACCOUNT_FIELD: FieldSchema = {
  name: 'account',
  label: 'Номер счёта',
  kind: 'digits',
  placeholder: '0000 0000 0000 0000 0000',
  digits: 20,
  span: 'full',
  isRequired: true,
  requiredMessage: 'Укажите номер счёта',
}

const SIGNER_FIELD: FieldSchema = {
  name: 'signer',
  label: 'Должность и ФИО подписанта',
  kind: 'text',
  placeholder: 'Должность и ФИО',
  maxLength: 120,
  span: 'full',
  isMultiline: true,
  isRequired: true,
  requiredMessage: 'Укажите должность и ФИО подписанта',
}

/* ───── Реестр блоков корректировки ──────────────────────────────────
   Ровно два блока — узел 4827:88387. Порядок совпадает с макетом */

export const CORRECTION_BLOCKS: CorrectionBlock[] = [
  {
    // Только для основания-счёта-фактуры: сам УПД и есть документ об
    // отгрузке, корректировать его отдельным пунктом внутри УКД нечего
    id: 'shipment',
    title: 'Документ об отгрузке',
    body: 'schema',
    fields: [DOC_NAME_FIELD, NUM_FIELD, DATE_FIELD],
    onlyForKind: 'invoice',
    summarize: documentSummary,
  },
  {
    // В макете у грузополучателя полный набор реквизитов, а не только адрес
    // доставки, как было в прошлой версии сценария (узел 4827:88396)
    id: 'consignee',
    title: 'Грузополучатель',
    body: 'party',
    fields: [
      PARTY_PICKER_FIELD,
      INN_FIELD,
      KPP_FIELD,
      LEGAL_ADDRESS_FIELD,
      BIK_FIELD,
      ACCOUNT_FIELD,
      SIGNER_FIELD,
    ],
    summarize: partyListSummary,
  },
]

/**
 * Блоки, применимые к выбранному основанию. Пока основание не выбрано,
 * чеклист всё равно скрыт, поэтому вариант null не важен
 */
export function availableBlocks(kind: SourceDocKind | null): CorrectionBlock[] {
  return CORRECTION_BLOCKS.filter((b) => !b.onlyForKind || b.onlyForKind === kind)
}

export const BLOCK_BY_ID = Object.fromEntries(
  CORRECTION_BLOCKS.map((b) => [b.id, b]),
) as Record<CorrectionBlock['id'], CorrectionBlock>

export const BLOCK_IDS = CORRECTION_BLOCKS.map((b) => b.id)

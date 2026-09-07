import docCanceled from './assets/logos/doc-canceled.png'
import docExpired from './assets/logos/doc-expired.png'
import docForPayment from './assets/logos/doc-for-payment.png'
import docForSignature from './assets/logos/doc-for-signature.png'
import docPaid from './assets/logos/doc-paid.png'
import docWaiting from './assets/logos/doc-waiting.png'
import type {
  BlockValues,
  Contractor,
  CorrectionBlockId,
  ItemValues,
  SourceDoc,
  SourceDocStatus,
  Unit,
  VatRate,
} from './types'

export const CUSTOMER = { name: 'Носковец О.Н., ИП', initials: 'НО' }

/** Дата в фикстуре, а не new Date(): демо и скриншоты должны быть стабильны */
export const TODAY = '01.01.2027'

export const CONTRACTORS: Contractor[] = [
  {
    id: 'stroyinvest',
    name: 'ООО «СтройИнвест Групп»',
    listName: '«СтройИнвест Групп», ООО',
    inn: '7725 4839 10',
    kpp: '772 501 001',
    initials: 'СИ',
    color: 'var(--category-orchid)',
    legalAddress: '196210, Г.САНКТ-ПЕТЕРБУРГ, УЛ. СТАРТОВАЯ, Д. 8, ЛИТЕР А, ОФИС 132',
    bik: '044 525 104',
    account: '40701 97800 54321 67891',
    signer: 'ГЕНЕРАЛЬНЫЙ ДИРЕКТОР МАДАНИ ФАРИД',
  },
  {
    id: 'mehanika',
    name: 'ООО «Механика-Урала»',
    listName: 'МЕХАНИКА-УРАЛА, ООО',
    inn: '6670 1139 47',
    kpp: '667 001 001',
    initials: 'МУ',
    color: 'var(--category-mint)',
    legalAddress: '620014, Г.ЕКАТЕРИНБУРГ, УЛ. МАЛЫШЕВА, Д. 51, ОФИС 24/07',
    bik: '046 577 674',
    account: '40702 81000 16000 12345',
    signer: 'ДИРЕКТОР СОКОЛОВ ИГОРЬ ПЕТРОВИЧ',
  },
  {
    id: 'iskra',
    name: 'ООО «Студия Искра»',
    listName: 'Студия ИСКРА, ООО',
    inn: '7736 2074 05',
    kpp: '773 601 001',
    initials: 'СИ',
    color: 'var(--category-lavender)',
    legalAddress: '119180, Г.МОСКВА, УЛ. БОЛЬШАЯ ЯКИМАНКА, Д. 26, ЭТ. 3, ПОМ. 12',
    bik: '044 525 225',
    account: '40702 81020 20000 45678',
    signer: 'ГЕНЕРАЛЬНЫЙ ДИРЕКТОР ИВАНОВА АННА СЕРГЕЕВНА',
  },
  {
    id: 'smolin',
    name: 'ИП Смолин А.О.',
    listName: 'Смолин А.О., ИП',
    inn: '6670 1156 11',
    kpp: '667 001 002',
    initials: 'СА',
    color: 'var(--category-sand)',
    legalAddress: '620109, Г.ЕКАТЕРИНБУРГ, УЛ. КРАУЛЯ, Д. 44, КВ. 87',
    bik: '046 577 674',
    account: '40802 81000 33000 98765',
    signer: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ СМОЛИН АРТЁМ ОЛЕГОВИЧ',
  },
  {
    id: 'varaksin',
    name: 'ИП Вараксин А.О.',
    listName: 'Вараксин А.О., ИП',
    inn: '4320 4657 0098',
    kpp: '732 401 001',
    initials: 'ВА',
    color: 'var(--category-emerald)',
    legalAddress: '432017, Г.УЛЬЯНОВСК, УЛ. ГОНЧАРОВА, Д. 12, КВ. 5',
    bik: '047 308 602',
    account: '40802 81040 55000 11223',
    signer: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ВАРАКСИН АРТЁМ ОЛЕГОВИЧ',
  },
  {
    id: 'kashin',
    name: 'ИП Кашин А.О.',
    listName: 'Кашин А.О., ИП',
    inn: '6670 1139 90',
    kpp: '667 001 003',
    initials: 'КА',
    color: 'var(--category-sky)',
    legalAddress: '620100, Г.ЕКАТЕРИНБУРГ, УЛ. ТКАЧЕЙ, Д. 23, КВ. 140',
    bik: '046 577 674',
    account: '40802 81000 77000 33445',
    signer: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ КАШИН АЛЕКСЕЙ ОЛЕГОВИЧ',
  },
]

export const UNITS: Unit[] = [
  { id: 'm2', label: 'м²' },
  { id: 'm3', label: 'м³' },
  { id: 'm', label: 'м' },
  { id: 'pcs', label: 'шт.' },
  { id: 'set', label: 'компл.' },
  { id: 'node', label: 'узел' },
  { id: 'section', label: 'секция' },
  { id: 'floor', label: 'этаж' },
  { id: 'room', label: 'помещение' },
  { id: 'object', label: 'объект' },
  { id: 'plot', label: 'участок' },
  { id: 'grip', label: 'захватка' },
  { id: 'trip', label: 'рейс' },
  { id: 'shift', label: 'смена' },
  { id: 'machine-hour', label: 'маш.-ч' },
  { id: 'man-hour', label: 'чел.-ч' },
  { id: 'man-day', label: 'чел.-дн.' },
  { id: 'ton', label: 'т' },
  { id: 'kg', label: 'кг' },
  { id: 'g', label: 'г' },
  { id: 'l', label: 'л' },
  { id: 'ml', label: 'мл' },
  { id: 'ha', label: 'га' },
  { id: 'are', label: 'сотка' },
  { id: 'km', label: 'км' },
  { id: 'cm', label: 'см' },
  { id: 'mm', label: 'мм' },
  { id: 'pair', label: 'пара' },
  { id: 'pack', label: 'упаковка' },
  { id: 'roll', label: 'рулон' },
  { id: 'sheet', label: 'лист' },
  { id: 'bag', label: 'мешок' },
  { id: 'pallet', label: 'палета' },
  { id: 'coil', label: 'бухта' },
  { id: 'reel', label: 'катушка' },
  { id: 'block', label: 'блок' },
  { id: 'slab', label: 'плита' },
  { id: 'panel', label: 'панель' },
  { id: 'column', label: 'колонна' },
  { id: 'beam', label: 'балка' },
  { id: 'window', label: 'окно' },
  { id: 'door', label: 'дверь' },
  { id: 'point', label: 'точка' },
  { id: 'device', label: 'прибор' },
  { id: 'unit', label: 'устройство' },
]

export const VAT_RATES: VatRate[] = [
  { id: 'none', label: 'Без НДС', rate: null },
  { id: 'vat0', label: '0%', rate: 0 },
  { id: 'vat5', label: '5%', rate: 5 },
  { id: 'vat7', label: '7%', rate: 7 },
  { id: 'vat10', label: '10%', rate: 10 },
  { id: 'vat20', label: '20%', rate: 20 },
  { id: 'vat22', label: '22%', rate: 22 },
]

/* ───── Позиции документов-оснований ────────────────────────────────── */

const UPD_ITEMS: ItemValues[] = [
  {
    name: '«ФрутоНяня» нектар из банана, яблока, вишни и малины',
    gtin: '4600109001373',
    quantity: '300',
    unitId: 'pcs',
    price: '75',
    vatId: 'vat22',
  },
  {
    name: '«Простоквашино» молоко пастеризованное 3,2%, 930 мл',
    gtin: '4600315012246',
    quantity: '1200',
    unitId: 'pcs',
    price: '72',
    vatId: 'vat22',
  },
  {
    name: '«Домик в деревне» сливки 10%, 480 мл',
    gtin: '4600227041181',
    quantity: '480',
    unitId: 'pcs',
    price: '90',
    vatId: 'vat22',
  },
  {
    name: '«Агуша» творог детский 4,5%, 100 г',
    gtin: '4600512009360',
    quantity: '2400',
    unitId: 'pcs',
    price: '26',
    vatId: 'vat22',
  },
  // Без кодов маркировки: название и количество остаются редактируемыми
  {
    name: '«Мистраль» рис басмати, 900 г',
    gtin: '',
    quantity: '600',
    unitId: 'pcs',
    price: '198',
    vatId: 'vat22',
  },
  {
    name: '«Балтимор» кетчуп томатный, 260 г',
    gtin: '',
    quantity: '900',
    unitId: 'pcs',
    price: '60',
    vatId: 'vat22',
  },
  {
    name: '«Юбилейное» печенье молочное, 112 г',
    gtin: '4600266018427',
    quantity: '1500',
    unitId: 'pcs',
    price: '25',
    vatId: 'vat22',
  },
]

const ITEM_SERVICE: ItemValues = {
  name: 'Монтаж торгового оборудования по договору №32',
  gtin: '',
  quantity: '1',
  unitId: 'pcs',
  price: '120000',
  vatId: 'vat22',
}

/* ───── Документы-основания ──────────────────────────────────────────── */

/** Значения блоков по умолчанию — пустой УКД без документа-основания */
export const DEFAULT_VALUES: Record<CorrectionBlockId, BlockValues> = {
  shipment: { name: '', num: '', date: '' },
  consignee: {
    contractorId: '',
    name: '',
    inn: '',
    kpp: '',
    legalAddress: '',
    bik: '',
    account: '',
    signer: '',
  },
  // В макете счёт по умолчанию выбран ещё до выбора документа-основания
}

/** Блок «Контрагент» целиком из записи справочника */
function contractorValues(id: string): BlockValues {
  const c = CONTRACTORS.find((x) => x.id === id)!
  return {
    contractorId: c.id,
    name: c.name,
    inn: c.inn,
    kpp: c.kpp,
    legalAddress: c.legalAddress,
    bik: c.bik,
    account: c.account,
    signer: c.signer,
  }
}

export const SOURCE_DOCS: SourceDoc[] = [
  {
    id: 'upd-1',
    kind: 'upd',
    status: 'signed',
    title: 'УПД №1 от 01.01.2027',
    contractorId: 'stroyinvest',
    prefill: {
      shipment: { name: 'Универсальный передаточный документ', num: '1', date: '01.01.2027' },
      consignee: contractorValues('stroyinvest'),
    },
    items: UPD_ITEMS,
  },
  {
    id: 'upd-2',
    kind: 'upd',
    status: 'awaiting_counterparty',
    title: 'УПД №2 от 15.01.2027',
    contractorId: 'iskra',
    prefill: {
      shipment: { name: 'Универсальный передаточный документ', num: '2', date: '15.01.2027' },
      consignee: contractorValues('iskra'),
    },
    items: [ITEM_SERVICE],
  },
  {
    id: 'sf-1',
    kind: 'invoice',
    status: 'awaiting_payment',
    title: 'Счёт-фактура №1 от 01.01.2027',
    contractorId: 'mehanika',
    prefill: {
      consignee: contractorValues('mehanika'),
    },
    items: UPD_ITEMS,
  },
  {
    id: 'sf-2',
    kind: 'invoice',
    status: 'rejected',
    title: 'Счёт-фактура №2 от 01.01.2027',
    contractorId: 'smolin',
    prefill: {
      consignee: contractorValues('smolin'),
    },
    items: [ITEM_SERVICE],
  },
  {
    id: 'sf-3',
    kind: 'invoice',
    status: 'awaiting_client',
    title: 'Счёт-фактура №3 от 01.01.2027',
    contractorId: 'iskra',
    prefill: {
      consignee: contractorValues('iskra'),
    },
    items: UPD_ITEMS.slice(0, 3),
  },
]

/**
 * Сохранение дровера для этого документа-основания один раз падает —
 * так показываем «Ошибку запроса» (узел 4580:138070)
 */
export const FAILING_SOURCE_DOC_ID = 'sf-3'

export const REQUEST_ERROR = 'Что-то не так… Попробуйте ещё раз.'

/**
 * Подпись и логотип статуса в справочнике «Основание УКД» — стикер 4827:91380.
 * Логотипы готовые, из ~/Documents/Claude/Логотипы: в них уже зашита и
 * цветная подложка, и глиф со статусным акцентом.
 * Стикер разделяет «Счет» и остальные типы, но каждый статус и так встречается
 * только у своего типа, поэтому ключом достаточно статуса.
 */
export const DOC_STATUS: Record<SourceDocStatus, { label: string; logo: string }> = {
  signed: { label: 'Подписано', logo: docPaid },
  paid: { label: 'Оплачено', logo: docPaid },
  awaiting_payment: { label: 'Ждёт оплаты', logo: docForPayment },
  awaiting_client: { label: 'Ждёт подписи', logo: docForSignature },
  // В макете здесь документ без акцента, в библиотеке серый вариант — с часами
  awaiting_counterparty: { label: 'Ждёт подписи контрагента', logo: docWaiting },
  rejected: { label: 'Отклонено контрагентом', logo: docCanceled },
  withdrawn: { label: 'Отозвано вами', logo: docCanceled },
  overdue: { label: 'Просрочено', logo: docExpired },
}

/** Заглушка для действий, которых нет в прототипе */
export const NOT_IMPLEMENTED = 'Раздел не реализован в прототипе.'

/**
 * Заглушка с названием. «Универсальный передаточный документ» и
 * «Универсальный корректировочный документ» стоят рядом и читаются почти
 * одинаково, поэтому сообщение называет, во что попал клик, и подсказывает,
 * что в прототипе живёт только УКД.
 */
export function notImplementedFor(label: string): string {
  return `«${label}» не реализован в прототипе. Здесь доступен только «УКД».`
}

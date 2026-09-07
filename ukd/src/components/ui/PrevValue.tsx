/**
 * Пер-полевая подпись «Было: 300» под полем позиции — узел 4827:109373.
 * Через Input.description нельзя: он подменяется errorMessage при isError,
 * и подпись пропадала бы ровно при валидации.
 */
export function PrevValue({ value }: { value: string }) {
  if (!value) return null
  return <p className="ts-400-s ukd-prev">Было: {value}</p>
}

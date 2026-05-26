import type { Character } from '../types/character'

export function downloadCsv(items: Character[]): void {
  const header = 'id,name,description,image,details_url'
  const rows = items.map((item) =>
    [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.image.replace(/"/g, '""')}"`,
      `"https://rickandmortyapi.com/api/character/${item.id}"`,
    ].join(',')
  )
  const csv = [header, ...rows].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${items.length}_items.csv`
  link.click()
  URL.revokeObjectURL(url)
}

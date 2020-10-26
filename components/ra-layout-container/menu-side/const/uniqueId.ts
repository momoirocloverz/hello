export default function uniqueId(item: any) {
  return encodeURIComponent(item.title).replace(/%/gi, '')
}
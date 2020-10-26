const commonFilter = (arr: element.Options[], val: string | number) => {
  let tmp = arr.find(e => {
    return String(val) === String(e.value)
  })
  return !tmp ? '' : tmp.label
}

export const tagsType: element.Options[] = [
  { label: '销量标签', value: 'MARKETING_TAG' },
  { label: '性能标签', value: 'PERFORMANCE_TAG' }
]
export const tagsFilter: any = (type: string | number) => commonFilter(tagsType, type)

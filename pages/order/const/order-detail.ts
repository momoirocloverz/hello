const fileterFn = (status: number | string, list: element.Options[]) => {
  const item: any = list.find(e => String(e.value) === String(status))
  return item ? item.label : '-'
}
export const orderDetailStatus: element.Options[] = [
  // 商品单状态（0-正常,1-核销中,2-已核销,3-退款中,4-退款完成,5-退款退货中,6-退款退货完成,7-换货中,8-换货完成）
  { label: '正常', value: 0 },
  { label: '核销中', value: 1 },
  { label: '已核销', value: 2 },
  { label: '退款中', value: 3 },
  { label: '退款完成', value: 4 },
  { label: '退款退货中', value: 5 },
  { label: '退款退货完成', value: 6 },
  { label: '换货中', value: 7 },
  { label: '换货完成', value: 8 }
]
export const orderDetailStatusFilter = (status: string | number) => {
  return fileterFn(status, orderDetailStatus)
}
export const remarks: element.Options[] = [
  // 0-买家备注，1-卖家备注，2-取消原因
  { label: '买家', value: 0 },
  { label: '管理员', value: 1 },
  { label: '取消原因', value: 2 },
]
export const remarksFilter = (status: string | number) => {
  return fileterFn(status, remarks)
}
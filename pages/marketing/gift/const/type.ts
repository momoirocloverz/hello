export const COUPON_TYPE: any = [
  {
    label: '现金券',
    value: 'CASH',
    index: 0
  },
  {
    label: '折扣劵',
    value: 'DISCOUNT',
    index: 1
  }
]

export const COUPON_RULE: any = [
  {
    label: '活动发放',
    value: 'CAMPAIGN',
    index: 0
  },
  {
    label: '主动领取',
    value: 'INDIVIDUAL',
    index: 1
  }
]

export const COUPON_GOODS_SCOPE: any = [
  {
    label: '全场通用',
    value: 'UNIVERSAL',
    index: 0
  },
  {
    label: '指定商品',
    value: 'SPECIFIED',
    index: 1
  }
]

export const COUPON_GOODS_TYPE: any = [
  {
    label: '商品（在线抵扣）',
    value: 'ORDINARY_GOODS',
    index: 1
  },
  {
    label: '车型（线下核销）',
    value: 'MODEL_GOODS',
    index: 0
  }
]

export const COUPON_STATUS: any = [
  {
    label: '未使用',
    value: 'NOT_ALLOW'
  },
  {
    label: '可使用',
    value: 'ALLOW'
  },
  {
    label: '已停用', // 需要判断enabled为0
    value: 'NULL'
  },
  {
    label: '已过期',
    value: 'EXPIRE'
  }
]

export const PRIZE_STATUS: any = [
  {
    label: '可使用',
    value: 1
  },
  {
    label: '已停用',
    value: 0
  }
]


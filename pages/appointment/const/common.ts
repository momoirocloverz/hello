// 在线预订-使用状态
const orderStatus: element.Options[] = [
  {
    label: "待付款",
    value: "WAITING_PAYMENT"
  },
  {
    label: "待使用",
    value: "UNUSED"
  },
  {
    label: "已完成",
    value: "COMPLETED"
  },
  {
    label: "已关闭",
    value: "CLOSED"
  }
]
// 在线预订-售后状态
const saleStatus: element.Options[] = [
  {
    label: "待处理",
    value: 0
  },
  {
    label: "待入账",
    value: 1
  },
  {
    label: "退款失败",
    value: 2
  },
  {
    label: "退款成功",
    value: 3
  },
  {
    label: "已撤销",
    value: 4
  },
  {
    label: "拒绝退款",
    value: 6
  }
]
const afterSale: any[] = ["待处理", "待入账", "退款失败", "退款成功", "已撤销", "确认换货", "拒绝退款"]
// 退款dialog内容
const refundInfo: Object = {
  customerName: {
    name: "客户姓名",
    val: ""
  },
  customerPhone: {
    name: "客户手机号",
    val: ""
  },
  modelForCollectionsOutput: {
    name: "预订车型",
    val: null
  },
  expectAt: {
    name: "期望提车时间",
    val: null
  },
  price: {
    name: "订金",
    val: null
  },
  createdTime: {
    name: "提交时间",
    val: ""
  }
}

// 核销dialog内容
const depositInfo: Object = {
  receiver: {
    name: "客户姓名",
    val: ""
  },
  phone: {
    name: "客户手机号",
    val: ""
  },
  skuName: {
    name: "预订车型",
    val: null
  },
  expectAtStr: {
    name: "期望提车时间",
    val: null
  },
  skuPrice: {
    name: "订金",
    val: null
  },
  createdTime: {
    name: "提交时间",
    val: ""
  }
}

export {
  orderStatus,
  saleStatus,
  refundInfo,
  depositInfo,
  afterSale
}
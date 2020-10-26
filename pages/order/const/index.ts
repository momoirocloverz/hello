import dayjs from "dayjs";
export const shopOrderStatusList: element.Options[] = [
  // 订单状态列表(10-待付款，20-待使用，23-待发货，25-待收货,30-待评价，40-已完成，45-已关闭)
  { label: "待付款", value: '10' },
  { label: "待使用", value: '20' },
  { label: "待评价", value: '30' },
  { label: "已完成", value: '40' },
  { label: "已关闭", value: '45' },
];
export const mailOrderStatusList: element.Options[] = [
  // 订单状态列表(10-待付款，20-待使用，23-待发货，25-待收货,30-待评价，40-已完成，45-已关闭)
  { label: "待付款", value: '10' },
  { label: "待发货", value: '23' },
  { label: "待收货", value: '25' },
  { label: "待评价", value: '30' },
  { label: "已完成", value: '40' },
  { label: "已关闭", value: '45' },
];
export const orderStatusFilter = (status: string | number) => {
  const item: any = [...mailOrderStatusList, ...shopOrderStatusList]
    .find(e => String(e.value) === String(status))
  return item ? item.label : '-'
}
export const agentOrderColumns = [
  {
    prop: "orderNo",
    label: "订单编号",
    col: {
      width: '150px'
    }
  },
  {
    prop: "userName",
    label: "客户姓名"
  },
  {
    prop: "phone",
    label: "客户手机号"
  },
  {
    prop: "orderTotalAmount",
    label: "订单金额(元)"
  },
  {
    prop: "name",
    label: "订单状态",
    render: (h: any, row: any) => h('div', [
      h('span', {
        class: (row => {
          return ['10', '20', '25', '30'].indexOf(row.status) > -1
            ? 'dot dot1'
            : row.status === '23'
              ? 'dot dot3'
              : 'dot dot5'
        })(row)
      }),
      h('span', (row => {
        return orderStatusFilter(row.status)
      })(row)
      )
    ])
  },
  {
    prop: "name",
    label: "创建时间",
    formatter: (row: any) => row.createdTime ? dayjs(row.createdTime).format("YYYY-MM-DD HH:mm") : '-'
  },
];
export const factoryOrderColumns = [
  {
    prop: "dealerIntroDto",
    label: "经销商",
    show: (row: any) => false,
    formatter: (row: any) => row.dealerIntroDto ? (row.dealerIntroDto.dealerName || '-') : '-'
  },
  ...agentOrderColumns
];
// 邮寄订单的单号点击事件
export function expressNoClick(onClick: Function) {
  return {
    render: (h: any, row: any) => {
      const { orderDeliveryOutput } = row
      let expressNumber = null;
      orderDeliveryOutput && ({ expressNumber } = orderDeliveryOutput);
      return (orderDeliveryOutput && expressNumber)
        ? h('div', {
          class: 'el-link el-link--primary',
          on: {
            click: () => onClick(row)
          }
        }, [
          h('span', { class: 'el-link--inner fz12' },
            row.orderDeliveryOutput.expressNumber)
        ])
        : h('div', "-")
    }
  }
}
export const postsaleTableColumns = [
  {
    prop: "msgContent",
    label: "订单编号"
  },
  {
    prop: "name",
    label: "客户姓名"
  },
  {
    prop: "name",
    label: "客户手机号"
  },
  {
    prop: "msgContent",
    label: "购买商品"
  },
  {
    prop: "name",
    label: "订单金额(元)"
  },
  {
    prop: "name",
    label: "处理状态"
  },
  {
    prop: "msgContent",
    label: "处理意见"
  },
  {
    prop: "name",
    label: "退款状态"
  },
  {
    prop: "name",
    label: "提交时间",
    formatter: (row: any) => row.createAt ? dayjs(row.createAt).format("YYYY-MM-DD HH:mm") : '-'
  },
]
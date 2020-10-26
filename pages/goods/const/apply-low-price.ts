import dayjs from "dayjs";
const BigNumber = require('bignumber.js');

export const statusList: element.Options[] = [
  { label: '待审批', value: 0 },
  { label: '审批通过', value: 1 },
  { label: '审批驳回', value: 2 }
];

export const listColumn = [
  {
    prop: "dealerCode",
    col: {
      width: '80px'
    },
    label: "经销商代码"
  },
  {
    prop: "dealerName",
    label: "经销商名称"
  },
  {
    prop: "modelName",
    col: {
      width: '180px'
    },
    label: "申请车型",
    formatter: (row: any) => row.seriesName + ' — ' + row.modelName
  },
  {
    prop: "maxDiscount",
    label: "申请优惠金额(万元)",
    formatter: (row: any) => BigNumber(row.maxDiscount).dividedBy(10000)
  },
  {
    prop: "maxCompanyDiscountPrice",
    label: "最高优惠金额(万元)",
    formatter: (row: any) => row.maxCompanyDiscountPrice
      ? BigNumber(row.maxCompanyDiscountPrice).dividedBy(10000)
      : "—"
  },
  {
    prop: "maxCompanyDiscountPercentage",
    label: "最高优惠百分比",
    formatter: (row: any) => row.maxCompanyDiscountPercentage
      ? `${BigNumber(row.maxCompanyDiscountPercentage).multipliedBy(100)} %`
      : "—"
  },
  {
    prop: "reason",
    label: "申请原因"
  },
  {
    prop: "msgContent",
    col: {
      width: '130px'
    },
    label: "申请时间",
    formatter: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm')
  },
  {
    prop: "msgContent",
    label: "审批状态",
    render: (h: any, row: any) => h('div', [
      h('span', {
        class: (row => {
          return row.status === 1
            ? 'dot dot2'
            : row.status === 2
              ? 'dot dot4'
              : 'dot dot5'
        })(row)
      }),
      h('span', (row => {
        let res = statusList.find(e => e.value === row.status)
        return res && res.label
      })(row)
      )
    ])
  },
];
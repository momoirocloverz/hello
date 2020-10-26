import dayjs from "dayjs";
const BigNumber = require('bignumber.js');
export const factoryListColumn = [
  {
    prop: "name",
    label: "车型名称"
  },
  {
    prop: "guidePrice",
    label: "厂家指导价(万元)",
    formatter: (row: any) => {
      return row.guidePrice ? (BigNumber(row.guidePrice).dividedBy(10000)) : "—"
    }
  },
  // {
  //   prop: "listingDate",
  //   label: "上市日期",
  //   formatter: (row: any) => row.listingDate ? dayjs(row.listingDate).format('YYYY-MM-DD') : "—"
  // },
];
export const agentListColumn = [
  ...factoryListColumn,
  {
    prop: "salesPrice",
    label: "优惠报价(万元)",
    formatter: (row: any) => row.salesPrice ? (BigNumber(row.salesPrice).dividedBy(10000)) : "—"
  },
  // {
  //   prop: "updatedTime",
  //   label: "更新时间",
  //   formatter: (row: any) => row.updatedTime
  //     ? dayjs(row.updatedTime).format('YYYY-MM-DD')
  //     : dayjs(row.createdTime).format('YYYY-MM-DD')
  // }
]

export const statusList: any = {
  NOT_RELEASE: {
    txt: '已下架',
    todo: "上架"
  },
  0: {
    txt: '已下架',
    todo: "上架"
  },
  RELEASE: {
    txt: '已上架',
    todo: "下架"
  },
  1: {
    txt: '已上架',
    todo: "下架"
  },
  DISCONTINUE: {
    txt: '已下架',
    todo: "上架"
  },
  2: {
    txt: '已下架',
    todo: "上架"
  }
}

export const dealerStatusList: any = {
  RELEASE: {
    txt: '已上架',
    todo: "下架"
  },
  0: {
    txt: '已上架',
    todo: "下架"
  },
  DISCONTINUE: {
    txt: '已下架',
    todo: "上架"
  },
  1: {
    txt: '已下架',
    todo: "上架"
  }
};

export const depositValidator = (rule: any, value: any, cb: any) => {
  const v = Number(value)
  if (v < 0.01 || v > 20000) {
    return cb(new Error('请输入大于0，小于20,000范围内的金额，支持输入2位小数'))
  } else {
    cb()
  }
}
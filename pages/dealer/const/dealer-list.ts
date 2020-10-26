export const columns = [
         {
           col: {
             fixed: "left"
           },
           prop: "dealerCode",
           key: "dealerCode",
           label: "经销商代码"
         },
         {
           col: {
             fixed: "left"
           },
           prop: "dealerName",
           key: "dealerName",
           label: "经销商名称"
         },
         {
           prop: "dealerShortName",
           key: "dealerShortName",
           label: "经销商简称"
         },
         {
           prop: "buName",
           key: "buName",
           label: "事业部"
         },
         {
           prop: "regionName",
           key: "regionName",
           label: "大区"
         },
         // {
         //   prop: "contactNumber",
         //   key: "contactNumber",
         //   label: "联系电话"
         // },
         // {
         //   prop: "area",
         //   key: "area",
         //   label: "所在城市"
         // },
         // {
         //   prop: "osStatus",
         //   key: "osStatus",
         //   label: "营业状态",
         //   formatter: (row: any) => (row.osStatus === "0" ? "营业" : "未营业")
         // },
         {
           prop: "dealerAccount",
           key: "dealerAccount",
           label: "经销商账号"
         },
         {
           prop: "principal",
           key: "principal",
           label: "负责人"
         },
         {
           col: {
             width: "100px"
           },
           prop: "principalMobile",
           key: "principalMobile",
           label: "负责人手机号"
         },
         {
           prop: "isBindPnum",
           key: "isBindPnum",
           label: "是否绑定公众号",
           formatter: (row: any) => (row.isBindPnum ? row.dealerPublic : "未绑定")
         },
         {
           prop: "isOpenWpay",
           key: "isOpenWpay",
           label: "是否开通微信支付",
           formatter: (row: any) => (row.isOpenWpay ? "开通" : "未开通")
         }
       ];
export const bindPnumArr: element.Options[] = [
  {
    label: "绑定",
    value: 1
  },
  {
    label: "未绑定",
    value: 0
  }
];
export const openWpayArr=[
  {
    label: "开通",
    value: 1
  },
  {
    label: "未开通",
    value: 0
  }
]

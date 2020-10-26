
const shareColumns = [
  {
    prop: "orderCode",
    label: "订单编号",
    col: {
      width: '150px',
      fixed: 'left'
    }
  },
  {
    prop: "userName",
    label: "客户姓名",
    col: {
      fixed: 'left'
    }
  },
  {
    prop: "userPhone",
    label: "客户手机号",
    col: {
      width: '100px'
    }
  }
]

export class Config {
  get(_this: any): any {
    const pickerOptions = {
      only: [
        ...shareColumns,
        {
          prop: "goodsSize",
          label: "退款商品",
          render: (h: any, row: any) =>
            h(
              "span",
              {
                on: {
                  click: () => _this.openRefundGoodsDetail(row)
                },
                class: "el-button el-button--text"
              },
              row.goodsSize
            )
        },
        {
          prop: "orderMoney",
          label: "订单金额（元）"
        },
        {
          prop: "afterSaleMoney",
          label: "退款金额（元）"
        },
      ],
      refuntAndGood: [
        ...shareColumns,
        {
          prop: "goodsSize",
          label: "退款退货商品",
          render: (h: any, row: any) =>
            h(
              "span",
              {
                on: {
                  click: () => _this.openRefundGoodsDetail(row)
                },
                class: "el-button el-button--text"
              },
              row.goodsSize
            )
        },
        {
          prop: "orderMoney",
          label: "订单金额（元）"
        },
        {
          prop: "afterSaleMoney",
          label: "退款金额（元）"
        },
      ],
      good: [
        ...shareColumns,
        {
          prop: "goodsSize",
          label: "换货商品",
          render: (h: any, row: any) =>
            h(
              "span",
              {
                on: {
                  click: () => _this.openRefundGoodsDetail(row)
                },
                class: "el-button el-button--text"
              },
              row.goodsSize
            )
        },
        {
          prop: "orderMoney",
          label: "订单金额（元）"
        }
      ],
      onlyDetail: [
        {
          title: "商品",
          key: "subOrderNo",
          slot: true,
          slotName: "column0",
          width: "200px"
        },
        {
          title: "提货方式",
          key: "type",
          formatter: (type: any) => {
            let _typeList = ["到店安装", "物流配送"];
            return type !== null ? _typeList[Number(type)] : "—";
          }
        },
        {
          title: "零售价（元）",
          key: "skuPrice"
        },
        {
          title: "安装费（元）",
          key: "skuInstallPrice"
        },
        {
          title: "数量（元）",
          key: "num"
        }
      ],
      goodDetail: [
        {
          title: "商品",
          key: "subOrderNo",
          slot: true,
          slotName: "column0",
          width: "200px"
        },
        {
          title: "提货方式",
          key: "type",
          formatter: (type: any) => {
            let _typeList = ["到店安装", "物流配送"];
            return type !== null ? _typeList[Number(type)] : "—";
          }
        },
        {
          title: "零售价（元）",
          key: "skuPrice"
        },
        {
          title: "数量（元）",
          key: "num"
        }
      ]
    }
    return pickerOptions;
  }
}

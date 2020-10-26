import dayjs from "dayjs";
import _ from "lodash";
import { COUPON_TYPE, COUPON_STATUS, COUPON_RULE, COUPON_GOODS_TYPE } from "./type";

export interface Item {
  name: string;
  code: string;
  createdTime: number;
  channel: string;
  method: number;
  used: boolean;
  consumerMobile: string;
}

export class Config {
  get(vm: any): any {
    return {
      // 搜索栏
      searchConfig: {
        props: [
          {
            tag: "input",
            prop: "customerNameLike",
            placeholder: "客户姓名"
          },
          {
            tag: "input",
            prop: "codeLike",
            placeholder: "核销码"
          },
          {
            tag: "datePicker",
            prop: "datePicker",
            type: "datetimerange"
          }
        ]
      },

      // 搜索栏
      search2Config: {
        props: [
          {
            tag: "input",
            prop: "customerNameLike",
            placeholder: "客户姓名"
          },
          {
            tag: "datePicker",
            prop: "datePicker",
            type: "datetimerange"
          }
        ]
      },

      // 表格配置
      tableColumns: [
        {
          title: "客户姓名",
          key: "consumerName"
        },
        {
          title: "手机号",
          key: "consumerMobile",
          render: (h: any, ctx: Item) => {
            return h("span", {}, ctx.consumerMobile || "-");
          }
        },
        {
          title: "核销码",
          key: "code"
        },
        {
          title: "领取时间",
          key: "createdAt",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "获取方式",
          key: "channel",
          render: (h: any, ctx: Item) => {
            return h("span", {}, ctx.channel === "BY_SELF" ? "主动领取" : "活动获取");
          }
        },
        {
          title: "使用状态",
          key: "used",
          render: (h: any, ctx: Item) => {
            return h("span", {}, ctx.used ? "已使用" : "可使用");
          }
        }
        // {
        //   operate: true,
        //   title: "操作",
        //   setBtns: (row: Item, index: number) => {
        //     if(!row.used && vm.accessIsOpened('PERM:DISCOUNT_COUPON:VERIFICATION')){
        //       return [
        //         {
        //           label: "验券",
        //           handler: () => vm.showCheckDialog(row, index)
        //         }
        //       ];
        //     }else{
        //       return [];
        //     }

        //   }
        // }
      ],

      // 实物奖品表格配置
      table2Columns: [
        {
          title: "领取客户",
          key: "consumerName"
        },
        {
          title: "手机号",
          key: "consumerMobile"
        },
        // {
        //   title: "核销码",
        //   key: "code"
        // },
        {
          title: "领取时间",
          key: "createdAt",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "当前状态",
          key: "used",
          render: (h: any, ctx: Item) => {
            return h("span", {}, ctx.used ? "已使用" : "可使用");
          }
        }
        // {
        //   operate: true,
        //   title: "操作",
        //   setBtns: (row: Item, index: number) => {
        //     if(!row.used && vm.accessIsOpened('PERM:PRIZE:VERIFICATION')){
        //       return [
        //         {
        //           label: "验券",
        //           handler: () => vm.showCheckDialog(row, index)
        //         }
        //       ];
        //     }else{
        //       return [];
        //     }

        //   }
        // }
      ],

      infoColumns: [
        {
          label: "优惠券名称：",
          prop: "name"
        },
        {
          label: "有效期：",
          prop: "validFrom",
          render: (h: any, ctx: any) => {
            return h(
              "span",
              {},
              `${dayjs(ctx.validFrom).format("YYYY-MM-DD HH:mm")} ~ ${dayjs(ctx.validTo).format("YYYY-MM-DD HH:mm")}`
            );
          }
        },
        {
          label: "库存：",
          prop: "stockTotal"
        },
        {
          label: "优惠券类型：",
          prop: "type",
          render: (h: any, ctx: any) => {
            let s = COUPON_TYPE.find((v: any) => v.index === ctx.type);
            return h("span", {}, (s && s.label) || "-");
          }
        },
        {
          label: "面值：",
          prop: "discountValue",
          render: (h: any, ctx: any) => {
            return h(
              "span",
              {},
              `${_.isNumber(ctx.discountValue) ? ctx.discountValue : "-"}元（门槛金额：${ctx.discountValueBase ||
                "-"}元）`
            );
          }
        },
        {
          label: "折扣：",
          prop: "discountRatio",
          render: (h: any, ctx: any) => {
            return h("span", {}, `${Math.floor(ctx.discountRatio * 100) / 10 || "-"}`);
          }
        },
        {
          label: "获取规则：",
          prop: "releaseChannels",
          render: (h: any, ctx: any) => {
            let arr: string[] = [];
            (ctx.releaseChannels || []).map((v: any) => {
              let str = COUPON_RULE.find((vv: any) => vv.index === v);
              if (str) {
                arr.push(str.label);
              }
            });
            return h("span", {}, `${arr.join(",")}`);
          }
        },
        {
          label: "适用类型：",
          prop: "goodsType",
          render: (h: any, ctx: any) => {
            let item = COUPON_GOODS_TYPE.find((vv: any) => vv.value === ctx.goodsType);
            return h("span", {}, `${item && item.label}`);
          }
        },
        {
          label: "使用范围：",
          prop: "goodsScope",
          render: (h: any, ctx: any) => {
            if (ctx.goodsScope === "UNIVERSAL") {
              return h("span", {}, `全场通用`);
            } else {
              let strArr: string[] = [];
              let arr: any[] = [h("p", {}, `指定商品`)];
              (ctx.modelNames || []).map((v: any) => {
                strArr.push(v);
              });
              arr.push(h("span", {}, strArr.join(",")));
              return h("div", {}, arr);
            }
          }
        },
        {
          label: "使用规则：",
          prop: "description"
        }
      ],

      // 实物奖品详情
      info2Columns: [
        {
          label: "奖品图片：",
          prop: "name",
          render: (h: any, ctx: any) => {
            return h("img", { attrs: { src: ctx.posterUrl }, style: "width:150px;" }, null);
          }
        },
        {
          label: "奖品名称：",
          prop: "name"
        },
        {
          label: "库存：",
          prop: "stockCount"
        },
        {
          label: "领取方式：",
          prop: "stockCount",
          render: (h: any, ctx: any) => {
            return h("span", {}, `${ctx.receiveMeans === "ON_SITE" ? "到店" : "邮寄"}`);
          }
        },
        {
          label: "使用规则：",
          prop: "description"
        }
      ]
    };
  }
}

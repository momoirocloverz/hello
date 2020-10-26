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
  redeemedTime: number;
  checkerName: string;
}

export class Config {
  get(vm: any): any {
    return {
      // 搜索栏
      searchConfig: () => {
        let config: any = {
          props: [
            {
              tag: "input",
              prop: "prizeNameLike",
              placeholder: "奖品名称"
            },
            {
              tag: "input",
              prop: "codeLike",
              placeholder: "核销码"
            },
            {
              tag: "input",
              prop: "customerNameLike",
              placeholder: "客户姓名"
            },
            {
              tag: "input",
              prop: "checkerNameLike",
              placeholder: "验券人"
            }
          ],
          optBtns: []
        };
        if (vm.accessIsOpened("PERM:GIFT_CHECK:EDIT")) {
          config.optBtns.push({
            label: "奖品验券",
            handler: () => {
              vm.showCheckDialog();
            }
          });
        }
        return config;
      },

      // 表格配置
      tableColumns: [
        {
          title: "奖品名称",
          key: "prizeName"
        },
        {
          title: "核销码",
          key: "code"
        },
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
          title: "领取时间",
          key: "createdAt",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm"));
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
          title: "验券人",
          key: "checkerName"
        },
        {
          title: "验券时间",
          key: "redeemedTime",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.redeemedTime).format("YYYY-MM-DD HH:mm"));
          }
        }
      ],

      infoColumns: [
        {
          label: "奖品类型：",
          prop: "prizeType",
          render: (h: any, ctx: any) => {
            return h("span", {}, `${ctx.prizeType === "OBJECT" ? "实物奖品" : "优惠券"}`);
          }
        },
        {
          label: "优惠券名称：",
          prop: "name"
        },
        {
          label: "优惠券类型：",
          prop: "type",
          render: (h: any, ctx: any) => {
            let s = COUPON_TYPE.find((v: any) => v.index === ctx.couponType);
            return h("span", {}, (s && s.label) || "-");
          }
        },
        {
          label: "有效期：",
          prop: "validFrom",
          render: (h: any, ctx: any) => {
            return h(
              "span",
              {},
              `${dayjs(ctx.useStartAt).format("YYYY-MM-DD HH:mm")} ~ ${dayjs(ctx.useEndAt).format("YYYY-MM-DD HH:mm")}`
            );
          }
        },
        {
          label: "剩余库存：",
          prop: "stockCount"
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
              if (ctx.goodsType === "MODEL_GOODS") {
                let strArr: string[] = [];
                let arr: any[] = [h("p", {}, `指定车型`)];
                (ctx.modelNames || []).map((v: any) => {
                  strArr.push(v);
                });
                arr.push(h("span", {}, strArr.join(",")));
                return h("div", {}, arr);
              } else {
                let strArr: string[] = [];
                let arr: any[] = [h("p", {}, `指定商品`)];
                (ctx.goodsNames || []).map((v: any) => {
                  strArr.push(v);
                });
                arr.push(h("span", {}, strArr.join(",")));
                return h("div", {}, arr);
              }
            }
          }
        }
      ],

      infoColumns1: [
        {
          label: "奖品类型：",
          prop: "prizeType",
          render: (h: any, ctx: any) => {
            return h("span", {}, "实物奖品");
          }
        },
        {
          label: "奖品名称：",
          prop: "name"
        },
        {
          label: "剩余库存：",
          prop: "stockCount"
        },
        {
          label: "领取时间：",
          prop: "prizeType",
          render: (h: any, ctx: any) => {
            return h("span", {}, `${dayjs(ctx.useStartAt).format("YYYY-MM-DD HH:mm")}`);
          }
        },
        {
          label: "有效期：",
          prop: "prizeType",
          render: (h: any, ctx: any) => {
            return h(
              "span",
              {},
              `${dayjs(ctx.useStartAt).format("YYYY-MM-DD HH:mm")}~${dayjs(ctx.useEndAt).format("YYYY-MM-DD HH:mm")}`
            );
          }
        }
      ]
    };
  }
}

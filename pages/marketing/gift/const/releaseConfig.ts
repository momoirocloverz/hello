import dayjs from "dayjs";
import _ from "lodash";

export interface Item {
  name: string;
  code: string;
  createdTime: number;
  channel: string;
  method: number;
  used: boolean;
  consumerMobile: string;
  checkerName: string;
  campaignName: string;
  campaignReleaseId: number;
  redeemedTime: number;
  receivingStatus: number;
  campaignId: number;
}

export class Config {
  get(vm: any): any {
    return {
      // 搜索栏
      searchConfig: {
        props: [
          {
            tag: "input",
            prop: "prizeNameLike",
            placeholder: "奖品名称"
          },

          {
            tag: "input",
            prop: "receiverNameLike",
            placeholder: "客户姓名"
          }
        ]
      },

      // 搜索栏
      search2Config: {
        props: [
          {
            tag: "input",
            prop: "prizeNameLike",
            placeholder: "奖品名称"
          },
          {
            tag: "input",
            prop: "receiverNameLike",
            placeholder: "客户姓名"
          },
          {
            tag: "input",
            prop: "campaignNameLike",
            placeholder: "活动名称"
          },
          {
            tag: "input",
            prop: "checkerNameLike",
            placeholder: "发货人"
          },
          {
            tag: "select",
            prop: "receivingStatus",
            placeholder: "是否签收",
            options: [{ value: "RECEIVED", label: "已签收" }, { value: "NOT_RECEIVED", label: "未签收" }]
          }
        ]
      },

      // 表格配置
      tableColumns: [
        {
          title: "奖品名称",
          key: "prizeName"
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
          title: "收获地址",
          key: "consumerAddress"
        },
        {
          title: "参与活动",
          key: "campaignName",
          render: (h: any, ctx: Item) => {
            return h(
              "router-link",
              {
                class: "link",
                props: {
                  to: `/marketing/activity/lottery/hostedActiveDetail/${ctx.campaignId}?activeType=lottery&releaseId=${ctx.campaignReleaseId}&activeItem=factory&mode=hosted`
                }
              },
              ctx.campaignName
            );
          }
        },
        {
          title: "提交时间",
          key: "createdTime",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          operate: true,
          title: "操作",
          setBtns: (row: Item, index: number) => {
            if (!row.used && vm.accessIsOpened("PERM:GIFT_RELEASE:EDIT")) {
              return [
                {
                  label: "发货",
                  handler: () => vm.showCheckDialog(row, index)
                }
              ];
            } else {
              return [];
            }
          }
        }
      ],

      tableColumns1: [
        {
          title: "奖品名称",
          key: "prizeName"
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
          title: "收获地址",
          key: "consumerAddress"
        },
        {
          title: "参与活动",
          key: "campaignName",
          render: (h: any, ctx: Item) => {
            return h(
              "router-link",
              {
                class: "link",
                props: {
                  to: `/marketing/activity/lottery/hostedActiveDetail/${ctx.campaignId}?activeType=lottery&releaseId=${ctx.campaignReleaseId}&activeItem=factory&mode=hosted`
                }
              },
              ctx.campaignName
            );
          }
        },
        {
          title: "提交时间",
          key: "createdTime",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "发货人",
          key: "checkerName"
        },
        {
          title: "发货时间",
          key: "redeemedTime",
          render: (h: any, ctx: Item) => {
            return h("span", {}, dayjs(ctx.redeemedTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "是否签收",
          key: "receivingStatus",
          render: (h: any, ctx: Item) => {
            return h("span", {}, ctx.receivingStatus ? "已签收" : "未签收");
          }
        },
        {
          operate: true,
          title: "操作",
          setBtns: (row: Item, index: number) => {
            return [
              {
                label: "物流详情",
                handler: () => vm.showDetailDialog(row, index)
              }
            ];
          }
        }
      ]
    };
  }
}

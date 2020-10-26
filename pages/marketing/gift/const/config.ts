import dot from '../components/dot.vue';
import dot2 from '../components/dot2.vue';
import dayjs from 'dayjs';
import { COUPON_TYPE, COUPON_STATUS, PRIZE_STATUS, COUPON_GOODS_TYPE } from './type'

export default class Config {
  get(vm: any): any {
    return {
      // 优惠券搜索栏
      searchConfig: () => {
        let obj: any = {
          props: [
            {
              tag: "input",
              prop: "couponName",
              placeholder: "优惠券名称"
            },
            {
              tag: "select",
              prop: "couponType",
              placeholder: "优惠券类型",
              options: COUPON_TYPE
            },
            {
              tag: "select",
              prop: "expireStatus",
              placeholder: "优惠券状态",
              options: COUPON_STATUS
            },
            {
              tag: "select",
              prop: "goodsType",
              placeholder: "适用类型",
              options: COUPON_GOODS_TYPE
            }
          ],
          optBtns: []
        };
        
        // if(vm.accessIsOpened('PERM:DISCOUNT_COUPON:VERIFICATION')){
        //   obj.optBtns.push({
        //     label: "验券",
        //     handler: () => {
        //       vm.showCheckDialog();
        //     }
        //   });
        // }
        if(vm.accessIsOpened('PERM:DISCOUNT_COUPON:EDIT')){
          obj.optBtns.push({
            label: "新建优惠券",
            handler: () => {
              vm.add();
            }
          });
        }
        return obj;
      },
      // 实物奖品搜索栏
      search2Config: () => {
        let obj: any = { 
          props: [
            {
              tag: "input",
              prop: "objectName",
              placeholder: "奖品名称"
            },
            {
              tag: "select",
              prop: "enabled",
              placeholder: "奖品状态",
              options: PRIZE_STATUS
            }
          ],
          optBtns: []
        };
        // if(vm.accessIsOpened('PERM:PRIZE:VERIFICATION')){
        //   obj.optBtns.push({
        //     label: "验券",
        //     handler: () => {
        //       vm.showCheckDialog();
        //     }
        //   });
        // }
        if(vm.accessIsOpened('PERM:PRIZE:EDIT')){
          obj.optBtns.push({
            label: "新建实物奖品",
            handler: () => {
              vm.add();
            }
          });
        }
        return obj;
      },
      // 表格配置
      tableColumns: [
        {
          title: "优惠券名称",
          key: "name"
        },
        {
          title: "优惠券类型",
          key: "couponType",
          render: (h: any, ctx: any) => {
            let s = COUPON_TYPE.find((v: any) => v.index === ctx.couponType)
            return h('span',{}, s && s.label || '-')
          }
        },
        {
          title: "有效期",
          key: "expires",
          render: (h: any, ctx: any) => {
            return h('span',{}, `${dayjs(ctx.validFrom).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(ctx.validTo).format('YYYY-MM-DD HH:mm')}`)
          }
        },
        {
          title: "适用类型",
          key: "goodsType",
          width: 120,
          render: (h: any, ctx: any) => {
            let s = COUPON_GOODS_TYPE.find((v: any) => v.value === ctx.goodsType)
            return h('span',{}, s && s.label || '-')
          }
        },
        {
          title: "使用/领取/剩余库存",
          key: "count",
          width: 200,
          render: (h: any, ctx: any) => {
            return h('span',{}, `${ctx.used}/${ctx.received}/${ctx.stockCount}`)
          }
        },
        {
          title: "奖品状态",
          key: "enabled",
          render: (h: any, ctx: any) => {
            return h(dot, { props: { status: ctx.enabled,  expireStatus: ctx.expireStatus } }, null)
          }
        },
        {
          title: "创建时间",
          key: "createdTime",
          width: 200,
          render: (h: any, ctx: any) => {
            return h('span', {}, dayjs(ctx.createdTime).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          operate: true,
          title: "操作",
          width: 300,
          setBtns: (row: any, index: number) => {
            if(!vm.accessIsOpened('PERM:DISCOUNT_COUPON:EDIT')){
              return [
                {
                  label: "详情",
                  handler: () => vm.detail(row, index)
                }
              ];
            }
            if(!row.enabled || (row.enabled && row.expireStatus === 'EXPIRE')){
              return [
                  {
                    label: "详情",
                    handler: () => vm.detail(row, index)
                  }
              ]
            }
            if(row.expireStatus === 'NOT_ALLOW'){
              return [
                {
                  label: "编辑",
                  handler: () => vm.edit(row, index)
                },
                
                {
                  label: "删除",
                  handler: () => vm.del(row, index)
                }
              ];
            } else if(row.expireStatus === 'ALLOW'){
              let arr: any[] = [
                {
                  label: "详情",
                  handler: () => vm.detail(row, index)
                },
                {
                  label: "增加库存",
                  handler: () => vm.showDialog(row, index)
                }
              ];
              if(vm.accessIsOpened('PERM:DISCOUNT_COUPON:STOP')){
                arr.push({
                  label: "停用",
                  handler: () => vm.disabled(row, index)
                });
              }
              return arr;
            }
          }
        }
      ],


      // 实物奖品表格配置
      table2Columns: [
        {
          title: "奖品名称",
          key: "name"
        },
        {
          title: "使用/领取/剩余库存",
          key: "count",
          width: 200,
          render: (h: any, ctx: any) => {
            return h('span',{}, `${ctx.used}/${ctx.received}/${ctx.stockCount}`)
          }
        },
        {
          title: "奖品状态",
          key: "enabled",
          render: (h: any, ctx: any) => {
            return h(dot2, { props: { status: ctx.enabled } }, null)
          }
        },
        {
          title: "创建时间",
          key: "createdTime",
          width: 200,
          render: (h: any, ctx: any) => {
            return h('span', {}, dayjs(ctx.createdTime).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          operate: true,
          title: "操作",
          width: 300,
          setBtns: (row: any, index: number) => {
            if(!vm.accessIsOpened('PERM:PRIZE:EDIT')){
              return [
                {
                  label: "详情",
                  handler: () => vm.detail(row, index)
                }
              ];
            }

            if(!row.enabled){
              return [
                  {
                    label: "详情",
                    handler: () => vm.detail(row, index)
                  }
              ]
            }
            let arr: any[] = [
              {
                label: "详情",
                handler: () => vm.detail(row, index)
              },
              {
                label: "增加库存",
                handler: () => vm.showDialog(row, index)
              }
            ];
            if(vm.accessIsOpened('PERM:PRIZE:STOP')){
              arr.push({
                label: "停用",
                handler: () => vm.disabled(row, index)
              });
            }
            return arr;
          }
        }
      ]
      
      
    }
  }

  
  
}
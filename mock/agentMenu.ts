// 菜单 侧边栏
export const agentMenu = [
  {
    title: "经销商",
    icon: "iconfont iconshuju",
    path: "/snap"
  },
  {
    title: "营销",
    icon: "iconfont iconliwu",
    children: [
      {
        title: "活动管理",
        children: [
          {
            path: "/marketing/activity/lottery/index",
            title: "抽奖活动"
          },
          {
            title: "促销活动",
            path: "/marketing/activity/sales/index"
          },
          {
            title: "线下活动",
            path: "/marketing/activity/site/index"
          },
          {
            title: "活动模板",
            path: "/marketing/activity/template/index"
          },
          {
            title: "营销工具",
            path: "/marketing/activity/tool/index"
          }
        ]
      },
      {
        title: "奖品管理",
        children: [
          {
            path: "/marketing/gift/coupon/index",
            title: "优惠劵"
          },
          {
            path: "/marketing/gift/entity/index",
            title: "实物奖品"
          }
        ]
      },
      {
        title: "营销推文",
        children: [
          {
            path: "/marketing/tweets/article/index",
            title: "文章列表"
          },
          {
            path: "/marketing/tweets/column/index",
            title: "栏目管理"
          },
          {
            path: "/marketing/tweets/source/index",
            title: "营销素材"
          }
        ]
      },
      {
        title: "banner设置",
        children: [
          {
            path: "/marketing/setting/mall/index",
            title: "商城首页"
          },
          {
            path: "/marketing/setting/interact/index",
            title: "互动有礼"
          }
        ]
      }
    ]
  },
  {
    title: "客户",
    icon: "iconfont iconkehudongcha",
    children: [
      {
        path: "/customer/agentFans",
        title: "粉丝管理"
      },
      {
        path: "/customer/member/agentMember",
        title: "潜客管理"
      }
    ]
  },
  {
    title: "预约",
    icon: "iconfont iconwenzhang",
    children: [
      {
        path: "/appointment/online-book",
        title: "在线预订"
      },
      {
        path: "/appointment/appointmentTestDrive",
        title: "预约试驾"
      }
    ]
  },
  {
    title: "商品",
    icon: "iconfont iconshangpin",
    children: [
      {
        path: "/goods/list-agent",
        title: "车型列表"
      }
    ]
  },
  {
    title: "顾问",
    icon: "iconfont iconjingjirenguanli",
    children: [
      {
        path: "/adviser/manage",
        title: "顾问列表"
      }
    ]
  },
  {
    title: "公众号",
    icon: "iconfont icongongzhonghao",
    children: [
      {
        title: "公众号设置",
        path: "/wechat/set/index"
      },
      {
        title: "微信菜单设置",
        path: "/wechat/menu/index"
      },
      {
        title: "微信支付设置",
        path: "/wechat/pay/index"
      }
    ]
  },
  {
    title: "权限",
    icon: "iconfont iconquanxian",
    children: [
      {
        title: "权限组管理",
        path: "/access/group"
      },
      {
        title: "用户管理",
        path: "/access/account"
      }
    ]
  },
  {
    title: "设置",
    icon: "iconfont iconshezhi",
    children: [
      {
        title: "经销商设置",
        path: "/sys/agent"
      },{
        title: "救援设置",
        path: "/sys/rescue"
      },
      {
        title: "其他设置",
        path: "/sys/other"
      },
      {
        title: "消息设置",
        path: "/sys/templateMsg"
      }
    ]
  },
  {
    title: "日志",
    icon: "iconfont iconim_zuji",
    path: "/logs"
  }
];
export default agentMenu;

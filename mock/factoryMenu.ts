// 菜单 侧边栏
export const factoryMenu = [
  {
    title: "主机厂",
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
            path: "/marketing/activity/approval/list",
            title: "活动审批"
          },
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
      }
    ]
  },
  {
    title: "商品",
    icon: "iconfont iconshangpin",
    children: [
      {
        path: "/goods/list-factory",
        title: "车型管理"
      },
      {
        path: "/goods/highlight",
        title: "车型亮点管理"
      },
      {
        path: "/goods/authority",
        title: "授权管理"
      },
      {
        path: "/goods/limitPrice",
        title: "限价管理"
      },
      {
        path: "/goods/tags",
        title: "车辆标签管理"
      }
    ]
  },
  {
    title: "客户",
    icon: "iconfont iconkehudongcha",
    children: [
      {
        path: "/customer/factoryFans",
        title: "粉丝管理"
      },
      {
        path: "/customer/member/factoryMember",
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
    title: "集团",
    icon: "iconfont iconshangpin",
    path: "/group/list"
  },
  {
    title: "经销商",
    icon: "iconfont iconshangpin",
    children: [
      {
        title: "经销商管理",
        children: [
          {
            path: "/dealer/dealerList",
            title: "经销商列表"
          },
          {
            path: "/dealer/consultantTag",
            title: "顾问评价标签"
          }
        ]
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
    title: "日志",
    icon: "iconfont iconim_zuji",
    path: "/logs"
  }
];
export default factoryMenu;

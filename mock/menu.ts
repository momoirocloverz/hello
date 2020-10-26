// 集团菜单 侧边栏
export const menuAside = [
  {
    title: "概览",
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
    title: "经销商",
    icon: "iconfont iconshangpin",
    path: "/dealer/dealerList"
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
    title: "日志",
    icon: "iconfont iconim_zuji",
    path: "/logs"
  }
];
export default menuAside;

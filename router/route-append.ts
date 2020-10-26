export default [
  {
    path: "/access/account",
    name: "access-account",
    component: () => import("@/pages/access/account.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/access/group",
    name: "access-group",
    component: () => import("@/pages/access/group.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/adviser/detail/:id",
    name: "adviser-detail",
    component: () => import("@/pages/adviser/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/adviser/manage",
    name: "adviser-manage",
    component: () => import("@/pages/adviser/manage.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/appointment/appointmentDetail/:id",
    name: "appointment-appointmentDetail",
    component: () => import("@/pages/appointment/appointmentDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/appointment/appointmentTestDrive",
    name: "appointment-appointmentTestDrive",
    component: () => import("@/pages/appointment/appointmentTestDrive.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/appointment/online-book",
    name: "appointment-online-book",
    component: () => import("@/pages/appointment/online-book.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/appointment/testDriveEvaluate",
    name: "appointment-testDriveEvaluate",
    component: () => import("@/pages/appointment/testDriveEvaluate.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/customer/agentFans",
    name: "customer-agentFans",
    component: () => import("@/pages/customer/agentFans.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/customer/factoryFans",
    name: "customer-factoryFans",
    component: () => import("@/pages/customer/factoryFans.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/customer/member/agentMember",
    name: "customer-member-agentMember",
    component: () => import("@/pages/customer/member/agentMember.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/customer/member/detail/:id",
    name: "customer-member-detail",
    component: () => import("@/pages/customer/member/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/customer/member/factoryMember",
    name: "customer-member-factoryMember",
    component: () => import("@/pages/customer/member/factoryMember.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/dealer/consultantTag",
    name: "dealer-consultantTag",
    component: () => import("@/pages/dealer/consultantTag.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/dealer/dealerList",
    name: "dealer-dealerList",
    component: () => import("@/pages/dealer/dealerList.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/authority",
    name: "goods-authority",
    component: () => import("@/pages/goods/authority.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/highlight",
    name: "goods-highlight",
    component: () => import("@/pages/goods/highlight.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/limitPrice",
    name: "goods-limitPrice",
    component: () => import("@/pages/goods/limitPrice.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/list-agent",
    name: "goods-list-agent",
    component: () => import("@/pages/goods/list-agent.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/list-factory",
    name: "goods-list-factory",
    component: () => import("@/pages/goods/list-factory.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/model/:operation/:modelCode?",
    name: "goods-model",
    component: () => import("@/pages/goods/model.operation.modelCode$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/modelinfo/:operation/:modelCode?",
    name: "goods-modelinfo",
    component: () => import("@/pages/goods/modelinfo.operation.modelCode$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/price-rule/:operation/:ruleId?",
    name: "goods-price-rule",
    component: () => import("@/pages/goods/price-rule.operation.ruleId$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/serie/:operation/:serieCode?",
    name: "goods-serie",
    component: () => import("@/pages/goods/serie.operation.serieCode$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/serieinfo/:operation/:serieCode?",
    name: "goods-serieinfo",
    component: () => import("@/pages/goods/serieinfo.operation.serieCode$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/store/storeCategory",
    name: "goods-store-storeCategory",
    component: () => import("@/pages/goods/store/storeCategory.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/store/storeClassification",
    name: "goods-store-storeClassification",
    component: () => import("@/pages/goods/store/storeClassification.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/store/storeList",
    name: "goods-store-storeList",
    component: () => import("@/pages/goods/store/storeList.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/goods/store/storeListDetail/:id/:type?",
    name: "goods-store-storeListDetail",
    component: () => import("@/pages/goods/store/storeListDetail.id.type$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/store/wares/:operateType/:type/:id?",
    name: "goods-store-wares",
    component: () => import("@/pages/goods/store/wares.operateType.type.id$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/goods/tags",
    name: "goods-tags",
    component: () => import("@/pages/goods/tags.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/group/list",
    name: "group-list",
    component: () => import("@/pages/group/list.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/home",
    name: "home",
    component: () => import("@/pages/home.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/logs",
    name: "logs",
    component: () => import("@/pages/logs.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/approval/list",
    name: "marketing-activity-approval-list",
    component: () => import("@/pages/marketing/activity/approval/list.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/lottery/add",
    name: "marketing-activity-lottery-add",
    component: () => import("@/pages/marketing/activity/lottery/add.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/lottery/detail/:id",
    name: "marketing-activity-lottery-detail",
    component: () => import("@/pages/marketing/activity/lottery/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/lottery/hostedActiveDetail/:id",
    name: "marketing-activity-lottery-hostedActiveDetail",
    component: () => import("@/pages/marketing/activity/lottery/hostedActiveDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/lottery/index",
    name: "marketing-activity-lottery-index",
    component: () => import("@/pages/marketing/activity/lottery/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/lottery/issuedDetail/:id",
    name: "marketing-activity-lottery-issuedDetail",
    component: () => import("@/pages/marketing/activity/lottery/issuedDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/sales/add",
    name: "marketing-activity-sales-add",
    component: () => import("@/pages/marketing/activity/sales/add.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/sales/detail/:id",
    name: "marketing-activity-sales-detail",
    component: () => import("@/pages/marketing/activity/sales/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/sales/index",
    name: "marketing-activity-sales-index",
    component: () => import("@/pages/marketing/activity/sales/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/sales/issuedDetail/:id",
    name: "marketing-activity-sales-issuedDetail",
    component: () => import("@/pages/marketing/activity/sales/issuedDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/site/3dSignIn",
    name: "marketing-activity-site-3dSignIn",
    component: () => import("@/pages/marketing/activity/site/3dSignIn.vue"),
    meta: {
      withMenu: false,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/site/add",
    name: "marketing-activity-site-add",
    component: () => import("@/pages/marketing/activity/site/add.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/site/detail/:id",
    name: "marketing-activity-site-detail",
    component: () => import("@/pages/marketing/activity/site/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/site/hostedActiveDetail/:id",
    name: "marketing-activity-site-hostedActiveDetail",
    component: () => import("@/pages/marketing/activity/site/hostedActiveDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/site/index",
    name: "marketing-activity-site-index",
    component: () => import("@/pages/marketing/activity/site/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/site/issuedDetail/:id",
    name: "marketing-activity-site-issuedDetail",
    component: () => import("@/pages/marketing/activity/site/issuedDetail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/activity/site/lotteryDraw",
    name: "marketing-activity-site-lotteryDraw",
    component: () => import("@/pages/marketing/activity/site/lotteryDraw.vue"),
    meta: {
      withMenu: false,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/template/editor",
    name: "marketing-activity-template-editor",
    component: () => import("@/pages/marketing/activity/template/editor.vue"),
    meta: {
      withMenu: false,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/template/index",
    name: "marketing-activity-template-index",
    component: () => import("@/pages/marketing/activity/template/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/activity/tool/index",
    name: "marketing-activity-tool-index",
    component: () => import("@/pages/marketing/activity/tool/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/check/index",
    name: "marketing-gift-check-index",
    component: () => import("@/pages/marketing/gift/check/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/coupon/create",
    name: "marketing-gift-coupon-create",
    component: () => import("@/pages/marketing/gift/coupon/create.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/coupon/detail/:id",
    name: "marketing-gift-coupon-detail",
    component: () => import("@/pages/marketing/gift/coupon/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/gift/coupon/index",
    name: "marketing-gift-coupon-index",
    component: () => import("@/pages/marketing/gift/coupon/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/coupon/update/:id",
    name: "marketing-gift-coupon-update",
    component: () => import("@/pages/marketing/gift/coupon/update.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/gift/entity/create",
    name: "marketing-gift-entity-create",
    component: () => import("@/pages/marketing/gift/entity/create.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/entity/detail/:id",
    name: "marketing-gift-entity-detail",
    component: () => import("@/pages/marketing/gift/entity/detail.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/gift/entity/index",
    name: "marketing-gift-entity-index",
    component: () => import("@/pages/marketing/gift/entity/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/gift/entity/update/:id",
    name: "marketing-gift-entity-update",
    component: () => import("@/pages/marketing/gift/entity/update.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/gift/release/index",
    name: "marketing-gift-release-index",
    component: () => import("@/pages/marketing/gift/release/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/setting/interact/index",
    name: "marketing-setting-interact-index",
    component: () => import("@/pages/marketing/setting/interact/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/setting/mall/index",
    name: "marketing-setting-mall-index",
    component: () => import("@/pages/marketing/setting/mall/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/article/create",
    name: "marketing-tweets-article-create",
    component: () => import("@/pages/marketing/tweets/article/create.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/article/index",
    name: "marketing-tweets-article-index",
    component: () => import("@/pages/marketing/tweets/article/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/article/update/:id",
    name: "marketing-tweets-article-update",
    component: () => import("@/pages/marketing/tweets/article/update.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/marketing/tweets/column/index",
    name: "marketing-tweets-column-index",
    component: () => import("@/pages/marketing/tweets/column/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/source/create",
    name: "marketing-tweets-source-create",
    component: () => import("@/pages/marketing/tweets/source/create.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/source/index",
    name: "marketing-tweets-source-index",
    component: () => import("@/pages/marketing/tweets/source/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/marketing/tweets/source/update/:id",
    name: "marketing-tweets-source-update",
    component: () => import("@/pages/marketing/tweets/source/update.id.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/msgCenter/index",
    name: "msgCenter-index",
    component: () => import("@/pages/msgCenter/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/afterSale/:type?",
    name: "order-afterSale",
    component: () => import("@/pages/order/afterSale.type$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/order/afterSale",
    name: "order-afterSale",
    component: () => import("@/pages/order/afterSale.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/evaluateList",
    name: "order-evaluateList",
    component: () => import("@/pages/order/evaluateList.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/mailOrder",
    name: "order-mailOrder",
    component: () => import("@/pages/order/mailOrder.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/mailOrderDetail/:id?",
    name: "order-mailOrderDetail",
    component: () => import("@/pages/order/mailOrderDetail.id$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/order/postsale",
    name: "order-postsale",
    component: () => import("@/pages/order/postsale.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/shopOrder",
    name: "order-shopOrder",
    component: () => import("@/pages/order/shopOrder.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/order/shopOrderDetail/:id?",
    name: "order-shopOrderDetail",
    component: () => import("@/pages/order/shopOrderDetail.id$.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: true,
    }
  },{
    path: "/sys/agent",
    name: "sys-agent",
    component: () => import("@/pages/sys/agent.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/sys/other",
    name: "sys-other",
    component: () => import("@/pages/sys/other.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/sys/rescue",
    name: "sys-rescue",
    component: () => import("@/pages/sys/rescue.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/sys/templateMsg",
    name: "sys-templateMsg",
    component: () => import("@/pages/sys/templateMsg.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/wechat/menu/index",
    name: "wechat-menu-index",
    component: () => import("@/pages/wechat/menu/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/wechat/pay/index",
    name: "wechat-pay-index",
    component: () => import("@/pages/wechat/pay/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/wechat/set/bindWechat",
    name: "wechat-set-bindWechat",
    component: () => import("@/pages/wechat/set/bindWechat.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  },{
    path: "/wechat/set/index",
    name: "wechat-set-index",
    component: () => import("@/pages/wechat/set/index.vue"),
    meta: {
      withMenu: true,
      ignoreCollapseMenu: false,
    }
  }
]
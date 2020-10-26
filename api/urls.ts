const urls: any = {
  ACCOUNT: "account", // 用户列表
  GET_WX_AUTH_URL: "wechat/auth/goto_auth_url", // 获取微信授权url
  SAVE_AUTH_CODE: "wechat/auth/jump", // 保存授权后的auth_code
  GET_AUTH_INFO: "wechat/get_authorizer_info", // 获取授权信息
  GET_CHAT_MENU: "wechat/menu/1233456/selfMenus", // 获取微信目录
  CREATE_CHAT_MENU: "/wechat/menu/createMenu", // 获取微信目录
  GET_NEWS_INFOS: "/wechat/materials/materialNewsInfo/list", // 获取微信图文素材
  GROUP_URL: "/bloc", // 集团
  COMPANY_AGENT_LIST: "dealer/bloc", // 集团经销商列表
  FACTORY_AGENT_LIST: "dealer", // 主机厂经销商列表

  // car series
  AUTH_LIST: "vehicle/authorization/list", // 授权列表  admin api
  SAVE_AUTH: "vehicle/authorization/save", // 授权 admin api
  GET_AUTH_SERIES: "vehicle/series/enableAndAuthorizationSeries", // 获取已上架的车系

  GET_AUTH_SERIES_AND_MODELS: "vehicle/model/filteredSeriesWithModel", // 获取已上架的车型

  // sys setting
  SAVE_SYS_OTHER_SETTING: "dealer/profile/other", // 经销商其他设置
  DISABLE_TEM_MSG: "wechat/messages/forbidTemplateMsg", // 经销商禁用模版消息
  ENABLE_TEM_MSG: "wechat/messages/getTemplateId", // 经销商启用模版消息
  GET_TEM_LIST: "wechat/messages/getTemplateList", // 经销行获取模版消息列表
  WECHAT_APY: 'payment/config', // 微信支付设置
  RESCUE_LIST:'dealer/dealerRescue',// 救援设置列表
  RESCUE_SAVE:'dealer/dealerRescue',// 新增救援设置


  // coupon
  COUPONS: "campaign/coupon", // 优惠券
  DISABLE_COUPON: "campaign/coupon/enable{/id}", // 优惠券奖品停用
  REMOVE_COUPON: "campaign/coupon/remove{/id}", // 删除
  CHECK_COUPON: "campaign/coupon/use{/code}", // 核销
  ADD_STOCK_COUPON: "campaign/coupon/addStock", // 增加库存
  COUPON_BASEINFO: "campaign/coupon/basicInfo{/id}", // 优惠券基本信息
  AWARD_USE_SITUATION: "campaign/coupon/usedSituation", // 奖品使用情况(优惠券和实物奖品通用)
  AWARD_STATISTIC: "campaign/coupon/usedStatistics{/id}", // 奖品统计(优惠券和实物奖品通用)
  PRODUCTS_LIST: '/product/spus/sale', // 查询已上架商品

  // coupon
  PRIZE: "campaign/prize", // 实物奖品
  DISABLE_PRIZE: "campaign/prize/enable{/id}", // 实物奖品停用
  ADD_STOCK_PRIZE: "campaign/prize/addStock", // 增加库存
  PRIZE_BASEINFO: "campaign/prize/basicInfo{/id}", // 基本信息
  CHECK_CODE_LIST: 'campaign/coupon/prize_check_info', // 奖品验券
  QUERY_INFO_BY_CODE: 'campaign/coupon/prize_info{/code}', // 通过核销码查询奖品信息
  RELEASE_LIST: 'campaign/prize/winning_list', // 奖品发放列表（主机厂）

  COLUMNS: "article_column", // 栏目
  COLUMN: "article_column{/id}", // 栏目

  VIDEOS: "material/video",
  VIDEO_GROUP: "material/video/group", // 视频分组

  METERIAL_IMAGES: "material/image",
  METERIAL_IMAGES_GROUP: "material/image/group", // 图片分组

  MATERIAL_GROUP: "material/group",
  MATERIAL_GROUP_ITEM: "material/group{/id}",

  MATERIAL_ARTICLES: "material/article", // 图文素材
  MATERIAL_ARTICLE: "material/article{/id}", // 图文素材
  MATERIAL_ARTICLE_GROUP: "material/article/group", // 图文素材分组

  ARTICLE_LIST: "article/backend", // 文章列表
  ARTICLE_DETAIL: "article/base/detail{/id}", // 文章详情

  AGENT_PUBLISH_ARTICLE: "article/dealer/publish", // 发布文章-经销商
  COMPANY_PUBLISH_ARTICLE: "article/bloc/publish", // 发布文章-集团
  FACTORY_PUBLISH_ARTICLE: "article/manufacturer/publish", // 发布文章-主机厂
  ACTIVITY_LIST: "campaign/common/released", // 获取经销商投放的活动列表

  COUNT_BLOC_DEALER: "material/count/findBloc4DealerMaterialCount", // 集团-经销商素材统计
  COUNT_BLOC: "material/count/findBlocMaterialCount", // 集团素材统计
  COUNT_DEALER: "material/count/findDealerMaterialCount", // 经销商素材统计
  COUNT_FACTORY_BLOC: "material/count/findMf4BlocMaterialCount", // 主机厂-集团素材统计
  COUNT_FACTORY_DEALER: "material/count/findMf4DealerMaterialCount", // 主机厂-经销商素材统计
  COUNT_FACTORY: "material/count/findMfMaterialCount", // 主机厂素材统计
  ADVISER_LIST: "account", // 顾问列表
  SYNV_ADVISER: 'adviser/syncAdviser', // 同步顾问
  ACTIVITY_TEMPLATES: 'campaign/tool_template', // 活动模版列表
  ACTIVITY_TEMPLATES_EDIT: 'campaign/tool_template{/id}', // 模板编辑
  POSTS_LIST: 'adviser/posts', // 岗位列表
  RELEASE_PRIZE: 'logistics/prize', // 发货
  LOGISTICS_LIST: 'logistics/getAllLogisticsCompany',
  LOGISTICS_DETAIL: 'logistics/getLogisticsData', // 物流详情
};

export default urls;

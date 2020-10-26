import service from "../axios";

const adminPrefix = process.env.VUE_APP_API_VERSION;
const imPrefix = process.env.VUE_APP_IM;
import { numToUppercase, toDivide } from "@/utils/";

/**
 * 获取主机厂经销商
 * @param paramsd
 */
const getFactoryDealer = (params: any) => {
  let url = `${adminPrefix}dealer`;
  return service.get(url, {
    params
  });
};
/**
 * 保存主机厂集团抽奖活动
 * @param data
 * @param mode
 */
const saveFactoryLottery = (data: any, mode: string) => {
  let urlMap: any = {
    hosted: `${adminPrefix}campaign/luckydraw/sponsored`,
    put: `${adminPrefix}campaign/luckydraw/template`
  };
  let url = urlMap[mode];
  return service.post(url, data);
};

/**
 * 获取抽奖活动详情
 * @param params
 * @param sysPlat
 */
const getLotteryDetail = (params: any, sysPlat: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaign/luckydraw/detail`,
    company: `${adminPrefix}campaign/luckydraw/template_detail`,
    factory: `${adminPrefix}campaign/luckydraw/template_detail`,
    hosted: `${adminPrefix}campaign/luckydraw/detail`
  };
  let url = urlMap[sysPlat];
  return service.get(url, { params });
};

const getActivityStatics = (params: any) => {
  let url = `${adminPrefix}campaign/common/stats/chart`;
  return service.get(url, { params });
};

/**
 * 获取 促销编辑详情
 * @param params
 * @param sysPlat
 */
const getEditSaleDetail = (params: any, sysPlat: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaigns/groupon/view/dealer`,
    company: `${adminPrefix}campaigns/groupon/view`,
    factory: `${adminPrefix}campaigns/groupon/view`
  };
  let url = urlMap[sysPlat];
  return service.get(url, {
    params
  });
};

/**
 * 获取团购详情
 * @param params
 * @param key
 */
const getSaleDetail = (params: any, key: string) => {
  let { releaseId } = params;
  let urlMap: any = {
    agent: `${adminPrefix}campaigns/groupon/view/dealer`,
    company: `${adminPrefix}campaigns/groupon/view/release`,
    factory: `${adminPrefix}campaigns/groupon/view/release`
  };
  let url = urlMap[key];
  return service.get(url, { params });
};
const getGrouponDetail = (params: any) => {
  let { releaseId } = params;
  return service.get(`${adminPrefix}campaigns/groupon/detail/${releaseId}`);
};
/**
 * 编辑抽奖活动
 * @param data
 * @param key
 */
const editLotteryActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaign/luckydraw/edit`,
    company: `${adminPrefix}campaign/luckydraw/template_edit`,
    factory: `${adminPrefix}campaign/luckydraw/template_edit`,
    hosted: `${adminPrefix}campaign/luckydraw/edit`
  };
  let url = urlMap[key];
  return service.post(url, data);
};
/**
 * 保存抽奖活动
 * @param data
 * @param key
 */
const saveLotteryActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaign/luckydraw`,
    company: `${adminPrefix}campaign/luckydraw/template`,
    factory: `${adminPrefix}campaign/luckydraw/template`,
    hosted: `${adminPrefix}campaign/luckydraw/sponsored`
  };
  let url = urlMap[key];
  return service.post(url, data);
};
/**
 * 编辑促销活动
 * @param data
 * @param key
 */
const editSalesActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaigns/groupon/dealers`,
    company: `${adminPrefix}campaigns/groupon`,
    factory: `${adminPrefix}campaigns/groupon`
  };
  let url = urlMap[key];
  return service.put(url, data);
};
/**
 * 保存促销活动
 * @param data
 * @param key
 */
const saveSalesActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaigns/groupon/dealers`,
    company: `${adminPrefix}campaigns/groupon`,
    factory: `${adminPrefix}campaigns/groupon`
  };
  let url = urlMap[key];
  return service.post(url, data);
};
/**
 * 编辑线下活动
 * @param data
 * @param key
 */
const editSiteActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaign/offline_event`,
    company: `${adminPrefix}campaign/offline_event/template`,
    factory: `${adminPrefix}campaign/offline_event/template`,
    hosted: `${adminPrefix}campaign/offline_event`
  };
  let url = urlMap[key];
  return service.put(url, data);
};
/**
 * 保存线下活动
 * @param data
 * @param key
 */
const saveSiteActive = (data: any, key: string) => {
  let urlMap: any = {
    agent: `${adminPrefix}campaign/offline_event`,
    company: `${adminPrefix}campaign/offline_event/template`,
    factory: `${adminPrefix}campaign/offline_event/template`,
    hosted: `${adminPrefix}campaign/offline_event/sponsored`
  };
  let url = urlMap[key];
  return service.post(url, data);
};
/**
 * 获取线下活动详情
 * @param params
 */
const getSiteDetail = (params: any) => {
  let url = `${adminPrefix}campaign/offline_event/dealer_details`;
  return service.get(url, { params });
};
const getSiteStatics = (params: any) => {
  let url = `${adminPrefix}campaign/offline_event/statics/${params.releaseId}`;
  return service.get(url, { params });
};

/**
 * 投放活动
 * @param params
 */
const putInActive = (params: any) => {
  let { activeType, id, data } = params;
  let urlMap: any = {
    lottery: `${adminPrefix}campaign/luckydraw/release/${id}`,
    sales: `${adminPrefix}campaigns/groupon/release`,
    site: `${adminPrefix}campaign/offline_event/release/${id}`
  };
  let url = urlMap[activeType];
  return service.post(url, data);
};

/**
 * 取消投放
 * @param data
 */
const cancelPut = (data: any) => {
  let url = `${adminPrefix}campaign/common/remove_campaign/${data.id}`;
  return service.delete(url);
};
/**
 * 取消团购活动投放
 * @param data
 */
const cancelSalesPut = (data: any) => {
  let url = `${adminPrefix}campaigns/groupon/release/cancel?releaseId=${data.releaseId}`;
  return service.post(url);
};
/**
 * 下发活动
 * @param params
 */
const issuedActive = (params: any) => {
  let { activeType, id, data } = params;
  let urlMap: any = {
    lottery: `${adminPrefix}campaign/luckydraw/issue/${id}`,
    site: `${adminPrefix}campaign/offline_event/issue/${id}`,
    sales: `${adminPrefix}campaigns/groupon/issue?campaignId=${id}`
  };
  let url = urlMap[activeType];
  return service.post(url, data);
};

/**
 * 投放主机厂自办活动
 * @param params
 */
const putHostedActive = (params: any) => {
  let { campaignCode, data } = params;
  let url = `${adminPrefix}campaign/common/sponsored/release/${campaignCode}`;
  return service.post(url, {
    dealerCodeList: data
  });
};
/**
 * 取消下发
 * @param params
 */
const cancelIssuedActive = (params: any) => {
  let { activeType, releaseId } = params;
  let url = `${adminPrefix}campaign/common/cancel/${releaseId}`;
  return service.delete(url);
};

/**
 * 审核通过
 * @param data
 */
const approvalActive = (data: any) => {
  let { id } = data;
  let url = `${adminPrefix}campaign/common/approval/${id}`;
  return service.put(url);
};
/**
 * 审批驳回
 * @param data
 */
const rejectActive = (data: any) => {
  let { id } = data;
  let url = `${adminPrefix}campaign/common/reject/${id}`;
  return service.put(url);
};
/**
 * 删除活动
 * @param data
 */
const deleteActive = (data: any) => {
  let { id, releaseId, activeType } = data;
  let urlMap: any = {
    lottery: `${adminPrefix}campaign/common/remove_campaign/${releaseId}`,
    site: `${adminPrefix}campaign/common/remove_campaign/${releaseId}`,
    sales: `${adminPrefix}campaigns/groupon/dealer?campaignId=${id}`
  };
  let url = urlMap[activeType];
  return service.delete(url);
};
const deleteHostedActive = (data: any) => {
  let { releaseId, activeType } = data;
  let urlMap: any = {
    lottery: `${adminPrefix}campaign/luckydraw/sponsored/${releaseId}`,
    site: `${adminPrefix}campaign/offline_event/sponsored/${releaseId}`
  };
  let url = urlMap[activeType];
  return service.delete(url);
};
/**
 * 集团和主机厂删除活动
 * @param data
 */
const deleteFactoryActive = (data: any) => {
  let { id, activeType, activeItem } = data;
  let urlMap: any = {
    lottery: {
      company: `${adminPrefix}campaign/luckydraw/company?campaignId=${data.id}`,
      factory: `${adminPrefix}campaign/luckydraw/main_factory?campaignId=${data.id}`
    },
    site: {
      company: `${adminPrefix}campaign/offline_event/main_factory?campaignId=${data.id}`,
      factory: `${adminPrefix}campaign/offline_event/main_factory?campaignId=${data.id}`
    },
    sales: {
      company: `${adminPrefix}campaigns/groupon?campaignId=${id}`,
      factory: `${adminPrefix}campaigns/groupon?campaignId=${id}`
    }
  };
  let url = urlMap[activeType][activeItem];
  return service.delete(url);
};
/**
 * 终止活动
 * @param data
 */
const stopActive = (data: any) => {
  let url = `${adminPrefix}campaign/common/termination/${data.releaseId}`;
  return service.put(url);
};
/**
 * 获取下发详情
 * @param params
 */
const getIssuedDetail = (params: any) => {
  let url = `${adminPrefix}campaign/common/template/${params.id}`;
  return service.get(url);
};

/**
 * 获取已上价的车系车型
 */
const getSeriesModelList = () => {
  let url = `${adminPrefix}vehicle/model/filteredSeriesWithModel`;
  return service.get(url);
};
const getCarSeries = (brandCode: any) => {
  let params = {
    brandCode,
    page: 1,
    size: 9999
  };
  let url = `${adminPrefix}vehicle/series/enableAndAuthorizationSeries`;
  return service.get(url, {
    params
  });
};

/**
 * 获取奖品设置列表
 * @param params
 */
const getPriceList = (params: any) => {
  let { id, activeType } = params;
  let urlMap: any = {
    lottery: `${adminPrefix}campaign/luckydraw/get_prize/${id} `,
    site: `${adminPrefix}campaign/offline_event/get_prize/${id} `
  };
  let url: string = urlMap[activeType];
  return service.get(url);
};
/**
 * 获取留言列表
 * @param params
 */
const getMessageList = (params: any) => {
  let url = `${imPrefix}group/history`;
  // params.groupId = encodeURIComponent(params.groupId);
  // console.log(params.groupId);
  return service.get(url, { params });
};
/**
 * 优惠券核销
 * @param code
 */
const useCoupon = (code: any) => {
  let url = `${adminPrefix}campaign/coupon/use/${code}`;
  return service.put(url);
};
const checkActiveTime = (params: any) => {
  let url = `${adminPrefix}campaign/common/check/valid_date`;
  return service.get(url, { params });
};
const getDealerInfo = (params: any) => {
  let url = `${adminPrefix}dealer/baseInfoLis`;
  return service.get(url, { params });
};

/**
 * 经销商获取线下活动签到信息
 */
export function signList(releaseId: string) {
  const url = `${adminPrefix}campaign/offline_event/${releaseId}/sign/list`;
  return service.get(url);
}
/**
 * 经销商线下活动抽奖
 */
export function campaignLuckyDraw(params: any) {
  const url = `${adminPrefix}campaign/offline_event/luck_draw`;
  return service.get(url, { params });
}
/**
 * 经销商线下活动抽奖名单
 */
export function campaignWinner(params = {}) {
  const url = `${adminPrefix}campaign/common/stats/winner`;
  params = { ...params, page: 1, size: 999 };
  return service.get(url, { params });
}

/**
 * 记录分享链接
 * @param id
 */
const shareLinkRecord = (id: any) => {
  let url = `${adminPrefix}campaign/common/templates/${id}/record_share_link_copied`;
  return service.post(url);
};
/**
 * 记录下载海报
 * @param id
 */
const downloadRecord = (id: any) => {
  let url = `${adminPrefix}campaign/common/templates/${id}/record_share_poster_downloaded`;
  return service.post(url);
};
export {
  getLotteryDetail,
  getSiteDetail,
  stopActive,
  putInActive,
  cancelPut,
  cancelSalesPut,
  issuedActive,
  putHostedActive,
  cancelIssuedActive,
  deleteActive,
  deleteHostedActive,
  approvalActive,
  rejectActive,
  getFactoryDealer,
  getIssuedDetail,
  getEditSaleDetail,
  deleteFactoryActive,
  getSeriesModelList,
  checkActiveTime,
  getCarSeries,
  getActivityStatics,
  getPriceList,
  getSaleDetail,
  getGrouponDetail,
  getMessageList,
  useCoupon,
  getDealerInfo,
  shareLinkRecord,
  downloadRecord,
  editLotteryActive,
  saveLotteryActive,
  editSalesActive,
  saveSalesActive,
  editSiteActive,
  saveSiteActive
};

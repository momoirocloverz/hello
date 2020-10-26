import service from "@/api/axios";
const adminPrefix = process.env.VUE_APP_API_VERSION;
/**
 * 获取活动概览
 */
const getCampaignStatistics = (params: any) => {
  let url = `${adminPrefix}campaign/statistics`;
  return service.get(url, { params });
};
/**
 * 获取营销概览柱状图
 */
const getCampaignStatisticsBar = (params: any) => {
  let url = `${adminPrefix}campaign/statistics/histogram`;
  return service.get(url, { params });
};
/**
 * 获取实时概览统计信息
 */
export const actualStatisticCount = (params = {}) => {
  let url = `${adminPrefix}statistic`;
  return service.get(url, { params });
};
/**
 * 获取实时概览柱状图
 */
export const getStatisticsMap = (params = {}) => {
  let url = `${adminPrefix}statistic/getStatisticsMap`;
  return service.get(url, { params });
};
/**
 * 获取试驾车型排行
 */
export const getTestDriveTop = (params = {}) => {
  let url = `${adminPrefix}testDriveApi/getTestDriveTop`;
  return service.post(url, params);
};
/**
 * 获取预订车型排行
 */
export const prePurchaseRank = (params = {}) => {
  let url = `${adminPrefix}prePurchase/ranking`;
  return service.get(url, { params });
};
/**
 * 主机厂实时概览
 */
export const manufacturerCount = (params = {}) => {
  let url = `${adminPrefix}manufacturer/count/data`;
  return service.get(url, { params });
};



const getFansStatisticsBar = (params = {}, sysPlat: any) => {
  let urlMap: any = {
    agent: `${adminPrefix}member/by/dealer/fansStatis`,
    factory: `${adminPrefix}member/by/factory/fansStatis`
  };
  let url = urlMap[sysPlat];
  return service.get(url, { params });
};
const getGuestStatisticsBar = (params = {}, sysPlat: any) => {
  let urlMap: any = {
    agent: `${adminPrefix}member/by/dealer/qcStatis`,
    factory: `${adminPrefix}member/by/factory/qcStatis`
  };
  let url = urlMap[sysPlat];
  return service.get(url, { params });
};
export { getCampaignStatistics, getCampaignStatisticsBar, getFansStatisticsBar, getGuestStatisticsBar };

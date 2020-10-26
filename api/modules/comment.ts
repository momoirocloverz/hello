import service from "../axios";
const adminPrefix = process.env.VUE_APP_API_VERSION;
/**
 * 获取评价统计
 * @param params
 */
export const getCommentStatistic = (params: any) => {
  let url = `${adminPrefix}comment/getCommentStatistic`;
  return service.get(url, { params });
};
/**
 * 获取评价详情
 * @param params
 */
export const getCommentDetail = (params: any) => {
  let { id } = params;
  let url = `${adminPrefix}comment/getComment/${id}`;
  return service.get(url);
};
/**
 * 通过/拒绝评价
 * @param data
 */
export const approveComment = (data: any) => {
  let { ids, status } = data;
  let url = `${adminPrefix}comment/approveComment?ids=${ids}&&status=${status}`;
  return service.post(url);
};

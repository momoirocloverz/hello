import service from "@/api/axios";
const adminPrefix = process.env.VUE_APP_API_VERSION;

/**
 * 创建救援
 * @param data
 */
const createRescue = (data: any) => {
  let url = `${adminPrefix}dealer/dealerRescue`;
  return service.post(url, data);
};
const getRescue = (params: any) => {
  let url = `${adminPrefix}dealer/dealerRescue`;
  return service.get(url, { params });
};
export { getRescue, createRescue };

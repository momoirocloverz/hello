// eslint-disable-next-line
import { AxiosRequestConfig } from "axios";
import service from "../axios";

const prefix = process.env.VUE_APP_API_IM;

const IM_GET = (url: string, params = {},config?: AxiosRequestConfig) => service.get(`${prefix}${url}`, { params, ...config });
const IM_POST = (url:string, param = {}, config?: AxiosRequestConfig) => service.post(`${prefix}${url}`, param, config);


/**
 *  @description 客户管理-潜客详情-沟通记录
 * */ 
// 获取聊天时间段
export function im_history_date_api(params = {}, config = {}){
  return IM_GET('historyDate',params, config)
}
// 根据时间查询聊天内容
export function im_history_list_api(params = {}, config = {}){
  return IM_GET('history',params, config)
}
// eslint-disable-next-line
import { AxiosRequestConfig } from "axios";
import service from "../axios";
import qs from 'qs'
const prefix = process.env.VUE_APP_API_VERSION; //  = /gmp/admin/api/v1/
const VHICLE_GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const VHICLE_POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const VHICLE_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const VHICLE_DELETE = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.delete(prefix + url, { params }, config);

// 主机厂车系亮点设置
export function seriesHighlights(params = {}, config = {}) {
  return VHICLE_POST("vehicle/series/highlights", params, config);
}
// 获取主机厂车系亮点
export function getSeriesHighlights(seriesCode: string, config = {}) {
  return VHICLE_GET(`vehicle/series/highlights/${seriesCode}`, {}, config);
}
// 主机厂查看车系详情页
export function getSeriesDetail(seriesCode: string, config = {}) {
  return VHICLE_GET(`vehicle/series/highlights1/${seriesCode}`, {}, config);
}
// 重复名称
export function isRepeatSeriesName(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/series/validateSeriesName`, params, config);
}
// 主机厂查看车系详情
export function detailForMainFactory(params: any, config = {}) {
  return VHICLE_GET(`vehicle/series/detailForMainFactory/${params.seriesCode}`, {}, config);
}
// 经销商查看车系详情
export function detailForDealer(params: any, config = {}) {
  return VHICLE_GET(`vehicle/series/detailForDealer/${params.seriesCode}`, {}, config);
}
// 经销商获取初始订金
export function getDeposit(params = {}, config = {}) {
  return VHICLE_GET(`dealer/dealer/deposit`, params, config);
}
// 经销商获取初始订金
export function setDeposit(params = {}, config = {}) {
  return VHICLE_POST(`dealer/dealer/deposit`, params, config);
}
// 经销商获取初始订金
export function validateExternalCode(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/series/validateExternalCode`, params, config);
}
// 根据经销商ID获取大区和事业部
export function dealer_buRegId_api(params = {}, config = {}) {
  return VHICLE_GET(`dealer/buRegId`, params, config);
}
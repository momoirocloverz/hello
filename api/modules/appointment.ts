import { AxiosRequestConfig } from "axios";
import service from "../axios";
const prefix = process.env.VUE_APP_API_VERSION;
const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const USER_POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const USER_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const USER_DELETE = (url: string, config?: AxiosRequestConfig): any =>
  service.delete(prefix + url, config);
// 获取预订列表
export function prePurchase(params = {}, config = {}) {
  return USER_GET("prePurchase", params, config);
}
// 预约试驾列表
export function testDriveList(params = {}, config = {}) {
  return USER_POST("testDriveApi", params, config);
}
// 核销码获取订单详情
export function getOrderDetailByCdkey(params = {}, config = {}) {
  return USER_GET("order/getOrderDetailByCdkey", params, config);
}
// 核销订单券码
export function gverifyCdkey(params: any, config = {}) {
  return USER_PUT(`order/verifyCdkey?cdkey=${params.cdkey}`, config);
}
// 商家获取售后订单详情
export function agentAfterSaleDetail(afterSaleOrderId: number, config = {}) {
  return USER_GET(`aftersale/order/${afterSaleOrderId}`, config);
}
export function factoryAfterSaleDetail(afterSaleOrderId: number, config = {}) {
  return USER_GET(`aftersale/order/manufactor/${afterSaleOrderId}`, config);
}
// 售后订单处理
export function afterSaleDeal(params = {}, config = {}) {
  return USER_POST("aftersale/order", params, config);
}
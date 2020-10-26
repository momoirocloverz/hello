// eslint-disable-next-line
import { AxiosRequestConfig } from "axios";
import service from "../axios";
const prefix = process.env.VUE_APP_API_VERSION; //  = /gmp/admin/api/v1/
const GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const DELETE = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.delete(prefix + url, { params }, config);

export function orderList(params = {}, config = {}) {
  return POST('order/list', params, config)
}
export function getOrderDetail(orderId: string, params = {}, config = {}) {
  return GET(`order/${orderId}`, params, config)
}
export function updateDeliveryInfo(params = {}, config = {}) {
  return PUT(`order/updateDeliveryInfo`, params, config)
}
export function createOrderRemark(params = {}, config = {}) {
  return POST(`order/createOrderRemark`, params, config)
}
// 发货
export function logisticsOrder(params = {}, config = {}) {
  return POST(`logistics/order`, params, config)
}
export function getAllLogisticsCompany(params = {}, config = {}) {
  return GET(`logistics/getAllLogisticsCompany`, params, config)
}
export function isInAfterSale(orderNo: string, params = {}, config = {}) {
  return GET(`aftersale/order/list/${orderNo}`, params, config)
}
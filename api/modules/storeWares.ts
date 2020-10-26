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

export function addProduct(params = {}, config = {}) {
  return POST('product/', params, config)
}
export function getProductDetail(id: string, config = {}) {
  return GET(`product/${id}`, {}, config)
}
export function modifyProductDetail(params = {}, config = {}) {
  return PUT(`product/edit`, params, config)
}
// countSpu 查询自建商品已上架数量 
// 下架的就用查列表的时候返回的总数减一下就行了，这两个不好合并。
export function countSpu(params = {}, config = {}) {
  return GET(`product/countSpu`, params, config)
}
// countManufactorSpu 查询主机厂商品已上架数量  查询格式和查询商品列表是一样的。
export function countManufactorSpu(params = {}, config = {}) {
  return GET(`product/countManufactorSpu`, params, config)
}
export function editStock(spuId: string, params = {}, config = {}) {
  return PUT(`product/editStock?id=${spuId}`, params, config)
}
export function warePriceInfo(spuId: string, params = {}, config = {}) {
  return GET(`product/sku/${spuId}`, params, config)
}
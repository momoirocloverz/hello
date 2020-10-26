import service from "../axios";
import { paramGroup } from "@/pages/goods/const/params-config";
const adminPrefix = process.env.VUE_APP_API_VERSION;

// 内部资讯概览
export const articleInternalAll = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/all/${articleDetailId}`;
  return service.get(url, { params });
};
// 内部资讯使用数据记录
export const articleInternalSumary = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/${articleDetailId}`;
  return service.get(url, { params });
};
// 商城资讯顾问使用数据记录
export const articleAgentAdviser = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/shop/adviser/${articleDetailId}`;
  return service.get(url, { params });
};
// 商城资讯概览
export const articleShopAll = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/shop/all/${articleDetailId}`;
  return service.get(url, { params });
};
// 商城资讯客户使用数据记录
export const articleAgentCustomer = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/shop/customer/${articleDetailId}`;
  return service.get(url, { params });
};

// 主机厂文章统计
export const articleMfAll = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/mf/all/${articleDetailId}`;
  return service.get(url, { params });
};
// 主机厂文章统计-主机厂详细
export const articleMfFactory = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/mf/${articleDetailId}`;
  return service.get(url, { params });
};
// 主机厂文章统计-经销商详细
export const articleMfDealer = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/mf/dealer/${articleDetailId}`;
  return service.get(url, { params });
};
// 主机厂文章统计-集团详细
export const articleMfBloc = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/mf/bloc/${articleDetailId}`;
  return service.get(url, { params });
};

// 集团文章统计 总计
export const articleBlocAll = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/bloc/all/${articleDetailId}`;
  return service.get(url, { params });
};
// 集团文章统计 - 集团总计
export const articleBloc = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/bloc/${articleDetailId}`;
  return service.get(url, { params });
};
// 集团文章统计 - 经销商总计
export const articleBlocDealer = (articleDetailId: string, params = {}) => {
  let url = `${adminPrefix}article/detail/data/internal/detail/bloc/dealer/${articleDetailId}`;
  return service.get(url, { params });
};

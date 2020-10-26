import { AxiosRequestConfig } from "axios";
import service from "../axios";
const prefix = process.env.VUE_APP_API_VERSION;
const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const USER_POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const USER_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const USER_DELETE = (url: string, config?: AxiosRequestConfig): any => service.delete(prefix + url, config);
// 获取集团列表
export function blocList(params = {}, config = {}) {
  return USER_GET("bloc", params, config);
}
// 事业部和区域
export function bunRegion(config = {}) {
  return USER_GET("dealer/bu2Region", { buCodeList: "" }, config);
}
// 列表
export function dealerList(params = {}, config = {}) {
  return USER_GET("dealer", params, config);
}
export function dealerListNew(params = {}, config = {}) {
  return USER_GET("dealer/new", params, config);
} // 集团下经销商列表
export function blocDealerList(params = {}, config = {}) {
  return USER_GET("dealer/bloc", params, config);
}
export function blocDealerListNew(params = {}, config = {}) {
  return USER_GET("dealer/bloc/new", params, config);
} // 开启经销商
export function openDealer(params = {}, config = {}) {
  return USER_PUT("dealer/enable", params, config);
}
// 冻结
export function freezeDaeler(dealerCode: string, config = {}) {
  return USER_PUT(`dealer/disable`, { dealerCode }, config);
}
// 重置密码
export function dealerRestPwd(dealerCode: string, config = {}) {
  return USER_PUT(`dealer/${dealerCode}/resetPwd`, config);
}
// 主机厂获取顾问评价标签
export function labelGroup_getLabelGroups_api(params = {}, config = {}) {
  return USER_POST("comment/labelGroup/getLabelGroups", params, config);
}
// 主机厂新增标签组
export function labelGroup_create_api(params = {}, config = {}) {
  return USER_POST("comment/labelGroup/create", params, config);
}
// 主机厂新增标签
export function label_create_api(params = {}, config = {}) {
  return USER_POST("comment/label/create", params, config);
}
// 主机厂删除标签组
export function label_deleteGroup_api(id: number | string) {
  return USER_DELETE(`comment/labelGroup/${id}`);
}
// 主机厂删除标签
export function label_delete_api(id: number | string) {
  return USER_DELETE(`comment/label/${id}`);
}
// // 主机厂更新标签组
export function label_editGroup_api(params = {}, config = {}) {
  return USER_PUT("comment/labelGroup/edit", params, config);
}

export function dealerAllBu(params = {}, config = {}) {
  return USER_GET("dealer/allBu", params, config);
}
export function bu2Region(params = {}, config = {}) {
  return USER_GET("dealer/bu2Region?buCodeList=", params, config);
}
// 获取经销商系统设置信息
export function dealerInfo(params = {}, config = {}) {
  return USER_GET("dealer/profile", params, config);
}
// 设置经销商系统信息
export function setDealerInfo(params = {}, config = {}) {
  return USER_POST("dealer/profile", params, config);
}
// 顾问详情
export function getAdviserDetail(id: string, config = {}) {
  return USER_GET(`adviser/${id}`, {}, config);
}

// 操作列表
export function operationLog(params = {}, config = {}) {
  return USER_GET("operation_log", params, config);
}
// 资讯
export function articleList(params = {}, config = {}) {
  return USER_GET("article/detail", params, config);
}
// 资讯详情
export function articleDetail(id: number, config = {}) {
  return USER_GET(`article/detail/${id}`, config);
}
// 资讯详情
export function sysMessage(params = {}, config = {}) {
  return USER_GET(`sys_message`, params, config);
}
// 阅读消息
export function readMsg(id: number, config = {}) {
  return USER_PUT(`sys_message/${id}`, config);
}
// 未读消息数
export function unReadMsg(config = {}) {
  return USER_GET(`sys_message/unread/count`, config);
}
// 阅读资讯
export function readSysMsg(id: number, config = {}) {
  return USER_POST(`article/detail/read/${id}`, config);
}
// 顾问文章分享列表
export function articleShareList(params: any, config = {}) {
  return USER_GET(`article/user_record/mall/${params.id}`, params, config);
}
// 文章详情
export function articleBaseDetail(id: number, config = {}) {
  return USER_GET(`article/base/detail/${id}`, config);
}
// 同步经销商
export const syncDealer = () => {
  let url = `${prefix}dealer/syncDealer`;
  return service.get(url);
};
/**
 * 获取
 * @param params
 */
export const getBu2Region = (params: any) => {
  let url = `${prefix}dealer/bu2Region`;
  return service.get(url, { params });
};
export const getBu2RegionAll = () => {
  let url = `${prefix}dealer/allBu2`;
  return service.get(url);
};
/**
 * 绑定经销商列表
 * @param data
 */
export const bindDealerList = (data: any) => {
  let url = `${prefix}bloc/dealer`;
  return service.post(url, data);
};

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


// 获取菜单
export function access_getUserAc_menu_api(params = {}, config = {}) {
  return VHICLE_POST("access/getUserAc", params, config);
}

// 车型亮点管理页
export function highlightsList(params = {}, config = {}) {
  return VHICLE_GET("vehicle/highlights/list", params, config);
}
export function highlightsCreate(params = {}, config = {}) {
  return VHICLE_POST("vehicle/highlights/create", params, config);
}
export function highlightsEdit(params = {}, config = {}) {
  return VHICLE_PUT("vehicle/highlights/edit", params, config);
}
export function highlightsDelete(id: string) {
  return VHICLE_DELETE(`vehicle/highlights/${id}`);
}
// 主机厂车型管理页，车系相关
export function addSerie(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/series`, params, config);
}
export function modifySerie(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/series`, params, config);
}
export function seriesBrandCode(brandCode: string, config = {}) {
  return VHICLE_GET(`vehicle/series/${brandCode}`, {}, config);
}
export function getPriceRule(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/rule`, params, config);
}
export function addPriceRule(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/rule`, params, config);
}
export function modifyPriceRule(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/rule`, params, config);
}
export function getPriceRuleById(ruleId: string, config = {}) {
  return VHICLE_GET(`vehicle/rule/${ruleId}`, {}, config);
}
export function removeRuleById(ruleId: string, config = {}) {
  return VHICLE_DELETE(`vehicle/rule/${ruleId}`, {}, config);
}
export function serieDiscontinuation(seriesCode: string, config = {}) {
  return VHICLE_PUT(`vehicle/series/${seriesCode}/discontinuation`, {}, config);
}
export function serieEnabling(seriesCode: string, config = {}) {
  return VHICLE_PUT(`vehicle/series/${seriesCode}/enabling`, {}, config);
}
export function modelBySeriesCode(seriesCode: string, params = {}, config = {}) {
  return VHICLE_GET(`vehicle/model/${seriesCode}`, params, config);
}
export function modelByTwoCode(dealerCode: string, seriesCode: string, config = {}) {
  return VHICLE_GET(`vehicle/model/${dealerCode}/${seriesCode}`, {}, config);
}
// 主机厂销量标签
export function tagList(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/tag/list`, params, config);
}
export function tagCreate(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/tag/create`, params, config);
}
export function tagEdit(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/tag/edit`, params, config);
}
export function tagDelete(params = {}) {
  return VHICLE_POST(`vehicle/tag/delete`, params);
}
export function checkIsRepeat(params = {}) {
  return VHICLE_GET(`vehicle/tag/isRepeat`, params);
}
// 车型新增、编辑
export function isRepeatModelName(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/model/validateModelName`, params, config);
}
export function vehicleConfig(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/config`, params, config);
}
export function vehicleConfigByModel(modelCode: string, config = {}) {
  return VHICLE_GET(`vehicle/config/values/${modelCode}`, {}, config);
}
export function modifyConfigByModel(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/config/values`, params, config);
}
export function saveModelConfigGroups(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/config/groups`, params, config);
}

export function resourcesEdit(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/resources/edit`, params, config);
}
export function addNewVehicle(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/model`, params, config);
}
export function getModelBase(modelCode: string, config = {}) {
  return VHICLE_GET(`vehicle/model/base/${modelCode}`, {}, config);
}
export function modifyModelBase(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/model/base`, params, config);
}
export function getModelHighlight(modelCode: string, params = {}, config = {}) {
  return VHICLE_GET(`vehicle/model/highlights/${modelCode}`, params, config);
}
export function modifyModelHighlight(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/model/highlights`, params, config);
}
export function getSeriesHighlight(modelCode: string, params = {}, config = {}) {
  return VHICLE_GET(`vehicle/series/highlights/${modelCode}`, params, config);
}
export function modifySeriesHighlight(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/series/highlights`, params, config);
}
export function resourcesQuery(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/resources/query`, params, config);
}
// 主机厂上架车型
export function modelEnabling(modelCode: string, config = {}) {
  return VHICLE_PUT(`vehicle/model/${modelCode}/enablingModle`, {}, config);
}
// 主机厂下架车型
export function modelDiscontinuate(modelCode: string, config = {}) {
  return VHICLE_PUT(`vehicle/model/${modelCode}/discontinuationModle`, {}, config);
}
// 经销商上架车型
export function dealerEnabling(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/dealer/enablingModle`, params, config);
}
// 经销商下架车型
export function dealerDiscontinuate(params = {}, config = {}) {
  return VHICLE_DELETE(`vehicle/dealer/discontinuationModle`, params, config);
}
// 经销商价格设置
export function dealerUnitPrice(params = {}, config = {}) {
  return VHICLE_PUT(`vehicle/dealer/editUnitPrice`, params, config);
}
export function dealerModelsBySerie(seriesCode: string, config = {}) {
  return VHICLE_GET(`vehicle/model/${seriesCode}/dealer`, {}, config);
}
export function dealerSeriesByBrand(brandCode: string, config = {}) {
  return VHICLE_GET(`vehicle/series/${brandCode}/dealer`, {}, config);
}
export function getSeriesWithModel(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/model/getSeriesWithModel`, params, config);
}
// goods 特供 getModelListBySeries，可以删除了
export function getModelListBySeries(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/model/getModelListBySeries`, params, config);
}
export function applyLowPrice(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/rule/dealer`, params, config);
}
export function getlowPriceList(params = {}, config = {}) {
  return VHICLE_GET(`vehicle/rule/dealer`, params, config);
}
export function examinePriceApply(params: any = {}, config = {}) {
  return VHICLE_PUT(`vehicle/rule/dealer/apply?ruleId=${params.ruleId}&status=${params.status}`, {}, config);
}
export function examinePriceApproval(params: any = {}, config = {}) {
  return VHICLE_PUT(`vehicle/rule/dealer/approval?ruleId=${params.ruleId}`, {}, config);
}
export function examinePriceRejected(params: any = {}, config = {}) {
  return VHICLE_PUT(`vehicle/rule/dealer/rejected?ruleId=${params.ruleId}`, {}, config);
}
export function setSerieTags(params = {}, config = {}) {
  return VHICLE_POST(`vehicle/tag/vehucle/tags`, params, config);
}
export function dealerMaxRule(modelCode: string, config = {}) {
  return VHICLE_GET(`vehicle/rule/dealer/maxrule/${modelCode}`, {}, config);
}
export function dealerModelBase(modelCode: string, config = {}) {
  return VHICLE_GET(`vehicle/model/dealer/base/${modelCode}`, {}, config);
}


/**
 * @description 主机-潜客和粉丝
 */
export function member_by_factory_api(params = {}, config = {}) {
  return VHICLE_GET(`member/by/factory`, params, config);
}
// 详情
export function member_by_factory_detail_api(id: number | string) {
  return VHICLE_GET(`member/by/factory/${id}`);
}
/**
 * @description 经销商-潜客和粉丝
 */
export function member_by_dealer_api(params = {}, config = {}) {
  return VHICLE_GET(`member/by/dealer`, params, config);
}
// 详情
export function member_by_dealer_detail_api(id: number | string) {
  return VHICLE_GET(`member/by/dealer/${id}`);
}
// 获取粉丝统计-页面就是左边的粉丝列表
export function fans_count_api(params = {}, config = {}) {
  return VHICLE_GET(`fans/count`, params, config);
}
// 删除粉丝标签
export function member_label_delete_api(id: string | number, config = {}) {
  return VHICLE_DELETE(`member/label/${id}`, config);
}
// 创建粉丝标签
export function member_label_add_api(name: string, config = {}) {
  return VHICLE_POST(`member/label/${name}`, {}, config);
}
// 获取粉丝标签统计
export function memberLabelCount(params = {}, config = {}) {
  return VHICLE_GET(`member/label/count`, params, config);
}
// 绑定标签
export function memberLabelBind(params = {}, config = {}) {
  return VHICLE_PUT(`member/label/bind`, params, config);
}
export function changeMemberAdviser(params = {}, config = {}) {
  return VHICLE_PUT(`member/adviser`, params, config);
}
// 潜客详情-预约试驾
export function test_drive_api(params = {}, config = {}) {
  return VHICLE_POST(`testDriveApi`, params, config);
}
// 潜客详情-在线预定
export function test_prePurchase_api(params = {}, config = {}) {
  return VHICLE_GET(`prePurchase`, params, config);
}
// 潜客详情-收藏记录
export function getModelCollections_api(params = {}, config = {}) {
  return VHICLE_GET(`user/collections/getUserCollections`, params, config);
}
// 潜客详情-浏览记录
export function getModelUserBrowses_api(params = {}, config = {}) {
  return VHICLE_GET(`user/browseHistory/getModelUserBrowses`, params, config);
}
// 变更顾问
export function member_edit_adviser(params = {}, config = {}) {
  return VHICLE_PUT(`member/adviser`, params, config);
}

/**
 * @description 权限（经销商，集团，主机厂）
 */
// 新增权限组
export function access_save_api(params = {}, config = {}) {
  return VHICLE_POST(`access/save`, params, config);
}
// 编辑权限组
export function access_edit_api(params = {}, config = {}) {
  return VHICLE_PUT(`access/edit`, params, config);
}
// 删除权限组
export function access_delete_api(id: number | string) {
  return VHICLE_DELETE(`access/${id}`);
}
// 获取权限分组
export function access_getAcGroups_api(params = {}, config = {}) {
  return VHICLE_POST(`access/getAcGroups`, params, config);
}
// 获取权限组可添加的成员
export function access_getGroupUserList_api(params = {}, config = {}) {
  return VHICLE_GET(`access/getGroupUserList`, params, config);
}
// 分组新增或删除用户
export function access_addOrRemoveUser_api(params = {}, config = {}) {
  return VHICLE_PUT(`access/addOrRemoveUser`, params, config);
}
// 获取权限树
export function access_getAcTree_api(params = {}, config = {}) {
  return VHICLE_POST(`access/getAcTree`, params, config);
}
// 保存权限树勾选项
export function access_savePermission_api(params = {}, config = {}) {
  return VHICLE_POST(`access/savePermission`, params, config);
}

/**
 * @description 精品商城-类目
 */
// 创建类目
export function product_create_api(params = {}, config = {}) {
  return VHICLE_POST(`product/category`, params, config);
}
// 修改类目
export function product_edit_api(id:number|string, params = {}) {
  return VHICLE_PUT(`product/category/${id}`,qs.stringify(params));
}
// 删除类目
export function product_delete_api(id:number|string) {
  return VHICLE_DELETE(`product/category/${id}`);
}
// 类目列表
export function product_list_api(id:number|string) {
  return VHICLE_GET(`product/category/${id}`);
}
// 提醒主机厂添加类目
export function msg_factory_add(params={}){
  return VHICLE_POST(`product/category/request`, params);
}

/**
 * @description 精品商城-商品列表
 */
// 商品列表-主机厂查询主机厂 和 经销商查询主机厂
export function product_spus_list_api(params = {}) {
  return VHICLE_GET(`product/spus`, params);
}
// 商品列表-经销商查询进销商
export function product_manufacturer_spus_list_api(params = {}) {
  return VHICLE_GET(`product/manufacturer_spus`, params);
}
// 商品下架
export function product_offSale_api(id:number
  |string,params = {}) {
  return VHICLE_GET(`product/offSale/${id}`, params);
}
// 商品上架
export function product_sale_api(channel:number|string ,spuId:number|string, params = {}) {
  return VHICLE_PUT(`product/sale?channel=${channel}&spuId=${spuId}`, params);
}
// 商品详情
export function product_detail_api(id:number
  |string,params = {}) {
  return VHICLE_GET(`product/detail/${id}`, params);
}
// 商品删除
export function product_list_delete_api(id:string|number, params = {}) {
  return VHICLE_PUT(`product/delete/${id}`, params);
}


/**
 * @description 精品商城-商品分类
 */
// 商品分类列表
export function mall_category_list_api(params = {}) {
  return VHICLE_GET(`mall/category`, params);
}
// 商品分类新增
export function mall_category_add_api(params = {}) {
  return VHICLE_POST(`mall/category`, qs.stringify(params));
}
// 商品分类修改
export function mall_edit_api(id:number|string, params = {}) {
  return VHICLE_PUT(`mall/category/${id}`,qs.stringify(params));
}
// 商品分类删除
export function mall_delete_api(id:number|string) {
  return VHICLE_DELETE(`mall/category/${id}`);
}

// 售后订单
export function aftersale_order_list_api(params = {}) {
  return VHICLE_GET(`aftersale/order/list`, params);
}
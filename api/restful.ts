import request from "./axios";
import urls from "./urls";

/**
 * 格式化为restful url
 * @param  {String} url          请求url 如：/customer{/cid}/list{/id}
 * @param  {Object} replacements 请求的object对象，会自动替换url上的{/key}
 * @return {String}              url
 */
const restfulUrl = (str: string = "", replacements: any): string => {
  return str.replace(/\{\{|\}\}|\{\/(\w+)\}/g, function(m, n) {
    if (m === "{{") {
      return "{";
    }
    if (m === "}}") {
      return "}";
    }
    let val = replacements[n];
    delete replacements[n];
    return "/" + val;
  });
};

/**
 * get请求字符串参数拼接
 * @param  {String} url          请求url 如：/customer{/cid}/list{/id}
 * @param  {Object} obj          请求的object对象，会自动处理参数拼接
 * @return {String}              url
 */
const handleURI = (str: string, obj: any) => {
  let arr: string[] = [];
  let t = Object.prototype.toString.call(obj);
  let keys = t === "[object Object]" ? Object.keys(obj) : [];
  keys.map((k: any) => {
    // 只保留有效值
    if (typeof obj[k] !== "undefined" && obj[k] !== null && obj[k].length !== 0) {
      arr.push(`${k}=${obj[k]}`);
    }
  });
  str = arr.length > 0 ? `${str}?${arr.join("&")}` : str;
  return str;
};

let apis: any = {};
let methods = ["get", "post", "delete", "put", "patch", "head", "option", "upload"];

methods.map((v: any): void => {
  apis[v] = (params: any, conf: any) => {
    let { url, isAdminApi, ...args } = params;
    // 设置不同的api前缀
    let prefix = isAdminApi ? process.env.VUE_APP_API_VERSION : process.env.VUE_APP_API_PREFIX;
    let headers = {};
    // url前缀设置
    url = prefix + (urls[url] || url);
    if (v === "get") {
      url = handleURI(url, args);
    }

    return request({
      url: restfulUrl(url, args),
      method: v === 'upload' ? 'put': v,
      data: v === 'upload' ? params.data: args,
      headers: Object.assign(headers, conf && conf.headers),
    });
  };
});

export default apis;

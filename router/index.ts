import Vue from "vue";
import Router from "vue-router";
import routeAppend from "./route-append";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { roleInfoSetting, filterUser } from "@/utils/userSetting";
import { userRoleConfig } from "@/const";
import store from "@/store";
const baseModule = require("./base.ts");

Vue.use(Router);
let sysPlat = ["agent", "company", "factory"];
const ROUTER = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // 后使用baseModule 因为404
  routes: [
    // { path: "/", redirect: "/snap" },
    ...routeAppend,
    ...baseModule
  ]
});

// 设置 vuex 中全局的角色
let role: string | number = userRoleConfig.agentUser.value;

function _hasToken(_sysplat: string) {
  Object.keys(userRoleConfig).forEach(key => {
    let item = userRoleConfig[key];
    if (item.sysPlat === _sysplat) {
      role = item.value;
    }
  });
  return roleInfoSetting.setRole(role);
}
function _goLogin(next: any, to: any) {
  next({
    name: filterUser(role).routerLoginName || "agentLogin",
    query: {
      redirect: ""
    }
  });
}
function _hasPermiss({ path }: any) {
  let _permissRouterUrl = store.state.menu.permissRouterUrl;
  if (_permissRouterUrl.length > 0) {
    return _permissRouterUrl.includes(path);
  } else {
    return false;
  }
}

function _vailtorToken(to: any, from: any, next: any, role: string | number) {
  if (from.path === "/" && to.query.sysPlat && !from.query.sysPlat) {
    // 第一次进入页面（首次登录和刷新）
    if (from.query.sysPlat && !sysPlat.includes(from.query.sysPlat)) {
      // 登录进入
      _goLogin(next, to);
    } else if (!from.query.sysPlat && !sysPlat.includes(to.query.sysPlat)) {
      // 当前页刷新
      _goLogin(next, to);
    }
    // 获取 token
    let hasToken = _hasToken(to.query.sysPlat);
    if (hasToken) {
      next();
    } else {
      _goLogin(next, to);
    }
  } else if (from.path !== "/" && from.query.sysPlat) {
    // 不是首页
    // 跳转的路由是否有权限
    let isPassRouter = _hasPermiss(to);
    if (!sysPlat.includes(from.query.sysPlat)) {
      _goLogin(next, to);
    }
    // 获取 token
    let hasToken = _hasToken(from.query.sysPlat);
    const { name, params, query } = to;
    // if(isPassRouter){
    if (hasToken) {
      if (!query.sysPlat && !name.includes("login")) {
        // 如果要去的页面没有特殊标识-插入特殊标识
        let routerTarget = {
          name,
          params,
          query: {
            ...query,
            sysPlat: from.query.sysPlat
          }
        };
        next(routerTarget);
      } else {
        next();
      }
    } else {
      _goLogin(next, to);
    }
    // }else{
    //   // 登录忘记码或者404 -不去校验权限
    //   if(name ==='notFound'|| name.includes('Login')|| name === 'forgetPwd'){
    //     _goLogin(next, to)
    //   }else{
    //     Message.warning('访问权限不足，请联系管理员')
    //     next(from);
    //   }
    // }
  } else if (!to.query.sysPlat) {
    _goLogin(next, to);
  } else {
    next();
  }
}

// eslint-disable-next-line
ROUTER.beforeEach((to, from, next) => {
  // 跳转的路由是否有权限
  let isPassRouter = _hasPermiss(to);
  // if(isPassRouter){
  // 进度条
  if (to.name !== from.name) {
    NProgress.start();
  }
  // }else{
  //   NProgress.done();
  // }
  // 非登录页面
  if (!to.meta.withoutAuth) {
    _vailtorToken(to, from, next, role);
  } else {
    next();
  }
});

// eslint-disable-next-line
ROUTER.afterEach(to => {
  // 进度条
  NProgress.done();
});

export default ROUTER;

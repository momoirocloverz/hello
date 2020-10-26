// 获取左边菜单
import { access_getUserAc_menu_api } from "@/api";
import store from "@/store";
import { filterUser, storeInfoSetting, roleInfoSetting } from "@/utils/userSetting";
import { userRoleConfig } from "@/const";
import { menuAside } from "@/mock/menu.ts";
import { factoryMenu } from "@/mock/factoryMenu.ts";
import { agentMenu } from "@/mock/agentMenu.ts";
import router from "@/router";

let _routerArr: any[] = [];

function developmentMenu() {
  // TODO: 开发中如果没有拿到菜单就给默认菜单，不然测试没法测试
  let role = roleInfoSetting.getRole();
  const _menu =
    role === userRoleConfig.companyUser.value
      ? menuAside
      : role === userRoleConfig.factoryUser.value
      ? factoryMenu
      : agentMenu;
  store.commit("menu/set_aside", _menu);
}

// 过滤出菜单中有的路由地址
function filterPermissRouterUrl(menu: any) {
  menu.forEach((m: any) => {
    if (m.path !== null) {
      _routerArr.push(m.path);
    } else if (!m.path && m.children && m.children.length > 0) {
      filterPermissRouterUrl(m.children);
    }
  });
}

export async function getMenuAside() {
  let params = {
    channel: filterUser().channel,
    userId: storeInfoSetting.getInfo().userId
  };
  try {
    let {
      data: { keywords = [], permissions = [], resources = [] }
    } = await access_getUserAc_menu_api(params);
    // if(resources === null || ( resources && resources.length < 0)){
    //   developmentMenu();
    //   return;
    // }
    console.log("permissions", permissions);
    store.commit("user/setPermissionsKeys", keywords);
    store.commit("menu/set_aside", resources);
    _routerArr = [];
    // filterPermissRouterUrl(resources);
    store.commit("menu/set_permissRouterUrl", _routerArr);
  } catch (error) {
    // developmentMenu();
    console.log(error);
  }
}

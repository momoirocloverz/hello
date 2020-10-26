export default {
  namespaced: true,
  state: {
    aside: [],
    indexPath: [],
    permissRouterUrl: [], // 有权限的菜单路由-用于用户浏览器输入地址跳转页面
  },
  mutations: {
    loadMenu(state: any, val: any) {
      state.aside = val;
    },
    /**
    * @description 设置侧边栏菜单
    * @param {Object} state vuex state
    * @param {Array} menu menu setting
    */
    set_aside(state: any, menu: any) {
      state.aside = menu
    },
    // 设置有权的路由
    set_permissRouterUrl(state: any, menuArr: any) {
      state.permissRouterUrl = menuArr
    },
    /**
     * @description 设置缓存打开的菜单
     * @param state 
     * @param val 
     */
    setIndexList(state: any, val: any) {
      const { menuIndexPath, sysPlat } = val;
      let res = menuIndexPath || [];
      res = [...new Set(res)]
      state.indexPath = res;
      localStorage[`${sysPlat}-storeIndexPath`] = state.indexPath.join(",");
    },
    clearIndexList(state: any, sysPlat: string) {
      localStorage[`${sysPlat}-storeIndexPath`] = "";
    }
  }
};

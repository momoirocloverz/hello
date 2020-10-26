import { MutationTree, ActionTree } from "vuex";
import service from "@/api/axios";
import { WeChatState } from "@/@types/weChat";
import { storeInfoSetting } from "@/utils/userSetting";
import { generateUuid } from "@/utils/";
interface RootState {}

const prefix = process.env.VUE_APP_API_PREFIX;
const adminPrefix = process.env.VUE_APP_API_VERSION;

const dealMenu = (data: any) => {
  data.buttons = data.buttons.map((btn: any) => {
    let dataInfo = JSON.parse(btn.dataInfo);
    return {
      ...btn,
      uuid: generateUuid(),
      level: 1,
      show: true,
      initType: btn.type, // 初始化菜单的类型
      initDataInfo: JSON.parse(btn.dataInfo), // 初始化菜单的dataInfo
      initUrl: btn.url, // 初始化菜单的url
      initValue: btn.value,
      valid: true,
      tagValid: true,
      tagIds: btn.tagIds ? btn.tagIds : ["all"],
      dataInfo,
      subButtons:
        btn.subButtons &&
        btn.subButtons.map((sub: any) => {
          return {
            ...sub,
            uuid: generateUuid(),
            initType: sub.type,
            initDataInfo: JSON.parse(sub.dataInfo),
            initUrl: sub.url,
            initValue: sub.value,
            show: true,
            valid: true,
            tagValid: true,
            tagIds: sub.tagIds ? (sub.tagIds.indexOf("-1") > -1 ? [] : sub.tagIds) : ["all"],
            dataInfo: JSON.parse(sub.dataInfo),
            level: 2
          };
        })
    };
  });
  return data;
};
const removeUnused = (item: any) => {
  delete item.show;
  delete item.uuid;
  delete item.level;
  delete item.initType;
  delete item.initDataInfo;
};
// todo
const dealButton = (data: any) => {
  data.buttons = data.buttons.map((btn: any, idx: number) => {
    let { dataInfo, id, subButtons = [], type, url } = btn;
    // removeUnused(btn);
    if (type === "img" && btn.subButtons.length < 1) {
      btn.url = dataInfo && dataInfo.url;
      btn.mediaId = dataInfo && dataInfo.mediaId;
    } else if (btn.subButtons.length > 0) {
      btn.type = "menu";
      btn.mediaId = null;
      btn.url = null;
    }
    btn.subButtons = subButtons.map((child: any, index: number) => {
      let { dataInfo, type } = child;
      // removeUnused(child);
      if (type === "img") {
        child.url = dataInfo && dataInfo.url;
        child.mediaId = dataInfo && dataInfo.mediaId;
      }
      return {
        ...child,
        key: child.type === "text" ? generateUuid() : "",
        dataInfo: JSON.stringify(dataInfo),
        tagIds: child.tagIds.filter((tag: string) => tag !== "all"),
        index
      };
    });
    return {
      ...btn,
      key: btn.type === "text" ? generateUuid() : "",
      dataInfo: JSON.stringify(dataInfo),
      tagIds: btn.tagIds.filter((tag: string) => tag !== "all"),
      index: idx
    };
  });
};
const state: WeChatState = {
  chatMenu: {
    buttons: [],
    matchRule: {}
  },
  selectedMenu: {
    subButtons: []
  },
  newsInfoList: {
    loading: false,
    data: {}
  },
  materialsInfo: {
    loading: false,
    data: {}
  },
  tagList: {
    loading: false,
    list: []
  },
  organId: "",
  level: -1,
  menuIdx: -1,
  subIdx: -1
};

const mutations: MutationTree<WeChatState> = {
  SET_ORG_ID(state, data) {
    state.organId = data;
  },
  SET_CHAT_MENU(state, data) {
    state.chatMenu = {
      ...state.chatMenu,
      ...data
    };
  },
  SET_SELECTED_MENU(state, data) {
    state.selectedMenu = data;
  },
  DELETE_CHAT_MENU(state, data) {
    state.chatMenu = {
      ...state.chatMenu,
      buttons: state.chatMenu.buttons.filter((btn: any) => {
        if (data.level === 1) {
          return btn.uuid !== data.uuid;
        } else if (data.level === 2) {
          btn.subButtons = btn.subButtons.filter((item: any) => item.uuid !== data.uuid);
          return btn;
        }
      })
    };
  },

  SET_TAG_LIST(state, data) {
    state.tagList = {
      ...state.tagList,
      ...data
    };
  },
  SET_MENU_IDX(state, data) {
    let { level = -1, menuIdx = -1, subIdx = -1 } = data;
    state.level = level;
    state.menuIdx = menuIdx;
    state.subIdx = subIdx;
  }
};
const actions: ActionTree<WeChatState, RootState> = {
  /**
   * 获取组织ID
   * @param commit
   * @param data
   */
  getOrganId({ commit }, data) {
    let organId = storeInfoSetting.getInfo().organId;
    commit("SET_ORG_ID", organId);
  },
  /**
   * 获取菜单
   * @param commit
   * @param state
   * @param data
   */
  async getChatMenu({ commit, state }, data) {
    let res: any = await service.get(`${prefix}wechat/menu/${state.organId}/getMenus`);
    commit("SET_CHAT_MENU", dealMenu(res.data));
  },
  /**
   * 保存菜单
   * @param commit
   * @param dispatch
   * @param state
   * @param data
   */
  async saveMenu({ commit, dispatch, state }, data) {
    let { organId } = state;
    dealButton(data);
    let res = await service.post(`${prefix}wechat/menu/${organId}/createMenu`, {
      buttons: data.buttons,
      organId: organId
    });
    dispatch("getChatMenu");
    return res;
  },
  /**
   * 删除菜单
   * @param commit
   * @param dispatch
   * @param params
   */
  async deleteChatMenu({ commit, dispatch }, params: any) {
    commit("DELETE_CHAT_MENU", params);
    dispatch("setSelectedMenu", {});
  },

  /**
   * 选择菜单
   * @param commit
   * @param data
   */
  setSelectedMenu({ commit }, data) {
    commit("SET_SELECTED_MENU", data);
  },
  /**
   * 获取非图文的信息
   * @param commit
   * @param params
   */
  async getMaterialNewsInfo({ commit }, params) {
    return await service.get(`${prefix}wechat/materials/materialNewsInfo/list`, {
      params
    });
  },
  /**
   * 获取图的列表
   * @param commit
   * @param params
   */
  async getFileList({ commit }, params) {
    return await service.get(`${prefix}wechat/materials/materialFileBatch/list`, {
      params
    });
  },
  /**
   * 获取标签列表
   * @param commit
   * @param state
   * @param params
   */
  async getTagList({ commit, state }, params) {
    commit("SET_TAG_LIST", {
      loading: true
    });
    try {
      // let res = await service.get(`${prefix}wechat/${state.organId}/userTag`);
      let res = await service.get(`${adminPrefix}member/label/list`);
      let list = res.data.filter((item: any) => {
        item.wxId = item.wxId + "";
        return item.wxId !== "0";
      });
      commit("SET_TAG_LIST", {
        loading: false,
        list: [
          {
            name: "全部用户",
            id: "all",
            wxId: "all",
            count: 1
          }
        ].concat(list)
      });
    } catch (e) {
      commit("SET_TAG_LIST", {
        loading: false
      });
    }
  },
  setMenuIdx({ commit }, data) {
    commit("SET_MENU_IDX", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

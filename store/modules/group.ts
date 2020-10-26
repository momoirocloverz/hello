import { MutationTree, ActionTree } from "vuex";
import service from "@/api/axios";
import { GroupForm } from "@/@types/group";
import { storeInfoSetting } from "@/utils/userSetting";

interface RootState {}

interface GroupState {
  groupForm: GroupForm;
  editInfo: any;
}

const adminPrefix = process.env.VUE_APP_API_VERSION;
const prefix = process.env.VUE_APP_API_PREFIX;
const initGroupForm = {
  id: null,
  principalId: null,
  name: "",
  shortName: "",
  area: "",
  phone: "",
  principalAccount: "",
  principalName: "",
  principalPhone: ""
};
const state: GroupState = {
  groupForm: Object.assign({}, initGroupForm),
  editInfo: {}
};

const mutations: MutationTree<GroupState> = {
  SET_GROUP_FORM(state, data) {
    state.groupForm = {
      ...state.groupForm,
      ...data
    };
  },
  SET_EDIT_INFO(state, data) {
    state.editInfo = {
      ...state.editInfo,
      ...data
    };
  }
};
const actions: ActionTree<GroupState, RootState> = {
  async addGroup({ commit }, data) {
    return await service.post(`${adminPrefix}bloc`, data);
  },
  async editGroup({ commit }, data) {
    return await service.put(`${adminPrefix}/bloc`, data);
  },
  async deleteGroup({ commit }, data) {
    return await service.delete(`${adminPrefix}/bloc/${data.id}`);
  },
  /**
   * 启用或冻结集团 enabled 1 启用 0 冻结
   * @param commit
   * @param state
   */
  async frozenGroup({ commit, state }) {
    let { enabled, id } = state.editInfo;
    let _data: any = {
      enabled: !enabled,
      id: id
    };
    return await service.put(`${adminPrefix}/bloc/${id}/${!enabled}`, _data);
  },
  /**
   * 重置密码
   * @param commit
   * @param data
   */
  async resetPassWord({ commit }, data) {
    let token: string = storeInfoSetting.getCookies() || "";
    let url = `${prefix}account/resetPwd`;
    return await service.post(url, { id: data.principalId });
  },
  /**
   * 解绑经销商
   * @param commit
   * @param data
   */
  async removeBindDealer({ commit }, data) {
    let { blocId, dealerCode } = data;
    let url = `${adminPrefix}/bloc/dealer?blocId=${blocId}&&dealerCode=${dealerCode}`;
    return await service.delete(url);
  },
  /**
   * 设置集团FORM
   * @param commit
   * @param data
   */
  setGroupForm({ commit }, data) {
    let _obj: any = Object.assign({}, initGroupForm);
    for (let key in initGroupForm) {
      _obj[key] = data[key];
    }
    _obj.area = _obj.area && _obj.area.split("/");
    commit("SET_EDIT_INFO", data);
    commit("SET_GROUP_FORM", _obj);
  },
  resetGroupForm({ commit }, data) {
    commit("SET_GROUP_FORM", Object.assign({}, initGroupForm));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

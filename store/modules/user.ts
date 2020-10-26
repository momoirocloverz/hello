import { userRoleConfig } from "@/const";
import { MutationTree, ActionTree } from "vuex";
import { auth_forceLogout_api } from '@/api/index';
import {  storeInfoSetting } from "@/utils/userSetting";
import {
  MessageBox
} from 'element-ui'
interface UserState{
  info:any;
  role:number|string,
  permissionsKeys:Array<string>
}
interface RootState {}


const state:UserState = {
    // 用户信息
    info: {
      // 为了和localstorage一直 所以结构就这样了
      info: {
        account:'',
        name: '未知用户',
        phone:'',
        avatar:'',
        position:'',
        jobNumber:''
      },
    },
    // 角色
    role: userRoleConfig.agentUser.value,
    // 权限keys
    permissionsKeys:[]

  }
const mutations:MutationTree<UserState> = {
    /**
     * @description 设置用户信息
     */
    setInfo(state: any, val: any) {
      state.info = val;
    },
    /**
     * @description 根据路由判断 登录的端 设置不同角色
     * @param state
     * @param val 角色值
     */
    setRole(state: any, val: number) {
      state.role = val;
    },
    /**
     * @description 权限的keys
     */
    setPermissionsKeys(state: any, keys: Array<string>){
      state.permissionsKeys = keys;
    }
  }



let logouting:boolean = false; 
const actions: ActionTree<UserState, RootState> = {
  /**
   * @description 退出登录
   * @param hasConfirm 是否需要二次确认弹窗
   */
     setLogout({ commit },hasConfirm:boolean=true){
      if (logouting) {
       return;
      }
      async function logout(){
        let name = storeInfoSetting.getInfo().info && storeInfoSetting.getInfo().info.name;
        logouting = true;
        try {
          await auth_forceLogout_api({ username:name });
          logouting = false;
        } catch (error) {
          console.error('error',error)
          logouting = false;
        }
        storeInfoSetting.clearInfo();
      }
      if(hasConfirm){
        // 判断是否需要确认
        MessageBox.confirm('注销当前账户吗? ', '确认操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          logout()
        }).catch(() => {})
      } else {
        logout()
      }
    }
  }
export default {  
  namespaced: true,
  state,
  mutations,
  actions
}
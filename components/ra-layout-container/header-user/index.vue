<template>
  <div class="mr header-user">
    <router-link :to="{ path: '/msgCenter/index' }"
                 class="el-link el-link--info">
      <!-- TODO:消息判断 -->
      <el-badge :value="msgCount"
                :max="99"
                v-if="msgCount > 0">
        <i class="iconfont iconxiaoxitixing"></i>
      </el-badge>
      <i class="iconfont iconxiaoxitixing"
         v-else></i>
    </router-link>
    <el-dropdown>
      <div class="dropdown-info">
        <div class="header">
          <img :src="_userInfo.info.avatar"
               v-if="_userInfo.info && _userInfo.info.avatar" />
          <img src="../../../../public/imgs/login/user.png"
               alt=""
               v-else>
        </div>
        <div class="el-link user-info">
          <span>
            {{ _userInfo.info && _userInfo.info.name || '未获取到信息' }}
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <span>{{_userInfo.info && userInfo.info.account || '未知'}} </span>
        </div>
      </div>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="user"
                          @click.native="personalVisible = true">个人信息</el-dropdown-item>
        <el-dropdown-item command="tel"
                          @click.native="modyfiTelVisible = true">修改手机号</el-dropdown-item>
        <el-dropdown-item command="password"
                          @click.native="pwdVisible = true">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout"
                          @click.native="exit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <personalDetail :visible.sync="personalVisible"
                    @editPhone="()=>{this.modyfiTelVisible = true}"
                    v-if="personalVisible" />
    <modifyTel :visible.sync="modyfiTelVisible"
               v-if="modyfiTelVisible" />
    <pwDialog :visible.sync="pwdVisible"
              v-if="pwdVisible" />
  </div>
</template>

<script lang="ts">
import { State, Action } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";
import { MessageBox } from "element-ui";
import personalDetail from "../components/personalDetail.vue";
import modifyTel from "../components/modifyTel.vue";
import pwDialog from "../components/modifyPwd.vue";
import { get_account_id_api, unReadMsg } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  components: {
    personalDetail,
    modifyTel,
    pwDialog
  }
})
export default class HeaderUser extends Vue {
  private imgObj: any = {};
  private userRole: number | string;
  private info: any = {};
  private msgCount: number = 0;
  private personalVisible: boolean = false;
  private modyfiTelVisible: boolean = false;
  private pwdVisible: boolean = false;
  private _isFirstLogin: boolean = false;
  private timer: number = 0;
  @State(state => state.user) user: any;
  @State(state => state.user.info) userInfo: any;
  @Action("setLogout", { namespace: "user" })
  setLogout: Function;
  get _userInfo() {
    return this.userInfo;
  }
  async unReadMsg() {
    if (!storeInfoSetting.getInfo().token) {
      clearInterval(this.timer);
      return;
    }
    try {
      let { data } = await unReadMsg();
      this.msgCount = data;
    } catch (error) {
      this.log(error);
    }
  }
  /**
   * @description 获取用户信息
   */
  private async getUserInfo() {
    let id = storeInfoSetting.getInfo().userId;
    if (id === undefined) {
      this.setLogout(false);
    }
    try {
      let { data } = await get_account_id_api(id);
      storeInfoSetting.setInfo(data, "info");
    } catch (error) {
      this.log(error);
    }
  }
  /**
   * @description TODO:获取消息
   */
  private async getMessage() {
    let id = "";
    try {
      let payload = await get_account_id_api(id);
      storeInfoSetting.setInfo(payload, "info");
    } catch (error) {
      this.log(error);
    }
  }

  /**
   * @description 登出
   */
  exit() {
    this.setLogout();
  }
  _firstLogin() {
    let _first = storeInfoSetting.getInfo().first;
  }

  created() {
    this.getUserInfo();
    this._firstLogin();
    this.unReadMsg();
    this.timer = setInterval(() => {
      // 未读消息数量
      this.unReadMsg();
    }, 15000);
    // this.getMessage();
  }
}
</script>
<style lang="scss" scoped>
.header-user {
  display: flex;
  align-items: center;
  border-left: 1px solid #c3cfe0;
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span:first-child {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #292929;
    }
    span:last-child {
      font-size: 11px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(115, 128, 145, 1);
    }
    .el-icon-caret-bottom {
      color: #8090a6;
    }
  }
  .el-link--info {
    margin-right: 40px;
    margin-left: 20px;
  }
  .dropdown-info {
    display: flex;
    align-items: center;
    .header {
      cursor: pointer;
      margin-right: 15px;
    }
  }
  .iconxiaoxitixing {
    font-size: 19px;
    color: #000;
  }
  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin-right: 5px;
    margin-left: 15px;
  }
}
</style>

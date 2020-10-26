<template>
  <login-container>
    <el-form @submit.native.prevent :rules="rules" :model="formLogin" ref="ruleForm" class="form">
      <span class="title">吉利{{ $route.meta.label }}管理后台</span>
      <el-form-item prop="username">
        <el-input
          placeholder="请输入账号"
          v-model.trim="formLogin.username"
          @keyup.native="validateAccount"
          maxlength="20"
        >
          <img src="../../public/imgs/login/user.png" slot="prefix" class="icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          v-model.trim="formLogin.password"
          v-formatNotTxt="formLogin.password"
          @keypress.native.enter="login"
          :type="pwdVisible ? 'text' : 'password'"
          maxlength="20"
        >
          <img src="../../public/imgs/login/lock.png" slot="prefix" class="icon-lock" />
          <img
            src="../../public/imgs/login/eye_close.png"
            slot="suffix"
            class="icon-eye"
            @click="showPwd"
            v-if="!pwdVisible"
          />
          <img src="../../public/imgs/login/eye_open.png" slot="suffix" class="icon-eye" v-else @click="showPwd" />
        </el-input>
      </el-form-item>
      <el-form-item prop="codeValue">
        <el-input
          placeholder="请输入验证码"
          v-model.trim="formLogin.codeValue"
          v-formatNotTxt="formLogin.codeValue"
          @keypress.native.enter="login"
          maxlength="4"
        >
          <img src="../../public/imgs/login/code.png" slot="prefix" class="icon-code" />
          <span slot="suffix" v-if="!codeImg" class="refresh">
            <span v-if="!loadingCode" @click="getLoginCode">
              <i class="el-icon-refresh"></i>
              重新获取验证码
            </span>
            <span v-else>
              <i class="el-icon-loading"></i>
              正在获取验证码
            </span>
          </span>
          <img
            :src="codeImg"
            v-if="codeImg"
            slot="suffix"
            title="点击更换验证码"
            class="icon-code-suffix"
            @click="getLoginCode"
          />
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="login" :loading="submitLoading">登录</el-button>
      <div class="forget"><span @click="toForgetPwd">忘记密码？</span></div>
    </el-form>
  </login-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { roleInfoSetting, storeInfoSetting, filterUser } from "@/utils/userSetting";
import { userRoleConfig } from "@/const";
import LoginContainer from "@/components/login-container/index.vue";
import { getMenuAside } from "@/mock";
import { validate_account_api, get_login_code_api, auth_login_api } from "@/api/index";
import CRYPT from "@/plugins/crypt.js";

interface UserRoleConfigVal {
  key: string;
  value: string;
  routerName: string;
}
interface LoginInfo {
  username: string | (string | null)[];
  password: string;
  codeValue: string;
  codeId?: string;
}
interface Rules {
  username: element.FormRule[];
  password: element.FormRule[];
  codeValue: element.FormRule[];
}
interface LoginSucUserInfo {
  tenantId: number;
  token: string;
  userId: number;
}

@Component({
  components: {
    LoginContainer
  }
})
export default class App extends Vue {
  private pwdVisible: boolean = false;
  private timer: number;
  private codeImg: string = "";
  // TODO: 还没接口校验
  private hasAccount: boolean = true;
  private submitLoading: boolean = false;
  private loadingCode: boolean = false;
  private role: number | string = roleInfoSetting.getRole();
  private rules: Rules = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    codeValue: [{ required: true, message: "请输入验证码", trigger: "blur" }]
  };
  private formLogin: LoginInfo = {
    username: "",
    password: "",
    codeValue: ""
  };

  @Ref() readonly ruleForm: element.Refs;

  private setRole() {
    const _routerName = this.$route.name;
    Object.keys(userRoleConfig).forEach(key => {
      if (userRoleConfig[key].routerLoginName === _routerName) {
        this.role = userRoleConfig[key].value;
      }
    });
  }
  /**
   * @description 显示密码
   */
  private showPwd() {
    this.pwdVisible = !this.pwdVisible;
  }
  /**
   * @description 获取验证码
   * @description 第一次请求是为了生成图形验证码，第二次请求是获取验证码地址
   */
  private async getLoginCode() {
    this.loadingCode = true;
    try {
      let { data } = await get_login_code_api();
      let path = get_login_code_api(data);
      this.formLogin.codeId = data;
      this.codeImg = process.env.VUE_APP_API + path;
      this.loadingCode = false;
    } catch (error) {
      this.loadingCode = false;
      this.log(error);
    }
  }

  /**
   * @description 验证账号是否存在
   */
  private validateAccount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      // this._validateAccountApi();
      this.timer = 0;
    }, 1000);
  }
  // 请求校验API TODO:现在没有接口
  private async _validateAccountApi() {
    try {
      await validate_account_api({ account: this.formLogin.username });
      this.hasAccount = true;
    } catch (error) {
      this.log(error);
    }
  }

  /**
   * @description 登录
   */
  // 点击登录按钮
  private login() {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        if (!this.hasAccount) {
          this.showMsg("账户不存在，请重新输入", "warning");
          return;
        }
        if (!this.formLogin.codeId) {
          this.showMsg("验证码未获取到", "warning");
          return;
        }
        this.setRole();
        this._submitLoginApi();
      }
    });
  }
  // 请求登录api
  private async _submitLoginApi() {
    this.submitLoading = true;
    const {
      formLogin: { username, password, codeId, codeValue },
      role
    } = this;
    try {
      let { data }: any = await auth_login_api({
        username,
        password: CRYPT.encrypt(password),
        codeId,
        codeValue,
        channel: role
      });
      storeInfoSetting.setCookies(data.token, this.role);
      this.$store.commit("user/setRole", this.role);
      data.first ? this.toEditPwd(data) : this._loginSuccess(data);
    } catch (error) {
      this.submitLoading = false;
      this.getLoginCode();
      this.log(error);
    }
  }
  // 登录成功
  _loginSuccess(data: any) {
    const _redirect: any = this.$route.query.redirect || "home";
    this.submitLoading = false;
    storeInfoSetting.setCookies(data.token, this.role);
    this.$store.commit("user/setRole", this.role);
    data.organId = `${this.role}:${data.channelId}`;
    storeInfoSetting.setInfo(data);
    // 登录跳转前删除缓存的menu
    const sp = filterUser(this.role).sysPlat;
    localStorage[`${sp}-storeIndexPath`] = "";
    localStorage[`${sp}-seriecode`] = "";

    this.$router.push({
      path: _redirect,
      query: {
        sysPlat: filterUser().sysPlat
      }
    });
  }

  /**
   * @description 忘记密码
   */
  private toForgetPwd() {
    this.$router.push({
      name: "forgetPwd",
      query: {
        sysPlat: filterUser(this.role).sysPlat,
        type: "forget"
      }
    });
  }
  /**
   * @description 修改密码
   */
  private toEditPwd(data: any) {
    storeInfoSetting.setCookies(data.token, this.role);
    this.$router.push({
      name: "forgetPwd",
      query: {
        sysPlat: filterUser(this.role).sysPlat,
        type: "edit",
        username: this.formLogin.username
      }
    });
  }
  /**
   * @description 根据不同路径判断不同的值
   */
  created() {
    this.formLogin.username = this.$route.query.username || "";
    this.setRole();
    this.getLoginCode();
  }
}
</script>
<style lang="scss" scoped>
.login {
  .form {
    padding-left: 8%;
    margin-top: -10px;
  }
}

.title {
  color: rgba(4, 104, 179, 1);
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 25px;
  display: inline-block;
}
.copy {
  font-size: 12px;
  color: #ccc;
}
.icon {
  width: 17px;
  vertical-align: sub;
}
.icon-code-suffix {
  cursor: pointer;
  width: 150px;
  position: relative;
  top: -10px;
  vertical-align: sub;
  font-size: 10px;
}
.icon-code {
  width: 15px;
  vertical-align: sub;
}
.refresh {
  font-size: 10px;
  color: #358bd4;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
.icon-lock {
  width: 13px;
  vertical-align: sub;
  height: 18px;
}
.icon-eye {
  width: 14px;
  height: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.icon-eye:nth-of-type(1) {
  margin-right: 5px;
}
.el-button {
  width: 110px;
  height: 40px;
  border-radius: 20px;
  margin: 10px 0;
  background: rgba(53, 139, 212, 1);
  box-shadow: 0px 9px 35px 0px rgba(65, 169, 222, 0.36);
  border-radius: 20px;
}
.forget {
  margin-top: 2px;
  span {
    cursor: pointer;
    font-size: 11px;
    color: rgba(53, 139, 212, 1);
    &:hover {
      opacity: 0.8;
    }
  }
}
/deep/ {
  .el-input {
    input {
      border: none;
      padding-left: 40px;
    }
    border-bottom: 1px solid #dcdfe6;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item__error {
    left: 40px;
  }
}
</style>

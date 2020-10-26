<template>
  <login-container>
    <el-form @submit.native.prevent :rules="rules" :model="formLogin" ref="ruleForm" class="form">
      <span class="title">吉利{{ titleName }}管理后台</span>
      <el-form-item v-if="!typeForget" class="title-el-from">
        <div>由于您是首次登录系统，为了保证您的账号安全，请修改默认密码</div>
      </el-form-item>
      <el-form-item prop="phone" v-if="typeForget">
        <el-input
          placeholder="请输入绑定手机号"
          v-model.trim="formLogin.phone"
          v-formatNum:0="formLogin.phone"
          @keypress.native.enter="submit"
          maxlength="11"
          size="small"
        >
          <img src="../../public/imgs/login/user.png" alt="" slot="prefix" class="icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="smsCode" v-if="typeForget">
        <el-input
          placeholder="请输入验证码"
          v-model.trim="formLogin.smsCode"
          v-formatNum:0="formLogin.smsCode"
          @keypress.native.enter="login"
          maxlength="6"
          size="small"
        >
          <img src="../../public/imgs/login/code.png" alt="" slot="prefix" class="icon-code" />
          <el-button size="small" slot="suffix" type="primary" :disabled="!codeDisabled" @click="sentCode">{{
            timer ? `${cutTime}秒后重试` : "获取验证码"
          }}</el-button>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          placeholder="请输入新密码"
          v-formatNotTxt="formLogin.password"
          v-model.trim="formLogin.password"
          @keypress.native.enter="submit"
          :type="pwdVisible ? 'text' : 'password'"
          maxlength="16"
          size="small"
        >
          <img src="../../public/imgs/login/lock.png" alt="" slot="prefix" class="icon-lock" />
          <img
            src="../../public/imgs/login/eye_close.png"
            slot="suffix"
            class="icon-eye"
            @click="() => (this.pwdVisible = !this.pwdVisible)"
            v-if="!pwdVisible"
          />
          <img
            src="../../public/imgs/login/eye_open.png"
            slot="suffix"
            class="icon-eye"
            v-else
            @click="() => (this.pwdVisible = !this.pwdVisible)"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          placeholder="请再次输入新密码"
          v-formatNotTxt="formLogin.confirmPassword"
          v-model.trim="formLogin.confirmPassword"
          @keypress.native.enter="submit"
          maxlength="16"
          :type="confirmPwdVisible ? 'text' : 'password'"
          size="small"
        >
          <img src="../../public/imgs/login/lock.png" alt="" slot="prefix" class="icon-lock" />
          <img
            src="../../public/imgs/login/eye_close.png"
            slot="suffix"
            class="icon-eye"
            @click="() => (this.confirmPwdVisible = !this.confirmPwdVisible)"
            v-if="!confirmPwdVisible"
          />
          <img
            src="../../public/imgs/login/eye_open.png"
            slot="suffix"
            class="icon-eye"
            v-else
            @click="() => (this.confirmPwdVisible = !this.confirmPwdVisible)"
          />
        </el-input>
      </el-form-item>

      <el-button type="primary" @click="submit" class="submit" :loading="submitLoading">提交</el-button>
      <div class="forget"><span @click="returnLogin">返回登录</span></div>
    </el-form>
  </login-container>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { roleInfoSetting, storeInfoSetting, filterUser } from "@/utils/userSetting";
import { userRoleConfig } from "@/const";
import LoginContainer from "@/components/login-container/index.vue";
import { pwdCheck } from "@/const/reg";
import { auth_forgetAndModifyPassword_api, sms_check_api, sms_send_api, reset_pwd_api } from "@/api";
import CRYPT from "@/plugins/crypt.js";
import _ from "lodash";

// 发送短信验证码需要的-service
const SMS_SERVICE: string = "forgetPassword";

interface LoginInfo {
  phone: string;
  password: string;
  confirmPassword: string;
  smsCode: string;
}
interface Rules {
  phone: element.FormRule[];
  password: element.FormRule[];
  confirmPassword: element.FormRule[];
  smsCode: element.FormRule[];
}

@Component({
  components: {
    LoginContainer
  }
})
export default class App extends Vue {
  @Ref() readonly ruleForm: element.Refs;
  private submitLoading: boolean = false;
  private timer: number = 0;
  private cutTime: number = 60;
  private role: number | string;
  private pwdVisible: boolean = false;
  private confirmPwdVisible: boolean = false;
  private rules: Rules = {
    phone: [{ required: true, message: "请输入绑定手机号", trigger: "blur" }],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: pwdCheck
      }
    ],
    confirmPassword: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            if (value !== this.formLogin.password) {
              callback(new Error("两次输入密码不一致!"));
            } else {
              callback();
            }
          } else {
            callback(new Error("请再次输入8-16位新密码"));
          }
        }
      }
    ],
    smsCode: [{ required: true, message: "请输入验证码", trigger: "change" }]
  };
  private formLogin: LoginInfo = {
    confirmPassword: "",
    phone: "",
    password: "",
    smsCode: ""
  };

  get titleName() {
    let _name: string = filterUser(this.role).label;
    return _name;
  }
  get codeDisabled(): boolean {
    let _hasTel = false;
    if (/^1[0-9]{10}$/.test(this.formLogin.phone)) {
      _hasTel = true;
    }
    return _hasTel && this.timer === 0;
  }
  get typeForget() {
    // 用了判断是忘记密码还是修改密码
    return this.$route.query.type === "forget";
  }

  /**
   * @description 提交修改密码
   */
  // 点击提交按钮
  private submit() {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        let _param = _.cloneDeep(this.formLogin);
        delete _param.confirmPassword;
        this.typeForget
          ? this.submitRegisterApi({
              ..._param,
              password: CRYPT.encrypt(_param.password)
            })
          : this.editPwd({
              ..._param,
              password: CRYPT.encrypt(_param.password)
            });
      }
    });
  }
  // 修改密码API
  private async editPwd(_param: any) {
    delete _param.phone;
    delete _param.smsCode;
    try {
      await reset_pwd_api({ password: _param.password });
      this.$router.push({
        name: filterUser(this.role).routerLoginName,
        query: {
          username: this.$route.query.username || ""
        }
      });
    } catch (error) {
      this.log(error);
    }
  }

  // 忘记密码API
  private async submitRegisterApi(_param: any) {
    this.submitLoading = true;
    try {
      await auth_forgetAndModifyPassword_api({
        ..._param,
        smsService: SMS_SERVICE,
        channel: filterUser(this.role).channel
      });
      this.submitLoading = false;
      this.$router.go(-1);
    } catch (error) {
      this.submitLoading = false;
      this.log(error);
    }
  }

  /**
   * @description 发送验证码
   */
  // 点击发送按钮
  private sentCode() {
    if (this.timer) {
      return;
    }
    this.smsSendApi();
    this.timer = setInterval(() => {
      if (this.cutTime === 1) {
        clearInterval(this.timer);
        this.timer = 0;
        this.cutTime = 60;
      }
      this.cutTime--;
    }, 1000);
  }
  // 发送短信API
  private async smsSendApi() {
    let _param = { mobile: this.formLogin.phone, service: SMS_SERVICE };
    try {
      await sms_send_api(_param);
      this.showMsg("发送成功");
    } catch (error) {
      this.log(error);
    }
  }

  // 返回登录
  private returnLogin() {
    this.$router.go(-1);
  }

  created() {
    // 获取角色
    const _routerSysPlat = this.$route.query.sysPlat;
    Object.keys(userRoleConfig).forEach(key => {
      if (userRoleConfig[key].sysPlat === _routerSysPlat) {
        this.role = userRoleConfig[key].value;
      }
    });
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
.icon-code {
  width: 15px;
  height: 18px;
  vertical-align: sub;
}
.icon-lock {
  width: 13px;
  vertical-align: sub;
  height: 18px;
}
.icon-eye {
  width: 14px;
  height: 11px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.icon-eye:nth-of-type(1) {
  margin-right: 5px;
}
.el-button.submit {
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
    font-size: 11px;
    color: rgba(53, 139, 212, 1);
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}

/deep/ {
  .title-el-from {
    margin-bottom: 15px !important;
    .el-form-item__content {
      line-height: 21px;
      font-size: 12px;
      color: #999;
    }
  }
  .el-input {
    input {
      border: none;
      padding-left: 40px;
    }
    border-bottom: 1px solid #dcdfe6;
  }
  .el-form-item__error {
    left: 40px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

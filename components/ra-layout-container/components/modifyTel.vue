<template>
  <elBtnDialog :visible.sync="_visible"
               title="修改手机"
               :saveLoading="saveLoading"
               :dialogAttr="{width:'400px'}"
               @save="saveForm">
    <p class="tip"> 为保障您的账号安全，需要手机验证</p>
    <el-form @submit.native.prevent
             :model="subForm"
             :rules="rules"
             ref="ruleForm"
             class="sub_form"
             label-width="100px">
      <el-form-item label="当前手机号：">
        {{currentPhone || '—'}}
      </el-form-item>
      <el-form-item label="新手机号："
                    prop="phone">
        <el-input maxlength="11"
                  v-model="subForm.phone"
                  v-formatNum:0="subForm.phone"
                  size="small">
          <template slot="suffix">
            <span>{{subForm.phone.length}}/11</span>
          </template>
        </el-input>
      </el-form-item>
      <sms-send :smsCode.sync="subForm.smsCode"
                :smsService="subForm.smsService"
                :phone="subForm.phone"
                :isAutoSend="false"></sms-send>
    </el-form>
  </elBtnDialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Watch, Ref } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import SmsSend from "./smsSend.vue";
import { telValidator } from "@/const/reg";
import { sms_check_api, sms_send_api, account_updatePhone_api } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";
const SMS_SERVICE = "editPhone";

interface SubForm {
  smsService: string;
  smsCode: string;
  phone: string;
  id: string;
}
interface SubFormRule {
  phone: Array<element.FormRule>;
  smsCode: Array<element.FormRule>;
}

@Component({
  components: {
    ElBtnDialog,
    SmsSend
  }
})
export default class App extends Vue {
  @Ref() readonly ruleForm: element.Refs;
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @State(state => state.user.info) userInfo: any;

  private saveLoading: boolean = false;
  private subForm: SubForm = { smsService: SMS_SERVICE, smsCode: "", phone: "", id: "" };
  private rules: SubFormRule = {
    phone: [
      {
        required: true,
        trigger: "blur",
        validator: telValidator
      }
    ],
    smsCode: [{ required: true, message: "请填写验证码", trigger: "blur" }]
  };
  get currentPhone() {
    return (
      this.userInfo.info &&
      this.userInfo.info.phone &&
      this.userInfo.info.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    );
  }

  private async updatePhoneApi() {
    this.saveLoading = true;
    this.subForm.id = this.userInfo.info.id || "";
    try {
      await account_updatePhone_api(this.subForm);
      this.saveLoading = false;
      this._visible = false;
      storeInfoSetting.setInfo({ phone:this.subForm.phone }, "info");
      this.showMsg("操作成功");
    } catch (error) {
      this.saveLoading = false;
      this.log(error);
    }
  }
  private saveForm() {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        this.updatePhoneApi();
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.sub_form {
  margin-right: 50px;
}
.tip {
  color: #999;
  margin-top: 0;
  font-size: 13px;
}
</style>
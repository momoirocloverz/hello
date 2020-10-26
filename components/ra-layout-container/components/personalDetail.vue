<template>
  <div class="personalDetail">
    <elBtnDialog :visible.sync="_visible"
                 :saveLoading="saveLoading"
                 title="个人信息"
                 :dialogAttr="{width:'450px'}"
                 @save="saveForm"
                 width="500px">
      <el-form @submit.native.prevent
               :model="subForm"
               :rules="rules"
               class="sub_form"
               label-width="80px">
        <el-form-item label="头像："
                      prop="avatar">
          <upload-to-ali :size="1024 * 10"
                         v-model="subForm.avatar"></upload-to-ali>
        </el-form-item>
        <el-form-item label="姓名："
                      prop="name">
          <div v-if="editName">
            <el-input maxlength="20"
                      v-model="subForm.name"
                      size="small"
                      style="width:150px;">
              <template slot="suffix">
                {{subForm.name.length}}/20
              </template>
            </el-input>

            <span class="edit-text"
                  @click="editNameConfirm">确定</span>
            <span class="edit-text"
                  @click="editNameCancel">取消</span>
          </div>
          <div v-else>
            <span class="text">{{subForm.name}}</span>
            <span class="edit-text"
                  @click="()=>this.editName = true">修改</span>
          </div>
        </el-form-item>
        <el-form-item label="手机号：">
          <span class="text">{{subForm.phone || '—'}}</span>
          <span class="edit-text"
                @click="editPhone">修改</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{subForm.email || '—'}}</span>
        </el-form-item>
        <el-form-item label="职位：">
          <span>{{subForm.position || '—'}}</span>
        </el-form-item>

      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import { editUser } from "@/api";
import { storeInfoSetting } from "@/utils/userSetting";

import _ from "lodash";
interface SubForm {
  name: string;
  phone: string;
  avatar: string;
  position: string;
  email: string;
  id?: string | number;
}
interface SubFormRule {
  name: Array<element.FormRule>;
  avatar: Array<element.FormRule>;
}

@Component({
  components: {
    elBtnDialog,
    UploadToAli
  }
})
export default class App extends Vue {
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @State(state => state.user.info) userInfo: any;
  private saveLoading: boolean = false;
  private _oldUserInfo: SubForm;
  private subForm: SubForm = { name: "", phone: "", avatar: "", position: "", id: "", email: "" };
  private rules: SubFormRule = {
    avatar: [{ required: true, message: "请选择头像", trigger: "blur" }],
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
  };
  private editName: boolean = false;

  @Watch("userInfo")
  userChange() {
    this.setUserInfo();
  }
  private editNameCancel() {
    this.subForm.name = this._oldUserInfo.name;
    this.subForm.avatar = this._oldUserInfo.avatar;
    this.editName = false;
  }
  private editNameConfirm() {
    if (!this.subForm.name) {
      return;
    }
    this.editName = false;
  }

  private async editSubmit() {
    let { avatar, name } = this.subForm;
    if (!name) {
      this.showMsg("请先填写用户名", "warning");
      return;
    }
    if (!avatar) {
      this.showMsg("请先上传头像", "warning");
      return;
    }
    this.editName = false;
    this.saveLoading = true;
    let _params = { avatar, name };
    try {
      await editUser(_params);
      this.showMsg("操作成功");
      this.saveLoading = false;
      this._visible = false;
      storeInfoSetting.setInfo(this.subForm, "info");
    } catch (error) {
      this.saveLoading = true;
      this.log(error);
    }
  }

  private editPhone() {
    this.$emit("update:visible", false);
    this.$emit("editPhone");
  }

  private saveForm() {
    this.editSubmit();
  }

  private setUserInfo() {
    let { name, phone, avatar, position, id, email } = this.userInfo.info;
    avatar = !avatar ? "/imgs/login/user.png" : avatar;
    this.subForm = { name, phone, avatar, position, id, email };
    this._oldUserInfo = { name, phone, avatar, position, id, email };
  }

  created() {
    this.setUserInfo();
  }
}
</script>
<style lang='scss' scoped>
.text {
  font-size: 13px;
  color: #000;
}
.edit-text {
  margin-left: 25px;
  font-size: 11px;
  color: rgba(53, 139, 212, 1);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
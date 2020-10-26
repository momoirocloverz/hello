<template>
  <div>
    <!--dialog-->
    <el-dialog :title="info.dialogName+'分组'"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form ref="form"
                 :model="form"
                 :rules="rule"
                 @submit.native.prevent>
          <el-form-item label="分组名称："
                        prop="name">
            <el-input type="input"
                      maxlength="8"
                      size="small"
                      v-model="form.name"
                      style="width:40%;margin-right:10px;"
                      placeholder="请输入分组名称"></el-input>
            <span>{{form.name.length}}/8</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import api from "@/api/restful";

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: {} }) readonly info: any;
  @Prop({ default: false }) readonly editMode: boolean;

  private form: any = { name: "" };
  private rule: any = {
    name: [{ required: true, message: "请输入分组名称", trigger: "blur" }]
  };
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.$emit("change", this.form);
        this.closeDialog();
      } else {
        let message = params[Object.keys(params)[0]][0].message;
        this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      if (this.editMode) {
        this.form = Object.assign({}, this.info);
      } else {
        this.form = { name: "" };
      }
    }
  }
}
</script>

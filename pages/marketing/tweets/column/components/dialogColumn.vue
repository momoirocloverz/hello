<template>
  <div>
    <!--dialog-->
    <el-dialog :title="editMode?'编辑栏目':'新建栏目'"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form ref="form"
                 :model="form"
                 :rules="rule"
                 @submit.native.prevent
                 label-width="150px">

          <el-form-item label="栏目名称："
                        prop="name">
            <el-input type="input"
                      maxlength="10"
                      size="small"
                      v-model="form.name"
                      style="width:50%;margin-right:10px;"
                      placeholder="请输入栏目名称"></el-input>
            <span>{{form.name.length}}/10</span>
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
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  @Prop({ default: false })
  readonly editMode: boolean;
  private form: any = { name: "" };
  private rule: any = {
    name: [{ required: true, message: "请输入栏目名称", trigger: "blur" }]
  };
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.editMode ? this.edit() : this.add();
      } else {
        return false;
      }
    });
  }
  add() {
    api.post({ url: "COLUMNS", name: this.form.name, isAdminApi: true }).then((data: any) => {
      this.$message({ type: "success", message: "添加成功" });
      this.closeDialog();
      this.$emit("refresh");
    });
  }
  edit() {
    api.put({ url: "COLUMNS", id: this.info.id, name: this.form.name, isAdminApi: true }).then((data: any) => {
      this.$message({ type: "success", message: "编辑成功" });
      this.closeDialog();
      this.$emit("refresh");
    });
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      if(this.$refs.form){
        (<any>this.$refs.form).clearValidate();
      }
      if (this.editMode) {
        this.form.name = this.info.name;
      } else {
        this.form.name = "";
      }
    }
  }
}
</script>

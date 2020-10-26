<template>
  <div>
    <!--dialog-->
    <el-dialog title="验券"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form @submit.native.prevent 
        ref="form"
               :model="form"
               :rules="rule"
               label-width="150px">
          <el-form-item label="核销码："
                        prop="value">
            <el-input type="input"
                      maxlength="20"
                      size="small"
                      v-model.number="form.value"
                      style="width:50%;margin-right:10px;"
                      placeholder="请输入核销码"></el-input>
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

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  private form: any = { value: '' };
  private rule: any = {
    value: [{ required: true, message: "请输入核销码" }]
  }
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.$emit("submit", this.form.value);
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
    if (newVal !== oldVal) {
      this.form.value = '';
    }
  }
}
</script>

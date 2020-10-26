<template>
  <div>
    <!--dialog-->
    <el-dialog title="增加库存"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form ref="form"
                 :model="form"
                 :rules="rule"
                 label-width="150px"
                 @submit.native.prevent>
          <el-form-item label="剩余库存："
                        prop="author">
            <span>{{info.stockCount}}</span>
          </el-form-item>
          <el-form-item label="增加库存："
                        prop="value">
            <el-input type="input"
                      maxlength="6"
                      size="small"
                      v-model.number="form.value"
                      @keyup.native="number"
                      style="width:50%;margin-right:10px;"
                      placeholder="请输入增加库存数"></el-input>
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
  private form: any = { value: 0 };
  private rule: any = {
    value: [{ required: true, message: "请输入数量", trigger: "blur" }]
  };
  closeDialog() {
    this.$emit("close", true);
  }
  number(e: any) {
    this.form.value = this.form.value.replace(/[^\d]/g, "");
    this.form.value = this.form.value.replace(".", "");
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.$emit("submit", { data: this.info, value: this.form.value });
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
      this.form.value = this.info.value;
    }
  }
}
</script>

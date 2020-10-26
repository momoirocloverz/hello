<template>
  <div>
    <!--dialog-->
    <el-dialog title="图片素材分组"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form @submit.native.prevent
                 ref="form"
                 :model="form"
                 :rules="rule">
          <el-form-item label="请选择分组："
                        prop="cat">
            <el-select v-model="form.cat"
                       placeholder="请选择">
              <el-option v-for="item in categories"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
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
  @Prop({ default: 0 })
  readonly type!: number;
  @Prop({ default: null })
  readonly source!: number;
  @Prop({ default: [] })
  readonly categories!: [];
  @Prop({ default: null })
  readonly groupId: number;
  private form: any = { cat: null };
  private rule: any = {
    cat: [{ required: true, message: "请选择分组", trigger: "blur" }]
  };
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.$emit("change", this.form.cat);
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
      this.form.cat = this.groupId;
    }
  }
}
</script>

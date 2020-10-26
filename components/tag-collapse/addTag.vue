<template>
  <!-- 新增tag -->
  <el-btn-dialog :visible.sync="_visible"
                 :dialogAttr="{width:'55%'}"
                 :title="title"
                 :saveLoading="submitLoading"
                 :saveAutoClose="false"
                 @save="saveAdd">
    <el-form @submit.native.prevent
             :model="_subForm"
             class="sub_form"
             ref="ruleForm"
             :rules="rules"
             label-width="120px">
      <slot name="content"></slot>
      <el-form-item :label="`${label}：`"
                    prop="name">
        <el-input :placeholder="placeholder"
                  v-model.trim="_subForm.name"
                  :maxlength="maxlength"
                  size="small"
                  style="width:100%"
                  show-word-limit
                  :rows="rows"
                  :type="inputType">
        </el-input>
      </el-form-item>
      <slot name="footerContent"></slot>
    </el-form>
  </el-btn-dialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Prop, Ref } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";

interface SubForm {
  name: string;
  id?: number;
}
interface Rules {
  name: element.FormRule[];
}

@Component({
  components: { ElBtnDialog }
})
export default class App extends Vue {
  @Ref() readonly ruleForm: element.Refs;
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @PropSync("subForm", { type: Object, default: "" }) _subForm: SubForm;
  @Prop({ default: "请输入", type: String }) placeholder: string;
  @Prop({ default: false, type: Boolean }) submitLoading: boolean;
  @Prop({ default: "名称", type: String }) label: string;
  @Prop({ default: "新增", type: String }) title: string;
  @Prop({ default: 10, type: Number }) maxlength: number;
  @Prop({ default: "text", type: String }) inputType: string;
  @Prop({ default: 2, type: Number }) rows: number;

  private saveLoading: boolean = false;
  private tagName: string = "";
  private rules: Rules = {
    name: [
      {
        required: true,
        message: this.placeholder,
        trigger: "blur"
      }
    ]
  };

  private saveAdd() {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        this.$emit("save", this._subForm.name);
        this._visible = false;
      }
    });
  }
}
</script>
<style lang='scss' scoped>
.sub_form {
  margin-right: 30px;
}
/deep/ {
  .el-input {
    width: auto;
  }
  .el-dialog__body {
    padding: 30px 20px 0;
  }
}
</style>
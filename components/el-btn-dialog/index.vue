<template>
  <el-dialog :visible.sync="_visible"
             :title="title"
             :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnClickModal"
             :before-close="close"
             v-bind="dialogAttr">
    <slot></slot>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="close"
                 size="small"
                 v-if="showClose && hasCancelBtn">取 消</el-button>
      <el-button type="primary"
                 @click="save"
                 size="small"
                 :loading="saveLoading"
                 v-if="hasConfirmBtn">确认</el-button>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  inheritAttrs: false;
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  dialogAttr: any;
  @Prop({ type: Boolean, default: false }) closeOnClickModal: boolean;
  @Prop({ type: Boolean, default: true }) showClose: boolean;
  @Prop({ type: String, default: "提示" }) title: string;
  @Prop({ type: Boolean, default: false }) saveLoading: boolean;
  @Prop({ type: Boolean, default: true }) saveAutoClose: boolean;
  @Prop({ type: Boolean, default: true }) hasCancelBtn: boolean;
  @Prop({ type: Boolean, default: true }) hasConfirmBtn: boolean;

  close() {
    this._visible = false;
    this.$emit("close");
  }
  save() {
    this.saveAutoClose ? (this._visible = false) : "";
    this.$emit("save");
  }
}
</script>
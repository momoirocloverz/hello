<template>
  <div class="add-group">
    <common-form
      ref="groupFormRef"
      :rules="formRule"
      :props="formProps"
      :form="groupForm"
      :inline="false"
    ></common-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import commonForm from "@/components/common-form/index.vue";
import Const from "../const/index";
import { State, Action } from "vuex-class";
import { DialogInfo } from "@/@types/activity";

@Component({
  name: "groupFormDialog",
  components: { commonForm }
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @State(state => state.group.groupForm) private groupForm!: any;
  @Ref() groupFormRef: { formRef: HTMLFormElement };
  @Prop({ default: "new" }) private formType: string;
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }
  private get formProps(): Array<any> {
    return this.formType === "start" ? this.constant.START_GROUP_PROPS : this.constant.GROUP_PROPS;
  }
  private get formRule(): Array<any> {
    return this.formType === "start" ? [] : this.constant.GROUP_RULES;
  }
  private handleCancel(): void {
    this.$emit("handleCancel");
  }
}
</script>

<style lang="scss">
.add-group {
  .el-input,
  .el-cascader {
    width: 60% !important;
    .el-input {
      width: 100% !important;
    }
  }
}
</style>

<template>
  <div v-if="showAgentDialog"
       v-loading="btnsLoading"
       class="dia_box">
    <renderButton v-for="(item, i ) in operationBtnsColumns"
                  :key="i"
                  :data="item"
                  :row="_infoRow" />
    <elBtnDialog :visible.sync="modalVisible"
                 :title="dialogTitle"
                 :dialogAttr="{width:'40%'}"
                 :saveAutoClose="false"
                 @save="saveModelForm">
      <el-form @submit.native.prevent :model="modelForm"
               ref="modelFormRef"
               :rules="modelFormRule"
               size="small"
               label-width="130px"
               v-loading="modelFormLoading"
               style="width:90%">

        <maxRulePage :maxRuleInPage="maxRuleInPage"
                     :dialogType="dialogType"
                     :isRelease="isRelease"
                     :modelForm.sync="modelForm" />

      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import renderButton from "@/components/el-admin-table/render-button.vue";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { mixins } from "vue-class-component";
import AgentDialogMixin from "../mixin/agent-dialog.mixin"
import { Component, Prop, PropSync } from 'vue-property-decorator';
import maxRulePage from "./maxRulePage.vue"
@Component({
  components: {
    elBtnDialog,
    renderButton,
    maxRulePage
  },
})
export default class AgentDialogOperation extends mixins(AgentDialogMixin) {
  @Prop({ type: Boolean, default: true }) showAgentDialog: boolean;
  @Prop({ type: Boolean, default: true }) btnsLoading: boolean;
  @PropSync("infoRow", {
    type: Object, default: () => {
      return {}
    }
  }) _infoRow: any;
  get operationBtnsColumns() {
    let { operationBtns } = this;
    return operationBtns.map((ele: any) => {
      const { text, show, atClick } = ele
      return {
        text, show, atClick,
        prop: (row: any) => {
          return {
            type: "default"
          }
        }
      }
    })
  }
  seriesInPage: any = {};
}
</script>
<style lang="scss" scoped>
.dia_box {
  margin-bottom: 20px;
  height: 50px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  background: #fff;
}
/deep/ {
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
}
</style>

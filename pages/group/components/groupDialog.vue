<template>
  <el-dialog :title="dialogObj.title" :visible.sync="dialogObj.show" width="60%" :before-close="handleClose">
    <agent-list
      :dialogObj="dialogObj"
      @loadList="loadList"
      @handleClose="handleClose"
      v-if="dialogObj.type === 'agent'"
    ></agent-list>
    <group-form
      ref="groupRef"
      :dialogObj="dialogObj"
      :formType="dialogObj.type"
      v-else-if="dialogObj.type !== '' && dialogObj.type !== 'agent'"
    ></group-form>
    <div slot="footer" v-if="dialogObj.type !== 'agent'">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" size="small" @click="sure" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import GroupForm from "./groupForm.vue";
import AgentList from "./agentList.vue";
import { State, Action } from "vuex-class";

@Component({
  name: "groupFormDialog",
  components: { GroupForm, AgentList }
})
export default class extends Vue {
  @Ref() groupRef: { formRef: HTMLFormElement };
  @State(state => state.group.editInfo) private editInfo!: any;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  private loading: boolean = false;
  handleClose() {
    this.$emit("handleClose");
  }
  private sure() {
    let { type } = this.dialogObj;
    if (type !== "agent") {
      let _groupForm: any = this.groupRef;
      _groupForm.groupFormRef.formRef.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          try {
            await this.$emit("saveForm");
            this.loading = false;
          } catch (e) {
            this.loading = false;
          }
        }
      });
    }
  }
  loadList() {
    this.$emit("loadList");
  }
}
</script>

<style scoped lang="scss"></style>

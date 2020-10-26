<!--选择关联-->
<template>
  <el-dialog
    class="award-dialog"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="80%"
    :before-close="handleClose"
  >
    <!--关联活动-->
    <active :currentForm="currentForm" @chooseInfo="chooseInfo" v-if="dialogObj.type === 'active'"></active>
    <!--关联商品-->
    <goods :currentForm="currentForm" @chooseInfo="chooseInfo" v-if="dialogObj.type === 'goods'"></goods>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取 消</el-button>
      <el-button type="primary" @click="sure" size="small">确认</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import Active from "./active.vue";
import Goods from "./goods.vue";
import { DialogInfo } from "@/@types/activity";

@Component({
  name: "chooseRelate",
  components: { Active, Goods }
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: () => {} }) private currentForm: any;
  @Prop({ default: () => {} }) private contentType: object;
  @Action("setRelation", { namespace: "activity" })
  setRelation: any;
  relateInfo: any = {};
  private handleClose(): void {
    this.$emit("handleClose");
  }
  private chooseInfo(info: any) {
    this.relateInfo = info;
  }
  private sure() {
    this.$emit("handleSure", this.relateInfo || {});
  }
  @Watch("currentForm", { immediate: true, deep: true })
  "currentForm.info"() {
    this.relateInfo.id = this.currentForm.info;
  }
}
</script>

<style scoped lang="scss"></style>

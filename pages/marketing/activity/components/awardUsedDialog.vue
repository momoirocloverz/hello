<!--奖品使用确认-->
<template>
  <el-dialog
    class="put-in"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="40%"
    :before-close="handleClose"
  >
    <common-form ref="usedRef" :props="awardProps" :form="awardInfo" :inline="false"> </common-form>
    <div class="bottom-btn">
      <el-button size="small" @click="handleSure" type="primary">确定</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { DialogInfo } from "@/@types/activity";
import Const from "../const/";
import { useCoupon } from "@/api";

@Component({
  name: "awardUsedDialog",
  components: {
    CommonForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: () => {} }) private awardInfo: any;
  @Prop({ type: String, default: "lottery" }) private activeType: string;

  private get constant(): any {
    return new Const(this).const;
  }
  get awardProps(): any {
    if (this.activeType === "site") {
      return this.constant.SITE_WIN_PRICE_PROP;
    } else {
      return this.constant.LOTTERY_WIN_PRICE_PROP;
    }
  }
  handleClose(): void {
    this.dialogObj.show = false;
  }
  async handleSure() {
    await useCoupon(this.awardInfo.ticketCode);
    this.$message.success("验券成功");
    this.$emit("loadList");
    this.handleClose();
  }
}
</script>

<style scoped lang="scss">
.put-in {
  .bottom-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

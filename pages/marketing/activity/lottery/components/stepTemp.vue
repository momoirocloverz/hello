<!--选择模板-->
<template>
  <div class="temp-part">
    <common-form
      ref="stepRef"
      :rules="lotteryCon.LOTTERY_RULES"
      :props="lotteryCon.LOTTERY_TEMP_PROP"
      :form="lotteryForm"
      :inline="false"
    >
      <div slot="marketingToolStyle" class="mb-15">
        <el-button size="small" @click="showTempDialog">选择模板</el-button>
        <div class="mt-15 thumbnail">
          <img :src="lotteryForm.thumbnail" alt="" />
          <div class="temp-type" v-if="lotteryForm.thumbnail">{{ typeTxtMap[lotteryForm.marketingToolType] }}</div>
        </div>
      </div>
    </common-form>
    <temp-list-dialog :dialogObj="dialogObj" @handleClose="handleClose" @chooseTemp="chooseTemp"></temp-list-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import tempListDialog from "./tempListDialog.vue";
import { LotteryForm } from "@/@types/activity";
import { DialogInfo } from "@/@types/activity";
import defaultImg from "@/assets/images/activity/dft.png";

@Component({
  name: "stepTemp",
  components: {
    CommonForm,
    tempListDialog
  }
})
export default class StepTemp extends Vue {
  @Ref() stepRef: any;
  @State(state => state.activity.lotteryForm) private lotteryForm!: LotteryForm;
  @Prop({ default: () => {} }) private lotteryCon: any;
  from: string = "";
  defaultImg: string = defaultImg;
  hasChoose: boolean = false;
  typeTxtMap: any = {
    1: "九宫格",
    2: "刮刮乐",
    0: "大转盘"
  };
  dialogObj: DialogInfo = {
    title: "选择模板",
    show: false
  };
  chooseTemp(item: any) {
    this.hasChoose = true;
    this.lotteryForm.marketingToolStyle = item.snapshotId;
    this.lotteryForm.thumbnail = item.thumbnail || defaultImg;
    this.lotteryForm.marketingToolType = item.toolType;
    this.stepRef.formRef.validate();
  }
  showTempDialog() {
    this.dialogObj.show = true;
  }
  handleClose() {
    this.dialogObj.show = false;
  }
  created() {
    this.from = (<any>this.$route.query).from;
    if (this.from === "temp") {
      let curTemp = JSON.parse(localStorage.getItem("c_template") || "");
      this.lotteryForm.marketingToolStyle = curTemp.snapshotId;
      this.lotteryForm.thumbnail = curTemp.thumbnail || defaultImg;
      this.lotteryForm.marketingToolType = curTemp.toolType;
    }
  }
}
</script>

<style scoped lang="scss">
.temp-part {
  min-height: 410px;
  .thumbnail {
    position: relative;
    width: 260px;
    height: 374px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .temp-type {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px;
    background: $primary-color;
    color: #fff;
  }
}
</style>

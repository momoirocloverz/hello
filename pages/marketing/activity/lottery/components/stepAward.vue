<!--奖项设置-->
<template>
  <common-form ref="stepRef" :form="lotteryForm" :props="lotteryCon.LOTTERY_AWARDS_PROP" :inline="false">
    <awards-set
      slot="awardSet"
      :campaignEndAt="campaignEndAt"
      :data="priceSetList"
      @addAward="addAward"
      @deleteAward="deleteAward"
      @changeAward="changeAward"
      activeType="lottery"
    />
  </common-form>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import AwardsSet from "../../components/awardsSet.vue";
import { LotteryForm } from "@/@types/activity";
@Component({
  name: "stepAward",
  components: {
    CommonForm,
    AwardsSet
  }
})
export default class StepAward extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @Prop({ default: () => {} }) private lotteryCon: any;
  @State(state => state.activity.lotteryForm) private lotteryForm!: LotteryForm;
  @State(state => state.activity.priceSetList) private priceSetList!: Array<any>;
  @Action("setPriceList", { namespace: "activity" })
  setPriceList: Function;
  get campaignEndAt() {
    if (this.lotteryForm.activeTime) {
      return this.lotteryForm.activeTime[1];
    } else {
      return null;
    }
  }
  /**
   * 新增奖品
   * @param row
   */
  addAward(row: any) {
    let len = this.priceSetList.length + 1;
    switch (this.lotteryForm.marketingToolType) {
      case "SCRATCH_TICKETS":
        //  刮刮乐 20个
        if (len > 19) {
          this.$message.warning("刮刮乐最多设置20个奖项");
          return;
        }
        break;
      case "NINE_BLOCK_BOX":
        // 九宫格 只能8个
        if (len > 7) {
          this.$message.warning("九宫格只能设置8个奖品");
          return;
        }
        break;
    }
    this.priceSetList.push({
      numValid: true,
      perValid: true,
      ...row
    });
  }

  /**
   * 更换奖品
   * @param row
   * @param idx
   */
  changeAward(row: any, idx: number) {
    this.priceSetList.splice(idx, 1, row);
  }

  /**
   * 删除奖品
   * @param row
   * @param idx
   */
  deleteAward(row: any, idx: number) {
    this.priceSetList.splice(idx, 1);
  }
}
</script>

<style scoped></style>

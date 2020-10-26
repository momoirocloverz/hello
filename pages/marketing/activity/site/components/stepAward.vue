<!--奖项设置-->
<template>
  <common-form ref="stepRef" :form="siteForm" :rules="siteCon.SITE_FORM_RULES" :props="siteCon.SITE_AWARDS_PROPS" :inline="false">
    <awards-set
      slot="awardSet"
      :campaignEndAt="campaignEndAt"
      :data="priceSetList"
      @addAward="addAward"
      @deleteAward="deleteAward"
      @changeAward="changeAward"
      activeType="site"
    />
  </common-form>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import AwardsSet from "../../components/awardsSet.vue";
@Component({
  name: "stepAward",
  components: {
    CommonForm,
    AwardsSet
  }
})
export default class StepAward extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @Prop({ default: () => {} }) private siteCon: any;
  @State(state => state.activity.siteForm) private siteForm!: any;
  @State(state => state.activity.priceSetList) private priceSetList!: Array<any>;

  get campaignEndAt() {
    if (this.siteForm.activeTime) {
      return this.siteForm.activeTime[1]
    } else {
      return null;
    }
  }
  /**
   * 新增奖品
   * @param row
   */
  addAward(row: any) {
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

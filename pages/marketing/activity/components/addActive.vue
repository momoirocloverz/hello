<!--新增抽奖活动-->
<template>
  <div class="new-activity">
    <breadcrumb-group :breadGroup="breadGroup" />
    <el-card class="mb-15">
      <el-steps :active="step" align-center class="common_activity-step">
        <el-step :title="step.label" v-for="step in stepArr" :key="step.step" />
      </el-steps>
    </el-card>
    <el-card>
      <div class="common_active-content">
        <slot name="content" :step="step" :currentStepContent="currentStepContent"></slot>
      </div>
      <div class="common_activity-bottom">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button size="small" @click="setStep(-1)" v-if="step > 1">上一步</el-button>
        <el-button size="small" type="primary" @click="setStep(1)" v-if="step < STEP_NUM">下一步</el-button>
        <el-button size="small" type="primary" @click="setStep(1)" v-if="step === STEP_NUM">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import _ from "lodash";
import { SiteForm, LotteryForm, SalesForm } from "@/@types/activity";
@Component({
  name: "newLottery",
  components: {
    CommonForm
  }
})
export default class extends Vue {
  @State(state => state.activity.lotteryForm) private lotteryForm!: LotteryForm;
  @State(state => state.activity.siteForm) private siteForm!: SiteForm;
  @State(state => state.activity.salesForm) private salesForm!: SalesForm;
  @Prop({ default: "lottery" }) private activeType: string;
  @Prop({ default: false }) private hasValid: boolean;
  @Prop({ default: () => [] }) stepArr: Array<{}>;
  @Action("resetActiveForm", { namespace: "activity" })
  resetActiveForm: Function;
  step: number = 1;
  initLotteryForm: any = {};
  initSalesForm: any = {};
  initSiteForm: any = {};
  pageType: any = "";
  currentStepContent: any = this.stepArr[this.step - 1];
  private data = [];
  get breadGroup() {
    let tip = this.pageType === "edit" ? "编辑" : "新建";
    let _pLabelObj: any = {
      lottery: "抽奖活动",
      sales: "促销活动",
      site: "线下活动"
    };
    let pLabel: string = _pLabelObj[this.activeType];
    return [
      { label: pLabel, to: `/marketing/activity/${this.activeType}/index` },
      { label: `${tip}${pLabel}`, to: "" }
    ];
  }

  get STEP_NUM(): number {
    return this.stepArr.length;
  }
  private get valid(): boolean {
    return this.hasValid;
  }
  async setStep(dir: number) {
    if (dir < 0 && this.step > 1) {
      // 上一步
      this.step--;
      this.currentStepContent = this.stepArr[this.step - 1];
    } else if (this.step < this.STEP_NUM) {
      await this.$emit("validateStep", this.step);
      if (this.valid) {
        this.currentStepContent = this.stepArr[this.step];
        this.step++;
      }
    } else if (this.step === this.STEP_NUM) {
      this.currentStepContent = this.stepArr[this.step - 1];
      await this.$emit("validateStep", this.step);
      if (this.valid) {
        this.$emit("submit");
      }
    }
  }
  created() {
    this.initLotteryForm = _.cloneDeep(this.lotteryForm);
    this.initSalesForm = _.cloneDeep(this.salesForm);
    this.initSiteForm = _.cloneDeep(this.siteForm);
    this.pageType = this.$route.query.type || "add";
  }
  cancel() {
    let _equal = true;
    switch (this.activeType) {
      case "lottery":
        _equal = _.isEqual(this.lotteryForm, this.initLotteryForm);
        break;
      case "sales":
        _equal = _.isEqual(this.lotteryForm, this.initSalesForm);
        break;
      case "site":
        _equal = _.isEqual(this.lotteryForm, this.initSiteForm);
        break;
    }
    if (_equal) {
      this.$router.push({
        path: `/marketing/activity/${this.activeType}/index`
      });
    } else {
      this.$confirm("信息未保存，确定要离开？", "提示").then(() => {
        this.$router.push({
          path: `/marketing/activity/${this.activeType}/index`
        });
      });
    }
  }
  beforeDestroy() {
    this.resetActiveForm();
  }
}
</script>

<style lang="scss">
.new-activity {
  .activity-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
}
</style>

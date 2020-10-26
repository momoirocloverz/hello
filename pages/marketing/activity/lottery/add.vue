<!--新增抽奖活动-->
<template>
  <div class="lottery-add">
    <add-active
      activeType="lottery"
      :hasValid="hasValid"
      :stepArr="stepArr"
      @submit="submit"
      @validateStep="validateStep"
    >
      <div slot="content" slot-scope="{ currentStepContent }" v-loading="loading" element-loading-text="保存中">
        <div v-for="item in stepArr" :key="item.step">
          <Component
            ref="componentRef"
            :is="item.name"
            v-if="item.step === currentStepContent.step"
            :form="lotteryForm"
            :lotteryCon="lotteryCon"
          ></Component>
        </div>
      </div>
    </add-active>
    <active-query
      v-if="queryDialog.show"
      activeType="lottery"
      :form="lotteryForm"
      :dialogObj="queryDialog"
    ></active-query>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import stepShareSet from "../components/stepShareSet.vue";
import stepActiveSet from "./components/stepActiveSet.vue";
import stepTemp from "./components/stepTemp.vue";
import stepAward from "./components/stepAward.vue";
import Const from "../const/index";
import LotteryConst from "./const/index";
import _ from "lodash";
import AddActive from "../components/addActive.vue";
import activeQuery from "../components/activeQuery.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import { getLotteryDetail, editLotteryActive, saveLotteryActive } from "@/api";
import { DialogInfo, LotteryForm, ShareForm } from "@/@types/activity";
import defaultImg from "@/assets/images/activity/dft.png";

@Component({
  name: "newLottery",
  components: {
    CommonForm,
    stepShareSet,
    stepActiveSet,
    stepAward,
    stepTemp,
    AddActive,
    activeQuery
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() shareSetRef: { formRef: HTMLFormElement };
  @Ref() stepRef: { formRef: HTMLFormElement };
  @Ref() componentRef: any;
  @State(state => state.activity.shareForm) private shareForm!: ShareForm;
  @Action("setLotteryForm", { namespace: "activity" })
  setLotteryForm: Function;
  setShareContent: Function;
  loading: boolean = false;
  defaultImg: string = defaultImg;

  queryDialog: DialogInfo = {
    title: "活动查询",
    show: false
  };
  private trueTime: boolean = true;
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }
  private get lotteryCon(): any {
    let _obj: any = new LotteryConst(this) || {};
    return _obj.const;
  }
  private agentStepArr = _.cloneDeep(this.lotteryCon.LOTTERY_STEP_ARR) || [];
  private initLotteryForm: LotteryForm = _.cloneDeep(this.lotteryForm);
  private hasValid: boolean = false;
  get stepArr(): Array<any> {
    if ((this.isFactory && this.isPut) || this.isCompany) {
      this.agentStepArr.splice(2, 1);
    }
    return this.agentStepArr;
  }

  /**
   * 根据活动类型判断奖品的个数
   * 九宫格 只能设置8个奖品 1
   * 刮刮乐：最多设置20个奖品 2
   * 大转盘：请设置4个/6个/8个奖品 0
   */
  validatePriceLenByType() {
    let len = this.priceSetList.length;
    let valid = true;
    switch (this.lotteryForm.marketingToolType) {
      case 2:
        if (len > 20) {
          valid = false;
          this.$message.warning("刮刮乐最多设置20个奖品");
        }
        break;
      case 0:
        if (len === 4 || len === 6 || len === 8) {
          valid = true;
        } else {
          valid = false;
          this.$message.warning("大转盘请设置4个/6个/8个奖品");
        }
        break;
      case 1:
        if (len !== 8) {
          valid = false;
          this.$message.warning("九宫格需要设置8个奖项");
        }
        break;
    }
    return valid;
  }
  /**
   * 检验奖品设置
   */
  validatePriceSet() {
    let valid = false;
    let totalPer = 0;
    if (!this.validatePriceLenByType()) {
      return false;
    }
    this.priceSetList.forEach((item: any) => {
      if (!item.probability) {
        item.perValid = false;
      }
      if (!item.quantity && item.id !== -1 && item.prizeId !== -1) {
        item.numValid = false;
      }
      totalPer += Number(item.probability);
      if (item.numValid && item.perValid) {
        valid = true;
      }
    });
    if (totalPer === 100 && valid) {
      this.hasValid = true;
    } else {
      this.$message.warning("请完善奖项设置,中奖概率合计需为100%");
    }
  }

  /**
   * 每一步进行检验
   * @param step
   */
  validateStep(step: number) {
    this.hasValid = false;
    if (this.isAgent || this.isHosted) {
      this.checkTime();
    }
    if ((this.isAgent || this.isHosted) && step === 3) {
      this.validatePriceSet();
    } else {
      let $ref = this.componentRef[0].stepRef;
      $ref.formRef.validate((valid: boolean) => {
        this.hasValid = valid;
      });
    }
  }

  showActiveDialog() {
    if (!this.lotteryForm.activeTime) {
      this.$message.warning("请选择活动时间");
      return;
    }
    this.queryDialog.show = true;
  }

  /**
   * 修改活动时间
   * @param val
   * @param item
   */
  async changeTime(val: Array<any>, item: any) {
    if (val) {
      let [start, end] = val;
      // 因为奖品有效期在活动结束时间之后的奖品，所以修改结束时间会清空奖项
      // 二期 有一个固定奖项
      if (this.priceSetList.length > 1 && this.activeEndTime !== end) {
        this.$confirm("重新选择活动结束时间会清空奖项设置，确定要取消？")
          .then(() => {
            this.setAndCheckTime(val);
            this.resetPriceList();
          })
          .catch(() => {
            // 如果取消，回退到开始的时间
            this.lotteryForm.activeTime = [this.activeStartTime, this.activeEndTime];
          });
      } else {
        this.setAndCheckTime(val);
      }
    } else {
      this.activeLength = 0;
    }
  }

  /**
   * 删除一些无用的参数
   */
  dealActiveParams() {
    let { chanceTime } = this.lotteryForm;
    if (chanceTime.indexOf(2) < 0) {
      this.lotteryForm.taskTypes = [];
      this.lotteryForm.chanceLimit = null;
      this.lotteryForm.chanceMode = null;
    }
    if (chanceTime.indexOf(1) < 0) {
      this.lotteryForm.freeChanceTimes = null;
      this.lotteryForm.freeChanceMode = null;
    }
    delete this.lotteryForm.activeTime;
    delete this.lotteryForm.limitTime;
    delete this.lotteryForm.chanceTime;
  }

  /**
   * 保存
   */
  async submit() {
    let { activeTime, limitTime, chanceTime, prizeValidityPeriod, dayNum } = this.lotteryForm;
    let key = this.isHosted ? "hosted" : this.sysPlat;

    this.loading = true;
    try {
      // 经销商端
      let [validFrom, validTo] = activeTime;
      this.dealActiveParams();
      let _data: any = {};
      if (this.isHosted || this.isAgent) {
        _data = {
          ...this.lotteryForm,
          shareSetting: this.shareForm,
          prizeSettings: this.dealPriceSetList(),
          prizeValidityPeriod: prizeValidityPeriod > 0 ? dayNum : prizeValidityPeriod,
          validFrom,
          validTo
        };
      } else {
        _data = {
          ...this.lotteryForm,
          shareSetting: this.shareForm,
          prizeValidityPeriod: prizeValidityPeriod > 0 ? dayNum : prizeValidityPeriod
        };
      }

      if (this.pageType === "edit") {
        await editLotteryActive(
          {
            ..._data,
            campaignId: this.campaignId
          },
          key
        );
      } else {
        await saveLotteryActive(_data, key);
      }

      // 置空奖项设置
      this.resetPriceList();
      this.loading = false;
      this.$router.push({
        path: `/marketing/activity/lottery/index`
      });
    } catch (e) {
      this.loading = false;
      this.setLotteryForm({
        ...this.lotteryForm,
        activeTime,
        limitTime,
        chanceTime,
        prizeValidityPeriod: prizeValidityPeriod > 0 ? 1 : prizeValidityPeriod
      });

      throw new Error(e);
    }
  }

  /**
   * 复现lotteryForm
   */
  repetitionLotteryForm() {
    let {
      validFrom,
      validTo,
      taskTypes,
      freeChanceTimes,
      freeChanceMode,
      chanceLimit,
      chanceMode,
      prizeValidityPeriod,
      thumbnail
    } = this.actDetailInfo;
    let _form = Object.assign({}, this.lotteryForm, this.actDetailInfo);
    _form.prizeValidityPeriod = prizeValidityPeriod > 0 ? 1 : prizeValidityPeriod;
    _form.dayNum = prizeValidityPeriod > 0 ? prizeValidityPeriod : null;
    _form.activeTime = [validFrom, validTo];
    _form.chanceTime = [];
    _form.thumbnail = thumbnail || defaultImg;
    if (chanceMode && chanceLimit) {
      _form.chanceTime.push(2);
    } else {
      _form.chanceLimit = 1; // 任务次数限制
      _form.chanceMode = "ALL_TIMES"; // 任务次数模式
    }
    if (freeChanceTimes && freeChanceMode) {
      _form.chanceTime.push(1);
    } else {
      _form.freeChanceTimes = 3;
      _form.freeChanceMode = "ALL_TIMES";
    }
    _form.taskTypes = chanceMode ? taskTypes : [];
    this.setLotteryForm(_form);
  }

  /**
   * 获取编辑详情
   */
  async getDetail() {
    let key = this.isHosted ? "hosted" : this.sysPlat;
    if (this.pageType === "edit") {
      await this.getActDetailInfo();
      let res = await getLotteryDetail(
        {
          releaseId: this.releaseId,
          campaignId: this.campaignId
        },
        key
      );
      this.setActDetailInfo(res.data);
      this.repetitionLotteryForm();
    } else {
      this.resetPriceList();
      this.setShareContent({});
    }
  }

  created() {
    this.setActiveType("lottery");
    this.initLotteryForm = _.cloneDeep(this.lotteryForm);
    this.getDetail();
    if (this.isAgent || this.isHosted) {
      this.checkTime();
    }
    if (this.pageType === "add") {
      this.resetPriceList();
    }
  }
}
</script>

<style lang="scss" scoped>
.new-lottery-activity {
  .activity-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
}
</style>

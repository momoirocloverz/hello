<!--新增抽奖活动-->
<template>
  <div>
    <add-active
      activeType="sales"
      :stepArr="stepArr"
      :hasValid="hasValid"
      @submit="submit"
      @validateStep="validateStep"
    >
      <div slot="content" slot-scope="{ currentStepContent }" v-loading="loading" element-loading-text="保存中">
        <div v-for="item in stepArr" :key="item.step">
          <Component
            ref="componentRef"
            :is="item.name"
            v-if="item.step === currentStepContent.step"
            :form="salesForm"
            :constant="salesConst"
          ></Component>
        </div>
      </div>
    </add-active>
    <active-query activeType="sales" :form="salesForm" :dialogObj="queryDialog" v-if="queryDialog.show"></active-query>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import SalesConst from "./const/index";
import AddActive from "../components/addActive.vue";
import stepActiveSet from "./components/stepActiveSet.vue";
import stepGroupGoods from "./components/stepGroupGoods.vue";
import stepShareSet from "../components/stepShareSet.vue";
import { State, Action } from "vuex-class";
import { toCent, toMillion, toDivide } from "@/utils/";
import activeQuery from "../components/activeQuery.vue";
import _ from "lodash";
import { DialogInfo, SalesForm, ShareForm } from "@/@types/activity";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";

import { getEditSaleDetail, editSalesActive, saveSalesActive } from "@/api";
@Component({
  name: "newSales",
  components: {
    AddActive,
    stepActiveSet,
    stepGroupGoods,
    stepShareSet,
    activeQuery
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() readonly componentRef: any;
  @State(state => state.activity.shareForm) private shareForm!: ShareForm;
  @Action("setSalesForm", { namespace: "activity" })
  setSalesForm: Function;
  private loading: boolean = false;
  private hasValid: boolean = false;
  trueTime: boolean = true;
  queryDialog: DialogInfo = {
    title: "活动查询",
    show: false
  };
  private get salesConst() {
    let _config: any = new SalesConst(this) || {};
    return _config.const;
  }

  /**
   * 获取步数
   */
  get stepArr(): Array<any> {
    let arr = _.cloneDeep(this.salesConst.SALES_STEP_ARR);
    if (!this.isAgent) {
      arr.splice(1, 1);
    }
    return arr;
  }

  /**
   * 改变活动时间
   * 如果选择的时间小于当前时间，置为当前时间
   * @param val
   * @param item
   */
  changeTime(val: Array<any>, item: any) {
    if (val) {
      this.activeLength = 0;
      let $ref = this.componentRef[0].stepRef;
      $ref.formRef.clearValidate("activeTime");
      this.setAndCheckTime(val);
    }
  }

  /**
   * 检验商品
   * 最多100个
   */
  validateGoods() {
    if (this.salesForm.reletedGoods.length < 1 || this.salesForm.reletedGoods.length > 100) {
      this.hasValid = false;
      this.$message.warning("请设置团购商品");
    }
  }

  /**
   * 下一步时进行检验
   * 第二步时检验商品是否合适
   * @param step
   */
  validateStep(step: number) {
    if (this.isAgent && step === 2) {
      this.validateGoods();
    } else {
      this.hasValid = false;
      let $ref = this.componentRef[0].stepRef;
      $ref.formRef.validate((valid: boolean) => {
        this.hasValid = valid;
      });
    }
  }

  showActiveDialog() {
    if (!this.salesForm.activeTime) {
      this.$message.warning("请选择活动时间");
      return;
    }
    this.queryDialog.show = true;
  }

  /**
   * 处理参数
   */
  dealParams() {
    let { activeTime, campaignPeopleLimit, information, limitPerson } = this.salesForm;
    let [campaignStartTime, campaignEndTime] = activeTime;
    let hasExpectTime = information.indexOf(3) > -1;
    let goods: Array<any> = [];
    this.salesForm.reletedGoods.forEach((item: any) => {
      let { salesPrice, modelName, goodsGrouponPrice, modelCode } = item;
      goods.push({
        modelName,
        salesPrice,
        goodsGrouponPrice,
        modelCode
      });
    });
    delete this.salesForm.information;
    delete this.salesForm.limitPerson;
    delete this.salesForm.activeTime;
    return {
      ...this.salesForm,
      shareSetting: this.shareForm,
      campaignStartTime: campaignStartTime,
      campaignEndTime: campaignEndTime,
      campaignPeopleLimit: campaignPeopleLimit > 0 ? limitPerson : campaignPeopleLimit,
      hasExpectTime,
      reletedGoods: goods
    };
  }
  /**
   * 获取编辑详情
   */
  async getDetail() {
    let res: any = {};
    if (this.pageType === "edit") {
      res = await getEditSaleDetail(
        {
          campaignId: this.campaignId
        },
        this.sysPlat
      );
      this.setActDetailInfo(res.data);

      this.repetitionSalesForm();
    } else {
      this.setShareContent({});
    }
  }
  /**
   * 编辑时候回显
   */
  repetitionSalesForm() {
    let { dateFrom, dateTo, campaignPeopleLimit } = this.actDetailInfo;
    let _form = Object.assign({}, this.salesForm, this.actDetailInfo);
    _form.limitPerson = campaignPeopleLimit > 0 ? campaignPeopleLimit : null;
    _form.campaignPeopleLimit = campaignPeopleLimit > 0 ? 1 : -1;
    if (this.actDetailInfo.hasExpectTime) {
      _form.information.push(3);
    }
    _form.activeTime = [dateFrom, dateTo];
    this.setSalesForm(_form);
  }
  async submit() {
    this.loading = true;
    let { activeTime, campaignPeopleLimit, information, limitPerson } = this.salesForm;
    try {
      let hasExpectTime = information.indexOf(3) > -1;
      let _data: any = {
        ...this.salesForm,
        shareSetting: this.shareForm,
        hasExpectTime
      };
      if (this.isAgent) {
        _data = this.dealParams();
      }
      if (this.pageType === "edit") {
        await editSalesActive(
          {
            ..._data,
            id: this.campaignId
          },
          this.sysPlat
        );
      } else {
        await saveSalesActive(_data, this.sysPlat);
      }
      this.$router.push({
        path: `/marketing/activity/sales/index`
      });
      // 置空奖项设置
      this.setShareContent({});
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.setSalesForm({
        ...this.salesForm,
        activeTime,
        information,
        limitPerson,
        campaignPeopleLimit: campaignPeopleLimit > 0 ? 1 : -1
      });

      throw new Error(e);
    }
  }

  created() {
    this.setActiveType("sales");
    this.getDetail();
    if (this.isAgent || this.isHosted) {
      if (this.pageType !== "edit") {
        this.checkTime();
      }
    }
  }
  beforeDestroy() {
    this.setShareContent({});
  }
}
</script>

<style lang="scss">
.new-sales-activity {
  .box {
    padding: 5px;
    border: 1px solid $card-border;
  }
}
</style>

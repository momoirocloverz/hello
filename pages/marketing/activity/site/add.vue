<!--新增线下活动-->
<template>
  <div>
    <add-active activeType="site" :stepArr="stepArr" :hasValid="hasValid" @submit="submit" @validateStep="validateStep">
      <div slot="content" slot-scope="{ currentStepContent }" v-loading="loading" element-loading-text="保存中">
        <div v-for="item in stepArr" :key="item.step">
          <Component
            ref="componentRef"
            :class="item.name"
            :is="item.name"
            v-if="item.step === currentStepContent.step"
            :form="siteForm"
            :siteCon="siteCon"
          ></Component>
        </div>
      </div>
    </add-active>
    <active-query activeType="site" :dialogObj="queryDialog" :form="siteForm" v-if="queryDialog.show"></active-query>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import stepShareSet from "../components/stepShareSet.vue";
import AwardsSet from "../components/awardsSet.vue";
import SiteCon from "./const/index";
import AddActive from "../components/addActive.vue";
import stepActiveSet from "./components/stepActiveSet.vue";
import stepAward from "./components/stepAward.vue";
import { State, Action } from "vuex-class";
import _ from "lodash";
import { getSiteDetail, editSiteActive, saveSiteActive } from "@/api";
import activeQuery from "../components/activeQuery.vue";
import { DialogInfo, ShareForm } from "@/@types/activity";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "newSite",
  components: {
    AddActive,
    stepShareSet,
    AwardsSet,
    stepAward,
    stepActiveSet,
    activeQuery
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() readonly componentRef: any;
  @State(state => state.activity.shareForm) private shareForm!: ShareForm;
  @Action("setSiteForm", { namespace: "activity" })
  setSiteForm: Function;
  trueTime: boolean = true;
  loading: boolean = false;
  activeEndTime: number;
  activeStartTime: number;
  private get siteCon(): any {
    let _obj = new SiteCon(this);
    return _obj.const;
  }
  private hasValid: boolean = false;
  queryDialog: DialogInfo = {
    title: "活动查询",
    show: false
  };

  get stepArr(): any[] {
    let arr = _.cloneDeep(this.siteCon.SITE_STEP_ARR);
    if ((this.isFactory && this.isPut) || this.isCompany) {
      arr.splice(1, 1);
    }
    return arr;
  }

  /**
   * 切换活动时间
   * @param val
   */
  changeActTime(val: Array<number>) {
    if (val) {
      let [start, end] = val;
      // 因为奖品有效期在活动结束时间之后的奖品，所以修改时间会清空奖项
      if (this.priceSetList.length > 0 && end !== this.activeEndTime) {
        if (this.siteForm.tool.indexOf(3) < 0) {
          return;
        }
        this.$confirm("重新选择活动结束时间会清空奖项设置，确定要取消？")
          .then(() => {
            this.siteForm.regTime = [];
            this.setAndCheckTime(val);
            this.setPriceList([]);
          })
          .catch(() => {
            // 如果取消，回退到开始的时间
            this.siteForm.activeTime = [this.activeStartTime, this.activeEndTime];
          });
      } else {
        this.siteForm.regTime = [];
        this.setAndCheckTime(val);
      }
    } else {
      this.activeLength = 0;
    }
  }

  /**
   * 切换签到时间
   * @param val
   * @param item
   */
  changeRegTime(val: Array<any>, item: any) {
    if (val) {
      let [start, end] = val;
      if (val[0] < Date.now()) {
        this.siteForm.regTime[0] = Date.now() + 5 * 60 * 1000;
      } else {
        this.siteForm.regTime[0] = start;
      }
      this.siteForm.regTime[1] = end;
      if (val[1] < Date.now() || val[1] < this.siteForm.regTime[0]) {
        this.siteForm.regTime[1] = this.siteForm.regTime[0] + 2 * 60 * 60 * 1000;
      }
    }
  }

  /**
   * 检验奖项
   */
  validatePriceSet() {
    if (this.siteForm.tool.indexOf(3) > -1) {
      let valid = true;
      if (this.priceSetList.length < 1) {
        this.hasValid = false;
        this.$message.warning("请设置奖项");
        return false;
      }
      if (this.siteForm.tool.indexOf(3) > -1) {
        this.priceSetList.forEach((item: any) => {
          if (!item.quantity) {
            item.numValid = false;
            item.numMsg = "请输入奖品个数";
            valid = false;
          }
          valid = item.numValid;
        });
        this.hasValid = valid;
      } else {
        this.hasValid = true;
      }
    } else {
      this.hasValid = true;
    }
  }

  /**
   * 显示活动查询
   */
  showActiveDialog() {
    if (!this.siteForm.activeTime) {
      this.$message.warning("请选择活动时间");
      return;
    }
    this.queryDialog.show = true;
  }

  /**
   * 检验步数
   * @param step
   */
  validateStep(step: number) {
    this.hasValid = false;
    if (this.isAgent && step === 2) {
      this.validatePriceSet();
    } else {
      let $ref = this.componentRef[0].stepRef;
      $ref.formRef.validate((valid: boolean) => {
        this.hasValid = valid;
      });
    }
  }

  /**
   * 处理分数
   */
  dealParams() {
    delete this.siteForm.activeTime;
    delete this.siteForm.tool;
    delete this.siteForm.information;
    delete this.siteForm.campaignStatus;
    delete this.siteForm.approvalStatus;
  }

  /**
   * 处理数据
   */
  dealData(): any {
    let { activeTime, regTime, limitPerson, memberLimit, tool } = this.siteForm;
    let [validFrom, validTo] = activeTime;
    let [signinValidFrom, signinValidTo] = regTime;
    memberLimit = memberLimit > 0 ? limitPerson : -1;
    let luckydrawEnabled = tool.indexOf(3) > -1; // 是否开启大屏抽奖
    let messageBoardEnabled = tool.indexOf(2) > -1; // 是否开启留言墙
    let signinEnabled = tool.indexOf(1) > -1; // 是否开启现场签到
    return {
      ...this.siteForm,
      shareSetting: this.shareForm,
      prizeSettings: this.dealPriceSetList(),
      validFrom,
      validTo,
      memberLimit,
      signinValidTo,
      signinValidFrom,
      luckydrawEnabled,
      messageBoardEnabled,
      signinEnabled
    };
  }

  /**
   * 提交
   */
  async submit() {
    let { activeTime, information, regTime, tool, limitPerson, memberLimit } = this.siteForm;
    try {
      this.loading = true;
      let key = this.isHosted ? "hosted" : this.sysPlat;
      let _data: any = {};
      if (this.isHosted || this.isAgent) {
        // 自办和经销商
        _data = this.dealData();
      } else {
        _data = {
          ...this.siteForm,
          shareSetting: this.shareForm
        };
      }
      this.dealParams();
      if (this.pageType === "edit") {
        await editSiteActive(
          {
            ..._data,
            campaignId: this.campaignId
          },
          key
        );
      } else {
        await saveSiteActive(_data, key);
      }
      this.loading = false;
      // 置空奖项设置
      this.setPriceList([]);
      this.$router.push({
        path: `/marketing/activity/site/index`
      });
    } catch (e) {
      this.loading = false;
      this.setSiteForm({
        ...this.siteForm,
        activeTime,
        regTime,
        tool,
        limitPerson,
        information,
        memberLimit: memberLimit > 0 ? 1 : -1
      });

      throw new Error(e);
    }
  }

  /**
   * 复现siteForm
   */
  repetitionSiteForm() {
    let {
      validFrom,
      validTo,
      signinValidFrom,
      signinValidTo,
      campaignName,
      name,
      memberLimit,
      luckydrawEnabled,
      messageBoardEnabled
    } = this.actDetailInfo;
    let _form = Object.assign({}, this.siteForm, this.actDetailInfo);
    _form.activeTime = [validFrom, validTo];
    _form.regTime = [signinValidFrom, signinValidTo];
    _form.name = campaignName || name;
    _form.limitPerson = memberLimit > -1 ? memberLimit : null;
    _form.tool = [1];
    if (messageBoardEnabled) {
      _form.tool.push(2);
    }
    if (luckydrawEnabled) {
      _form.tool.push(3);
    }
    this.setSiteForm(_form);
  }

  /**
   * 获取详情
   * 主机厂数据从列表处获取
   */
  async getDetail() {
    if (this.pageType === "edit") {
      if (this.isAgent || this.isHosted) {
        let res = await getSiteDetail({
          releaseId: this.releaseId
        });
        this.setActDetailInfo(res.data);
      }
      await this.getActDetailInfo();
      this.repetitionSiteForm();
    } else {
      this.setShareContent({});
    }
  }
  created() {
    this.setActiveType("site");
    this.getActDetailInfo();
    this.getDetail();
    if (this.isAgent || this.isHosted) {
      this.checkTime();
    }
    if (this.pageType === "add") {
      this.setPriceList([]);
    }
  }
  beforeDestroy() {
    this.setShareContent({});
    this.setPriceList([]);
  }
}
</script>

<style lang="scss"></style>

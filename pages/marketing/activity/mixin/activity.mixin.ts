import { Component, Vue, Prop } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import { SiteForm, LotteryForm, SalesForm } from "@/@types/activity";
import {
  checkActiveTime,
  stopActive,
  deleteHostedActive,
  putHostedActive,
  getFactoryDealer,
  getBu2Region
} from "@/api";
import { numToUppercase, toDivide } from "@/utils/";
import { ActiveStatistics } from "@/@types/activity";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  inheritAttrs: false
})
export default class ActivityMixin extends Vue {
  // 活动类型 '抽奖活动-lottery','促销活动-sales','线下活动-site'
  // @Prop({ type: String, default: "lottery" }) activeType: string;
  @State(state => state.activity.lotteryForm) lotteryForm!: LotteryForm;
  @State(state => state.activity.salesForm) salesForm!: SalesForm;
  @State(state => state.activity.siteForm) siteForm!: SiteForm;
  @State(state => state.activity.actDetailInfo) actDetailInfo!: any;
  @State(state => state.activity.priceSetList) priceSetList!: any;
  @State(state => state.activity.activeType) activeType!: any;
  @State(state => state.activity.activeItem) activeItem!: any;
  @Action("setActDetailInfo", { namespace: "activity" })
  setActDetailInfo: Function;
  @Action("getActDetailInfo", { namespace: "activity" })
  getActDetailInfo: Function;
  @Action("setShareContent", { namespace: "activity" })
  setShareContent: Function;
  @Action("resetPriceList", { namespace: "activity" })
  resetPriceList: Function;
  @Action("setPriceList", { namespace: "activity" })
  setPriceList: Function;
  @Action("setActiveType", { namespace: "activity" })
  setActiveType: Function;
  @Action("setActiveItem", { namespace: "activity" })
  setActiveItem: Function;
  activeEndTime: number;
  activeStartTime: number;
  activeLength: number = 0;
  activityData: Array<ActiveStatistics> = [
    {
      name: "活动浏览量",
      type: "line",
      total: 0,
      id: "pageViewLine",
      data: [],
      color: ["rgba(18,125,215,1)", "rgba(18,125,215,0.05)"]
    },
    {
      name: "活动浏览人次",
      type: "line",
      id: "userViewLine",
      total: 0,
      data: [],
      color: ["rgba(57, 176, 209, 1)", "rgba(57, 176, 209, 0.05)"]
    }
  ];
  bu2Region: Array<any> = [];
  allRegion: Array<any> = [];
  dealerList: Array<any> = [];
  buId: any = "";
  region: any = "";
  get sysPlat(): string {
    return <any>this.$route.query.sysPlat;
  }
  get isFactory() {
    return this.sysPlat === "factory";
  }
  get isAgent() {
    return this.sysPlat === "agent";
  }
  get isCompany() {
    return this.sysPlat === "company";
  }
  get isHosted() {
    return this.mode === "hosted";
  }
  get isPut() {
    return this.mode === "put";
  }
  get releaseId() {
    return (<any>this.$route.query).releaseId;
  }
  get activeId() {
    return (<any>this.$route.params).id;
  }
  get campaignId() {
    return (<any>this.$route.query).id;
  }
  get mode(): string {
    return (<any>this.$route.query).mode;
  }

  get pageType(): string {
    return (<any>this.$route.query).type || "add";
  }
  get activeLen(): number {
    return this.activeLength;
  }
  get curForm(): any {
    let formMap: any = {
      lottery: this.lotteryForm,
      sales: this.salesForm,
      site: this.siteForm
    };
    return formMap[this.activeType];
  }
  get dealerCode() {
    let _dealerCode;
    if (this.isAgent) {
      let _info = storeInfoSetting.getInfo().info || {};
      _dealerCode = _info.dealerCode;
    }
    return _dealerCode;
  }
  get detailSearchParams(): any {
    let dealerCode;
    let _obj: any = {
      campaignId: this.activeId
    };

    if (this.activeItem === "agent") {
      if (!this.isAgent) {
        dealerCode = this.$route.query.dealerCode || "";
      }
      _obj.dealerCode = dealerCode;
    }
    if (this.isAgent) {
      dealerCode = this.dealerCode;
      _obj.dealerCode = dealerCode;
    }
    return _obj;
  }
  get initFilter(): any {
    let info = storeInfoSetting.getInfo().info;
    if (this.bu2Region.length > 0) {
      return {
         businessUnitId: info.businessUnitId || ""
      };
    } else {
      return {};
    }
  }
  /**
   * 设置并检验活动时间
   * @param val
   */
  setAndCheckTime(val: Array<any>) {
    let [start, end] = val;
    this.activeEndTime = end;
    this.activeStartTime = start;
    this.curForm.activeTime = val;
    if (val[0] < Date.now()) {
      this.curForm.activeTime[0] = Date.now() + 10 * 60 * 1000;
    }
    if (val[1] < Date.now() || val[1] < this.curForm.activeTime[0]) {
      this.curForm.activeTime[0] = this.curForm.activeTime[0] + 2 * 60 * 60 * 1000;
    }
    this.checkTime();
  }
  /**
   * 检验活动时间冲突
   * 二期改为活动查询，不需要进行时间检验
   **/
  async checkTime() {
    let { activeTime } = this.curForm;
    let [validFrom, validTo] = activeTime;
    let campaignTypeMap: any = {
      lottery: 0,
      sales: 1,
      site: 2
    };
    let res = await checkActiveTime({
      releaseId: this.pageType === "edit" ? this.releaseId : null,
      campaignType: campaignTypeMap[this.activeType],
      marketingToolType: this.activeType === "lottery" ? this.curForm.marketingToolType || 0 : null,
      validFrom,
      validTo,
      scenario: this.sysPlat === "factory" ? "MANUFACTOR_SELF_MADE" : "DEALER_SELF_MADE_OR_RELEASE"
    });
    this.activeLength = res.totalCount;
    // let $ref = this.componentRef[0].stepRef;
    // $ref.formRef.validateField("activeTime");
  }
  /**
   * 处理奖项设置
   */
  dealPriceSetList() {
    let data: Array<any> = [];
    this.priceSetList.forEach((item: any, idx: number) => {
      let { id, prizeId, quantity } = item;
      let probability = this.activeType === "lottery" ? toDivide(item.probability, 100) - 0 : 0;
      let level = idx + 1;
      let levelTitle = "";
      if (this.activeType === "site") {
        levelTitle = `${numToUppercase(level)}等奖`;
      } else {
        levelTitle = idx ? `${numToUppercase(idx)}等奖` : "谢谢参与";
      }
      data.push({
        level,
        levelTitle: levelTitle,
        prizeId: id || prizeId,
        probability,
        quantity
      });
    });
    return data;
  }
  editHostedActive(row: any) {
    this.setActDetailInfo(row);
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        type: "edit",
        id: row.id || row.campaignId,
        releaseId: row.releaseId,
        mode: "hosted"
      }
    });
  }
  async stopHostedActive(row: any) {
    return new Promise((resolve, reject) => {
      let h = this.$createElement;
      let message: any = h("div", {}, [h("p", {}, `确定要终止该活动？`), h("p", `终止后活动将立即结束`)]);
      this.$confirm(message, "终止活动").then(async () => {
        try {
          await stopActive({
            id: row.id,
            releaseId: row.releaseId,
            activeType: this.activeType
          });
          this.$message.success("活动终止成功");
          resolve();
        } catch (e) {
          reject(e);
          throw new Error(e);
        }
      });
    });
  }
  deletedHostedActivity(row: any) {
    return new Promise((resolve, reject) => {
      let h = this.$createElement;
      let message: any = h("div", {}, [
        h("p", {}, `确定要删除该活动？`),
        h("p", { class: "common_tip" }, `删除后无法恢复`)
      ]);
      this.$confirm(message, "提示").then(async () => {
        try {
          await deleteHostedActive({
            id: row.id,
            releaseId: row.releaseId,
            campaignId: row.campaignId,
            activeType: this.activeType
          });
          this.$message.success("活动删除成功");
          resolve();
        } catch (e) {
          reject(e);
          throw new Error(e);
        }
      });
    });
  }
  async hasPutHosted(hasSelected: any[]) {
    let dealerCodeList: Array<any> = [];
    hasSelected.forEach(item => {
      dealerCodeList.push(item.dealerCode);
    });
    return new Promise(async (resolve, reject) => {
      try {
        let { code } = this.actDetailInfo;
        await putHostedActive({
          campaignCode: code,
          data: dealerCodeList
        });
        this.$message.success("活动投放成功");
        resolve();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  async loadBu2Region() {
    let params = { buCodeList: "" };
    let res = await getBu2Region(params);
    this.bu2Region = res.data;
    if (this.bu2Region.length === 1) {
      this.buId = this.bu2Region[0].id;
      this.changeBu2(this.buId);
    }
  }
  changeBu2(val: any) {
    this.buId = val;
    if (this.bu2Region.length > 0) {
      for (let i = 0; i < this.bu2Region.length; i++) {
        let item = this.bu2Region[i];
        if (item.id === val) {
          this.allRegion = item.regionList || [];
        }
      }
    }
  }
  async changeRegion(val: any) {
    this.region = val;
    let res = await getFactoryDealer({
      page: 1,
      size: 1000,
      regionId: this.region,
      buId: this.buId
    });
    this.dealerList = res.data;
  }
  mounted() {
    if (this.activeType === "sales" || this.activeType === "site") {
      this.activityData.push({
        name: "活动报名人次",
        type: "line",
        id: "enrollmentLine",
        total: 0,
        data: [],
        color: ["rgba(126, 211, 33, 1)", "rgba(126, 211, 33, 0.05)"]
      });
    } else if (this.activeType === "lottery") {
      this.activityData.push(
        {
          name: "活动参与人次",
          type: "line",
          total: 0,
          id: "participationLine",
          color: ["rgba(126, 211, 33, 1)", "rgba(126, 211, 33, 0.05)"],
          data: []
        },
        {
          name: "活动中奖人次",
          type: "line",
          total: 0,
          id: "awardLine",
          color: ["rgba(247, 224, 90, 1)", "rgba(247, 224, 90, 0.05)"],
          data: []
        }
      );
    }
  }
}

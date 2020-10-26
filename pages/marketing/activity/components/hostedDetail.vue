<!--主办活动投放详情-->
<template>
  <div class="hosted-detail" v-loading="loading">
    <breadcrumb-group :breadGroup="breadGroup" />
    <!--活动详情-->
    <el-card class="mb-15">
      <el-row :gutter="20" class="detail-card">
        <el-col :xl="4" :lg="6" class="left">
          <img class="pic" :src="hostedDetail.posterUrl" />
        </el-col>
        <el-col :xl="16" :lg="14" class="content">
          <strong class="name">{{ hostedDetail.name }}</strong>
          <el-row :gutter="10" class="desc mb-15">
            <el-col :span="10" class="item">活动类型: {{ activeTypeText }}</el-col>
            <el-col :span="9" class="item">创建人:{{ hostedDetail.createdBy || hostedDetail.creatorName }} </el-col>
          </el-row>
          <el-row :gutter="10" class="desc">
            <el-col :span="10" class="item">活动时间: {{ activeTime || "-" }}</el-col>
            <el-col :span="9" class="item"
              >创建时间: {{ (hostedDetail.createdTime || hostedDetail.createdAt) | momentTime }}</el-col
            >
          </el-row>
          <div class="btn-list">
            <el-button size="small" v-if="!btn.hide" v-for="(btn, idx) in btns" :key="idx" @click="handleBtn(btn)">{{
              btn.label
            }}</el-button>
            <active-tool :toolArr="toolBtn" :row="hostedDetail"></active-tool>
          </div>
        </el-col>
        <el-col :xl="4" :lg="4" class="right">
          <div
            class="common_detail-status-text"
            :class="`text-${actDetailInfo.campaignStatus || actDetailInfo.status}`"
          >
            {{ activeStatus }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="活动统计">
          <activity-chart></activity-chart>
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <div class="mb-15">
            <strong>活动设置</strong>
            <common-form :form="hostedDetail" :props="activeSetProp">
              <img class="active-img" alt="活动图片" :src="hostedDetail.posterUrl" slot="posterUrl" />
              <el-button size="small" slot="description" @click="preview" v-if="activeType === 'site'">预览</el-button>
            </common-form>
          </div>
          <div class="mb-15" v-if="activeType === 'lottery'">
            <strong>奖项设置</strong>
            <awards-set class="mt-15" :data="prizeSettings" usedFrom="lottery" activeType="lottery"></awards-set>
          </div>
          <div v-else>
            <strong>现场工具</strong>
            <common-form :form="hostedDetail" :props="constant.DETAIL_SITE_AWARDS_PROPS">
              <awards-set
                class="mt-15"
                slot="awardSet"
                :data="prizeSettings"
                usedFrom="sites"
                activeType="site"
              ></awards-set>
            </common-form>
          </div>
          <div class="mb-15" v-if="hostedDetail.shareSetting">
            <strong>分享设置</strong>
            <common-form :form="hostedDetail.shareSetting" :props="commonConst.DETAIL_SHARE_PROPS">
              <img
                class="share-img"
                :src="hostedDetail.shareSetting && hostedDetail.shareSetting.image"
                alt="分享图片"
                slot="image"
              />
            </common-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="投放经销商">
          <search-table
            class="issued-table"
            ref="issuedTableRef"
            :url="loadUrl"
            :tableColumns="constant.HOSTED_DEALER_COLUMNS"
            :searchConfig="constant.HOSTED_DEALER_SEARCH_CONFIG"
            :initFilter="initFilter"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--下发活动-->
    <issued-active-dialog
      ref="issuedActiveRef"
      :activeType="activeType"
      :dialogObj="issuedDialog"
      @hasPutHostedActive="hasPutHostedActive"
      @closeIssued="closeIssued"
    ></issued-active-dialog>
    <preview-dialog
      :description="hostedDetail.description"
      :dialogObj="preDialog"
      @hidePreview="hidePreview"
    ></preview-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import DetailInfo from "./detailInfo.vue";
import searchTable from "@/components/search-table/index.vue";
import Const from "../const/factory";
import { getToolBtnByItem } from "../const/";
import ActiveTool from "./activeTool.vue";

import { getLotteryDetail, getSiteDetail } from "@/api";
import { formatDate, toMultipliedBy } from "@/utils/";
import commonForm from "@/components/common-form/index.vue";
import awardsSet from "./awardsSet.vue";
import * as commonConst from "../const/common";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import activityChart from "./activityChart.vue";
import { TOOL_LIST } from "@/mock/marketing";
import IssuedActiveDialog from "./issuedActiveDialog.vue";
import { DialogInfo } from "@/@types/activity";
import previewDialog from "../site/components/previewDialog.vue";
import commonDealerFilter from "@/components/common-dealer-filter/index.vue";
@Component({
  name: "putDetail",
  components: {
    DetailInfo,
    searchTable,
    commonForm,
    awardsSet,
    activityChart,
    ActiveTool,
    IssuedActiveDialog,
    previewDialog,
    commonDealerFilter
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private issuedTableRef: any;
  @Prop({ type: String, default: "hosted" }) private type: string;
  readonly commonConst: any = commonConst;
  hostedDetail: any = {};
  getBtnByStatus: Function = this.config.getBtnByStatus;
  getHostedBtnByStatus: Function = this.config.getHostedBtnByStatus;
  options: Array<any> = [];
  loading: Boolean = false;
  id: any = null;
  private issuedDialog: DialogInfo = {
    title: "下发活动",
    show: false,
    info: {}
  };
  private preDialog: DialogInfo = {
    title: "预览",
    show: false
  };
  get activeTime(): string {
    let { validFrom, validTo } = this.hostedDetail;
    return validFrom ? formatDate(validFrom) + "~" + formatDate(validTo) : "-";
  }
  private get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }
  get typeArr(): Array<any> {
    switch (this.activeType) {
      case "lottery":
        return TOOL_LIST[0].children;
      case "sales":
        return TOOL_LIST[1].children;
      case "site":
        return TOOL_LIST[2].children;
      default:
        return [];
    }
  }
  get prizeSettings(): any[] {
    let arr = this.hostedDetail.prizeSettings || [];
    return arr.map((item: any) => {
      return {
        ...item,
        probability: toMultipliedBy(item.probability, 100)
      };
    });
  }
  get toolBtn(): Array<any> {
    return getToolBtnByItem(this.hostedDetail);
  }
  get campaignType(): string {
    let { marketingToolType } = this.hostedDetail;
    let _obj: any = this.typeArr.find((item: any) => item.id === marketingToolType) || {};
    return _obj.name || "";
  }
  get activeTypeText(): string {
    return this.activeType === "sales" ? "限时团购" : this.activeType === "site" ? "线下活动" : this.campaignType;
  }
  get activeSetProp(): any {
    switch (this.activeType) {
      case "lottery":
        return this.constant.LOTTERY_DETAIL_ACTIVE_PROP;
      case "sales":
        return this.constant.SALES_DETAIL_ACTIVE_PROP;
      case "site":
        return this.constant.SITE_DETAIL_ACTIVE_PROP;
      default:
        return this.constant.LOTTERY_DETAIL_ACTIVE_PROP;
    }
  }
  get btns(): Array<any> {
    return this.getHostedBtnByStatus(this.hostedDetail).filter((btn: any) => {
      return btn.label !== "详情";
    });
  }
  get breadGroup() {
    let _pLabelObj: any = {
      lottery: "抽奖活动",
      sales: "促销活动",
      site: "线下活动"
    };
    let pLabel: string = _pLabelObj[this.activeType];
    let label = "投放详情";

    return [{ label: pLabel, to: `/marketing/activity/${this.activeType}/index` }, { label: label, to: "" }];
  }

  get dealerOption(): Array<any> {
    return this.options || [];
  }

  /**
   * 获取下发经销商
   * @returns {string}
   */
  get loadUrl(): string {
    let url: string = "";
    if (this.id) {
      url = `campaign/common/sponsored/${this.id}/issued_dealer`;
    }
    return url;
  }

  get activeStatus(): string {
    let { campaignStatus, status } = this.hostedDetail;
    let _status = this.activeType === "lottery" ? status : campaignStatus;
    let _obj = this.constant.GROUP_STATUS_OBJ;
    return _obj[_status];
  }

  async getActiveDetail() {
    let res: any;
    if (this.activeType === "lottery") {
      res = await getLotteryDetail(
        {
          releaseId: this.releaseId
        },
        "hosted"
      );
    } else {
      res = await getSiteDetail({
        releaseId: this.releaseId
      });
    }
    this.hostedDetail = res.data;
    this.loading = false;
  }
  editHosted(row: any) {
    this.editHostedActive(row);
    this.getActiveDetail();
  }
  /**
   * 主办活动删除
   */
  deleteHosted(row: any) {
    this.deletedHostedActivity(row).then(() => {
      this.$router.push({
        path: `/marketing/activity/${this.activeType}/index`
      });
    });
  }
  stopHosted(row: any) {
    this.stopHostedActive(row).then(() => {
      this.getActiveDetail();
    });
  }
  handleBtn(item: any) {
    item.handler();
  }

  putInHosted(row: any) {
    this.setActDetailInfo(row);
    this.issuedDialog.type = "put";
    this.issuedDialog.show = true;
    this.issuedDialog.title = "投放活动";
  }

  async hasPutHostedActive(hasSelected: Array<any>) {
    this.hasPutHosted(hasSelected).then(() => {
      this.issuedDialog.show = false;
      this.issuedDialog.type = "";
      this.getActiveDetail();
    });
  }
  closeIssued() {
    this.issuedDialog.show = false;
    this.issuedDialog.type = "";
  }
  hidePreview() {
    this.preDialog.show = true;
  }
  preview() {
    this.preDialog.show = true;
  }
  setFilterForm(params: any) {
    this.issuedTableRef.setFilterForm(params);
  }
  changeBuId(val: any) {
    this.changeBu2(val);
    this.setFilterForm({ regionId: null, dealerCode: null });
  }
  changeAllRegion(val: any) {
    this.changeRegion(val);
    this.setFilterForm({ dealerCode: null });
  }
  created() {
    this.id = this.$route.params.id;
    this.loading = true;
    this.getActiveDetail();
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss">
.hosted-detail {
  .detail-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      .pic {
        width: 200px;
        height: 200px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      .name {
        display: inline-block;
        color: #091017;
        font-size: 28px;
        margin-bottom: 20px;
      }
      .desc {
        color: #8a96a0;
        font-size: 12px;
        .item {
          margin-right: 15px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .btn-list {
        align-items: flex-end;
        margin-top: 20px;
      }
    }
  }

  .put-issued {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }
  .btn-list {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-top: 20px;
    .site-tool {
      margin-left: 15px;
    }
  }

  .issued-table {
    margin-top: 20px;
  }
  .active-img {
    max-width: 355px;
    max-height: 193px;
  }
  .share-img {
    max-width: 200px;
    max-height: 200px;
  }
}
</style>

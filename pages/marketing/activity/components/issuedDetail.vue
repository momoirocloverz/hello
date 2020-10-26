<!--下发详情-->
<template>
  <div class="issued-detail" v-loading="loading">
    <breadcrumb-group :breadGroup="breadGroup" />
    <!--活动详情-->
    <el-card class="mb-15">
      <el-row :gutter="20" class="detail-card">
        <el-col :xl="4" :lg="6" class="left">
          <img alt="活动图片" class="pic" :src="issuedDetailObj.posterUrl" />
        </el-col>
        <el-col :xl="16" :lg="14" class="content">
          <strong class="name">{{ issuedDetailObj.name }}</strong>
          <el-row :gutter="10" class="desc mb-15">
            <el-col :span="10" class="item">活动类型: {{ issuedDetailObj.type }}</el-col>
            <el-col :span="9" class="item">创建人:{{ issuedDetailObj.createdBy }} </el-col>
          </el-row>
          <el-row :gutter="10" class="desc">
            <el-col :span="10" class="item">下发时间: {{ issuedAt }}</el-col>
            <el-col :span="9" class="item"
              >创建时间: {{ (issuedDetailObj.createdTime || issuedDetailObj.createdAt) | momentTime }}</el-col
            >
          </el-row>
        </el-col>
        <el-col :xl="4" :lg="4" class="right">
          <div class="put-issued">
            <div>{{ issuedDetailObj.releaseCount || 0 }}/{{ issuedDetailObj.issueCount || 0 }}</div>
            <div>投放/下发经销商</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="活动统计">
          <activity-chart activeType="site" />
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <div class="mb-15">
            <strong>活动设置</strong>
            <common-form :form="actDetailInfo" :props="activeSetProp">
              <img class="active-img" alt="活动图片" :src="actDetailInfo.posterUrl" slot="posterUrl" />
              <img class="active-img" alt="活动图片" :src="actDetailInfo.campaignImageUrl" slot="campaignImageUrl" />
              <el-button size="small" slot="description" @click="preview" v-if="activeType === 'site'">预览</el-button>
            </common-form>
          </div>
          <div class="mb-15">
            <strong>分享设置</strong>
            <common-form :form="actDetailInfo.shareSetting || {}" :props="commonConst.DETAIL_SHARE_PROPS">
              <img
                class="share-img"
                :src="actDetailInfo.shareSetting && actDetailInfo.shareSetting.image"
                alt="分享图片"
                slot="image"
              />
            </common-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="下发经销商">
          <search-table
            class="issued-table"
            ref="issuedTableRef"
            :url="loadUrl"
            :tableColumns="constant.ISSUED_DEALER_COLUMNS"
            :searchConfig="constant.ISSUED_DEALER_SEARCH"
            :proxyQuery="proxyQuery"
            :initFilter="initFilter"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <preview-dialog
      :description="actDetailInfo.description"
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

import { getIssuedDetail, cancelIssuedActive, getFactoryDealer, getLotteryDetail, getEditSaleDetail } from "@/api";
import { formatDate } from "@/utils/";
import commonForm from "@/components/common-form/index.vue";
import * as commonConst from "../const/common";
import activityChart from "./activityChart.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import previewDialog from "../site/components/previewDialog.vue";
@Component({
  name: "issuedDetail",
  components: {
    DetailInfo,
    searchTable,
    commonForm,
    activityChart,
    previewDialog
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private issuedTableRef: any;
  @Prop({ type: String, default: "detail" }) private type: string;

  readonly commonConst: any = commonConst;
  getBtnByStatus: Function = this.config.getBtnByStatus;
  options: Array<any> = [];
  loading: Boolean = false;
  id: any = null;
  issuedDetailObj: any = {};
  preDialog: any = {
    title: "预览",
    show: false
  };
  private get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }
  get issuedAt() {
    return this.issuedDetailObj.issueAt ? formatDate(this.issuedDetailObj.issueAt) : "-";
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
  get breadGroup() {
    let label = "下发详情";
    let txtMap: any = {
      lottery: "抽奖活动",
      sales: "促销活动",
      site: "线下活动"
    };
    let pLabel: string = txtMap[this.activeType];

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
      url = `campaign/common/template/${this.id}/issued_dealer`;
    }
    return url;
  }

  /**
   * 去活动详情
   * @param row
   */
  detail(row: any) {
    this.setActiveItem("agent");
    this.$router.push({
      name: `marketing-activity-${this.activeType}-detail`,
      params: {
        id: row.campaignId
      },
      query: {
        releaseId: row.releaseId || row.id,
        activeItem: "agent",
        dealerCode: row.dealerCode
      }
    });
  }

  /**
   * 取消下发
   * @param row
   */
  cancel(row: any) {
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要将该取消下发给${row.dealerName}？`),
      h("p", { class: "common_tip" }, `取消后经销商将不能再投放该活动`)
    ]);
    this.$confirm(message, "提示").then(async () => {
      try {
        await cancelIssuedActive({
          activeType: this.activeType,
          releaseId: row.id
        });
        this.getIssuedDetail();
        this.issuedTableRef.getList();
        this.$message.success("取消下发成功");
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * 获取下发详情
   * @returns {Promise<void>}
   */
  async getIssuedDetail() {
    this.loading = true;
    try {
      let res: any = await getIssuedDetail({
        id: this.id
      });
      this.loading = false;
      this.issuedDetailObj = res.data;
    } catch (e) {
      this.loading = false;
    }
  }
  /**
   * 获取主机厂经销商
   * @param val
   * @returns {Promise<void>}
   */
  async remoteMethod(val: any) {
    let res = await getFactoryDealer({
      name: val,
      page: 1,
      size: 10
    });
    this.options = res.data;
  }

  /**
   * 查询
   * @param filters
   */
  proxyQuery(filters: any) {
    let { releaseAt } = filters;
    if (releaseAt && releaseAt.length > 0) {
      let [releaseFrom, releaseTo] = releaseAt;
      filters.releaseFrom = releaseFrom;
      filters.releaseTo = releaseTo;
      filters.releaseAt = null;
    }
  }
  async getActiveDetail() {
    let res: any = {};
    switch (this.activeType) {
      case "lottery":
        res = await getLotteryDetail(
          {
            releaseId: this.actDetailInfo.releaseId || this.actDetailInfo.id || this.actDetailInfo.campaignId,
            campaignId: this.id
          },
          this.sysPlat
        );
        this.setActDetailInfo(res.data);

        break;
      case "sales":
        res = await getEditSaleDetail(
          {
            campaignId: this.id
          },
          this.sysPlat
        );
        this.setActDetailInfo(res.data);

        break;
      case "site":
        await this.getActDetailInfo();
        break;
    }
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
    this.getActiveDetail();
    this.getIssuedDetail();
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss">
.issued-detail {
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

<template>
  <div class="site-detail">
    <detail-info activeType="site" @getActDetail="getDetail"></detail-info>
    <el-card>
      <el-tabs>
        <el-tab-pane label="活动统计">
          <activity-chart activeType="site" :activityData="activityData"></activity-chart>
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <detail-tab />
        </el-tab-pane>
        <el-tab-pane label="中奖名单">
          <search-table
            ref="winTblRef"
            url="campaign/common/stats/winner"
            border
            :searchParams="detailSearchParams"
            :tableColumns="constant.SITE_WIN_PRICE_COLUMN"
          ></search-table>
        </el-tab-pane>
        <el-tab-pane label="参与名单">
          <search-table
            url="campaign/common/stats/participation"
            :searchParams="detailSearchParams"
            :tableColumns="constant.SITE_ROSTER_LIST"
          ></search-table>
        </el-tab-pane>
        <el-tab-pane label="留言记录">
          <message-record
            :messageList="messageList"
            :totalCount="total"
            :filter="filter"
            @getMsgList="getMsgList"
            @msgSizeChange="msgSizeChange"
            @msgPageChange="msgPageChange"
          ></message-record>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import DetailInfo from "../components/detailInfo.vue";
import activityChart from "../components/activityChart.vue";
import SearchTable from "@/components/search-table/index.vue";
import MessageRecord from "./components/messageRecord.vue";
import Const from "../const/index";
import AwardUsedDialog from "../components/awardUsedDialog.vue";
import { getSiteDetail, getMessageList } from "@/api";
import { FilterInter } from "@/@types/activity";
import detailTab from "./components/detailTab.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "siteDetail",
  components: {
    DetailInfo,
    activityChart,
    SearchTable,
    MessageRecord,
    AwardUsedDialog,
    detailTab
  }
})
export default class AdviserDetail extends mixins(ActivityMixin) {
  @Ref() private winTblRef: any;
  readonly config: any = new Const(this);
  readonly constant: any = this.config.const;
  private filter: FilterInter = {
    page: 1,
    size: 10
  };
  private total: number = 0;
  messageList: Array<any> = [];

  /**
   * 获取留言列表
   */
  get groupId() {
    return this.actDetailInfo.imGroupId;
  }

  /**
   * 获取中奖列表
   */
  async loadWinList() {
    this.winTblRef.getList();
  }

  /**
   * 获取线下活动详情
   */
  async getDetail() {
    try {
      let res = await getSiteDetail({
        releaseId: this.releaseId
      });
      this.setActDetailInfo(res.data);
      this.getMsgList();

    } catch (e) {
      console.log("error", e);
    }
  }

  /**
   * 留言page切换
   * @param val
   */
  msgPageChange(val: number) {
    this.filter.page = val;
  }
  /**
   * 留言size切换
   * @param val
   */
  msgSizeChange(val: number) {
    this.filter.size = val;
  }

  /**
   * 获取留言列表
   */
  async getMsgList() {
    if (this.actDetailInfo.imGroupId) {
      let res = await getMessageList({
        groupId: this.groupId,
        ...this.filter
      });
      this.messageList = res.data;
      this.total = res.totalCount;
    }
  }

  created() {
    // 将活动类型设置为线下
    this.setActiveType("site");
    // 获取线下活动详情
    this.getDetail();
    // 获取留言列表
    // this.getMsgList();
    // 用于区分经销商端主机厂/集团和经销商活动
    let activeItem: string = (<any>this.$route.query).activeItem;
    this.setActiveItem(activeItem);
  }
}
</script>
<style lang="scss">
.site-detail {
  .el-icon-check {
    &.green {
      color: #26c24d;
      font-size: 18px;
    }
  }
  .el-icon-close {
    &.red {
      color: $red-color;
      font-size: 18px;
    }
  }
}
</style>

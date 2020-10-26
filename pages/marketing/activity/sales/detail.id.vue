<template>
  <div class="sales-detail">
    <detail-info activeType="sales" @getActDetail="loadGroupDetail"></detail-info>
    <el-card>
      <el-tabs>
        <el-tab-pane label="活动统计">
          <activity-chart activeType="sales" :activityData="activityData"></activity-chart>
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <detail-tab />
        </el-tab-pane>
        <el-tab-pane label="报名名单">
          <search-table
            url="campaign/common/stats/enrollment"
            :searchParams="detailSearchParams"
            :tableColumns="constant.SIGN_UP_COLUMN"
          ></search-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DetailInfo from "../components/detailInfo.vue";
import activityChart from "../components/activityChart.vue";
import SearchTable from "@/components/search-table/index.vue";
import detailTab from "./components/detailTab.vue";
import { State, Action } from "vuex-class";
import { getGrouponDetail } from "@/api";
import Const from "../const/index";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";

@Component({
  name: "salesDetail",
  components: {
    DetailInfo,
    SearchTable,
    activityChart,
    detailTab
  }
})
export default class AdviserDetail extends mixins(ActivityMixin) {
  @Action("getActDetailInfo", { namespace: "activity" })
  getActDetailInfo: Function;
  @Action("setActDetailInfo", { namespace: "activity" })
  setActDetailInfo: Function;

  private get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }

  async loadGroupDetail() {
    let res = await getGrouponDetail({
      releaseId: this.releaseId,
      campaignId: this.activeId
    });
    this.setActDetailInfo(res.data);
  }
  created() {
    this.setActiveType("sales");
    let activeItem: string = (<any>this.$route.query).activeItem;
    this.setActiveItem(activeItem);
  }
}
</script>
<style lang="scss" scoped></style>

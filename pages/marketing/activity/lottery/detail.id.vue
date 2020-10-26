<template>
  <div class="lotty-detail">
    <detail-info activeType="lottery" @getActDetail="getDetail"></detail-info>
    <el-card>
      <el-tabs>
        <el-tab-pane label="活动统计">
          <activity-chart activeType="lottery" />
        </el-tab-pane>
        <el-tab-pane label="活动详情">
          <detail-tab />
        </el-tab-pane>
        <el-tab-pane label="参与名单">
          <search-table
            border
            :tableColumns="constant.ROSTER_LIST"
            url="campaign/common/stats/participation"
            :searchParams="detailSearchParams"
          ></search-table>
        </el-tab-pane>
        <el-tab-pane label="中奖名单">
          <search-table
            ref="winTblRef"
            border
            url="campaign/common/stats/winner"
            :tableColumns="constant.WINNING_PRICE_COLUMN"
            :searchParams="detailSearchParams"
          ></search-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import DetailInfo from "../components/detailInfo.vue";
import detailTab from "./components/detailTab.vue";
import ActivityChart from "../components/activityChart.vue";
import AwardUsedDialog from "../components/awardUsedDialog.vue";
import { State, Action } from "vuex-class";
import Const from "../const/index";
import { getLotteryDetail } from "@/api";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";

@Component({
  name: "marketing-activity-lottery-detail",
  components: {
    DetailInfo,
    ActivityChart,
    SearchTable,
    AwardUsedDialog,
    detailTab
  }
})
export default class AdviserDetail extends mixins(ActivityMixin) {
  @Ref() private winTblRef: any;
  @Action("setActDetailInfo", { namespace: "activity" })
  setActDetailInfo: Function;

  get constant(): any {
    let _obj: any = new Const(this);
    return _obj.const;
  }

  async getDetail() {
    let res = await getLotteryDetail(
      {
        releaseId: this.releaseId,
        campaignId: this.activeId
      },
      "agent"
    );
    this.setActDetailInfo(res.data);
  }
  created() {
    this.setActiveType("lottery");
    let activeItem: string = (<any>this.$route.query).activeItem || "";
    this.setActiveItem(activeItem);
  }
}
</script>
<style lang="scss" scoped></style>

<template>
  <div class="active-approval-list">
    <breadcrumb-group :breadGroup="breadGroup" />
    <el-card>
      <search-table
        ref="approvalTableRef"
        url="campaign/common/approval"
        :tableColumns="constant.APPROVAL_TABLE_COLUMNS"
        :searchConfig="constant.APPROVAL_SEARCH_CONFIG"
        :initFilter="initFilter"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import Const from "./const/index";
import { rejectActive, approvalActive } from "@/api";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  name: "listIndex",
  components: {
    SearchTable
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private approvalTableRef: any;

  getBtnByStatus: Function = this.config.getBtnByStatus;
  options: Array<any> = [];

  get breadGroup() {
    return [{ label: "活动审批" }];
  }
  get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }
  get dealerOption(): Array<any> {
    return this.options || [];
  }

  private getTableData() {
    this.approvalTableRef.getList();
  }
  setFilterForm(params: any) {
    this.approvalTableRef.setFilterForm(params);
  }
  changeBuId(val: any) {
    this.changeBu2(val);
    this.setFilterForm({ regionId: null, dealerCode: null });
  }
  changeAllRegion(val: any) {
    this.changeRegion(val);
    this.setFilterForm({ dealerCode: null });
  }
  pass(row: any, index: number) {
    this.$confirm(`确定要通过“${row.dealerName}”的活动申请`, "提示").then(async () => {
      try {
        await approvalActive(row);
        this.getTableData();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  reject(row: any) {
    this.$confirm(`确定要驳回“${row.dealerName}”的活动申请？`, "提示").then(async () => {
      try {
        await rejectActive(row);
        this.getTableData();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  getDealBtns(row: any, index: number) {
    let that = this;
    return this.getBtnByStatus(row, that);
  }
  detail(row: any) {
    let { campaignTypeStr } = row;
    this.setActDetailInfo(row);
    let activeType =
      campaignTypeStr.indexOf("抽奖") > -1 ? "lottery" : campaignTypeStr.indexOf("团购") > -1 ? "sales" : "site";
    this.$router.push({
      name: `marketing-activity-${activeType}-detail`,
      params: {
        id: row.campaignId
      },
      query: {
        from: "approval",
        releaseId: row.releaseId || row.id,
        activeItem: this.sysPlat
      }
    });
  }

  mounted() {
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss"></style>

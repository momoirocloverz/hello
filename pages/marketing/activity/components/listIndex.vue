<!--活动列表管理-->
<template>
  <div class="active-list">
    <breadcrumb-group :breadGroup="breadGroup" />
    <el-card>
      <el-tabs v-model="tabActive" @tab-click="changeActiveItem">
        <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabArr" :key="item.value">
          <search-table
            v-if="item.value === tabActive"
            ref="activeRef"
            :url="loadUrl"
            :tableColumns="tableColumns"
            :searchConfig="searchConfig"
            :searchParams="searchParams"
          >
          </search-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--推广-->
    <popularize-dialog
      v-if="dialogObj.show"
      :dialogObj="dialogObj"
      :activeType="activeType"
      :activeItem="tabActive"
    ></popularize-dialog>
    <!--投放活动-->
    <put-in-dialog
      v-if="putDialog.show"
      :activeType="activeType"
      @putInSure="putInSure"
      :dialogObj="putDialog"
    ></put-in-dialog>
  </div>
</template>

<script lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import PopularizeDialog from "./popularizeDialog.vue";
import PutInDialog from "./putInDialog.vue";
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import Const from "../const/";
import { TOOL_LIST } from "@/mock/marketing";
import ActiveStatus from "./activeStatus.vue";
import { Action, State } from "vuex-class";
import { DialogInfo } from "@/@types/activity";
import { stopActive, putInActive, cancelSalesPut, cancelPut, deleteActive } from "@/api";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "listIndex",
  components: {
    SearchTable,
    PopularizeDialog,
    ActiveStatus,
    PutInDialog
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private activeRef: any;
  getBtnByStatus: Function = this.config.getBtnByStatus;
  readonly tabArr: element.Options[] = [
    {
      label: "自建活动",
      value: "agent"
    },
    {
      label: "集团活动",
      value: "company"
    },
    {
      label: "主机厂活动",
      value: "factory"
    }
  ];
  readonly urlMap: any = {
    lottery: {
      agent: "campaign/luckydraw/dealer_list",
      company: "campaign/luckydraw/group_list",
      factory: "campaign/luckydraw/main_factory_list"
    },
    sales: {
      agent: "campaigns/groupon/dealer",
      company: "campaigns/groupon/dealer",
      factory: "campaigns/groupon/dealer"
    },
    site: {
      agent: "campaign/offline_event/dealer_list",
      company: "campaign/offline_event/dealer_list",
      factory: "campaign/offline_event/dealer_list"
    }
  };
  tabActive: string = "agent";
  private dialogObj: DialogInfo = {
    title: "推广",
    show: false,
    info: {}
  };
  private putDialog: DialogInfo = {
    title: "投放活动",
    show: false,
    info: {}
  };
  tableData: Array<any> = [];
  get breadGroup() {
    let _labelObj: any = {
      lottery: "抽奖活动",
      sales: "促销活动",
      site: "线下活动"
    };
    let label: string = _labelObj[this.activeType];
    return [{ label: "活动管理", to: `/marketing/activity/${this.activeType}/index` }, { label: label, to: "" }];
  }
  private get config() {
    return new Const(this);
  }
  private get const(): any {
    return this.config.const;
  }

  get tableColumns(): Array<{}> {
    let { LOTTERY_TABLE_COLUMNS, SALES_TABLE_COLUMNS, SITE_TABLE_COLUMNS } = this.const;
    switch (this.activeType) {
      case "lottery":
        return LOTTERY_TABLE_COLUMNS;
      case "sales":
        return SALES_TABLE_COLUMNS;
      case "site":
        return SITE_TABLE_COLUMNS;
      default:
        return [];
    }
  }

  get searchConfig() {
    let { SALES_SEARCH_CONFIG, LOTTERY_SEARCH_CONFIG, SITE_SEARCH_CONFIG } = this.const;
    switch (this.activeType) {
      case "lottery":
        return LOTTERY_SEARCH_CONFIG;
      case "sales":
        return SALES_SEARCH_CONFIG;
      case "site":
        return SITE_SEARCH_CONFIG;
      default:
        return LOTTERY_SEARCH_CONFIG;
    }
  }

  /**
   * 活动类型
   */
  get typeArr() {
    switch (this.activeType) {
      case "lottery":
        return TOOL_LIST[0].children;
      case "sales":
        return TOOL_LIST[1].children;
      default:
        return [];
    }
  }
  get searchParams(): any {
    let _obj: any = {};
    if (this.activeType === "sales" || this.activeType === "site") {
      let channelObj: any = {
        agent: "DEALER",
        company: "GROUP",
        factory: "MANUFACTOR"
      };
      _obj.channel = channelObj[this.tabActive];
    }
    return _obj;
  }
  /**
   * 请求url
   */
  get loadUrl(): string {
    let _obj: any = this.urlMap[this.activeType];
    return _obj[this.tabActive];
  }
  /**
   * 获取列表数据
   */
  private getTableData() {
    this.activeRef[0].getList();
  }

  /**
   * 新建活动
   */
  add(): void {
    this.setActDetailInfo({});
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        activeType: this.activeType
      }
    });
  }

  /**
   * 获取操作列表
   * @param row
   * @param index
   */
  getDealBtns(row: any, index: number) {
    let that = this;
    return this.getBtnByStatus(row, that);
  }

  /**
   * 活动终止
   * @param row
   */
  stop(row: any): void {
    let h = this.$createElement;
    let message: any = h("div", {}, [h("p", {}, `确定要终止该活动？`), h("p", `终止后活动将立即结束`)]);
    this.$confirm(message, "终止活动").then(async () => {
      try {
        await stopActive({
          id: row.id,
          releaseId: row.releaseId,
          activeType: this.activeType
        });
        this.getTableData();
        this.$message.success("活动终止成功");
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * 取消投放
   * @param row
   */
  async cancelPutIn(row: any) {
    this.$confirm("确定要取消投放该活动", "提示").then(async () => {
      try {
        if (this.activeType === "sales") {
          await cancelSalesPut({
            releaseId: row.releaseId
          });
        } else {
          await cancelPut({
            id: row.releaseId
          });
        }

        this.getTableData();
        this.$message.success("活动取消投放操作成功");
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * 删除
   * @param row
   * @param index
   */
  async delete(row: any, index: number) {
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要删除该活动？`),
      h("p", { class: "common_tip" }, `删除后无法恢复`)
    ]);
    this.$confirm(message, "提示").then(async () => {
      try {
        await deleteActive({
          id: row.id,
          releaseId: row.releaseId,
          campaignId: row.campaignId,
          activeType: this.activeType
        });
        this.getTableData();
        this.$message.success("活动删除成功");
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * 投放
   * @param row
   */
  putIn(row: any) {
    this.setActDetailInfo(row);
    this.putDialog.show = true;
    this.putDialog.title = "投放活动";
    this.dialogObj.info = row;
  }

  /**
   * 确定投放活动
   * @param data
   */
  async putInSure(data: any) {
    this.putDialog.show = false;
    this.setPriceList([]);

    this.getTableData();
  }

  /**
   * 推广活动
   * @param row
   */
  popularize(row: any) {
    this.setActDetailInfo(row);
    this.dialogObj.show = true;
    this.dialogObj.info = row;
  }

  /**
   * 详情
   * @param row
   */
  detail(row: any) {
    let id = row.id || row.campaignId;
    this.$router.push({
      name: `marketing-activity-${this.activeType}-detail`,
      params: {
        id
      },
      query: {
        activeType: this.activeType,
        releaseId: row.releaseId || row.id,
        activeItem: this.tabActive
      }
    });
  }

  /**
   * 编辑
   * @param row
   */
  edit(row: any) {
    this.setActDetailInfo(row);
    let id = this.activeType !== "sales" ? row.campaignId : row.id;
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        type: "edit",
        id,
        releaseId: row.releaseId,
        activeType: this.activeType
      }
    });
  }
  changeActiveItem() {
    this.setActiveItem(this.tabActive);
  }
  mounted() {
    this.setActDetailInfo({});
  }
}
</script>

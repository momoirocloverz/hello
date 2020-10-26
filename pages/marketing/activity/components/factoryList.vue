<!--主机厂活动管理-->
<template>
  <div class="factory-active-list">
    <breadcrumb-group :breadGroup="breadGroup" />
    <el-card v-if="activeType === 'sales' || isCompany">
      <search-table
        ref="agentTableRef"
        :url="loadUrl"
        :tableColumns="tableColumns"
        :searchConfig="constant.ACTIVE_SEARCH_CONFIG"
      >
      </search-table>
    </el-card>
    <el-card class="active-list-card" v-else>
      <el-tabs v-model="factoryListItem">
        <el-tab-pane label="主办活动" name="hosted">
          <search-table
            ref="hostedTblRef"
            :url="loadUrl"
            :tableColumns="hostedTableColumns"
            :searchConfig="constant.HOSTED_ACTIVE_SEARCH_CONFIG"
            v-if="factoryListItem === 'hosted'"
          >
          </search-table>
        </el-tab-pane>
        <el-tab-pane label="下发经销商活动" name="issued">
          <search-table
            ref="agentTableRef"
            :url="loadUrl"
            :tableColumns="tableColumns"
            :searchConfig="constant.ACTIVE_SEARCH_CONFIG"
            v-if="factoryListItem === 'issued'"
          >
          </search-table>
        </el-tab-pane>
      </el-tabs>
      <el-button class="add-btn" type="primary" size="small" @click="handleAdd" v-if="hasPermission">{{
        btnText
      }}</el-button>
    </el-card>
    <!--下发活动-->
    <issued-active-dialog
      ref="issuedActiveRef"
      :activeType="activeType"
      :dialogObj="issuedDialog"
      @hasIssuedActive="hasIssuedActive"
      @hasPutHostedActive="hasPutHostedActive"
      @closeIssued="closeIssued"
    ></issued-active-dialog>
    <!--选择主办方式-->
    <el-dialog
      class="choose-host-mode"
      :title="chooseDialog.title"
      :visible.sync="chooseDialog.show"
      width="60%"
      :before-close="handleClose"
    >
      <div class="choose-content">
        <div class="type-list">
          <div
            :class="['type-item', { active: item.mode === hostType.mode }]"
            v-for="item in hostedActiveTypes"
            @click="chooseType(item)"
            :key="item.key"
          >
            <i :class="['item-icon', item.icon]" />
            <strong class="item-label">{{ item.label }}</strong>
            <div class="item-desc">{{ item.desc }}</div>
          </div>
        </div>
        <div class="type-desc">
          <p>主办活动：新建活动后由主机厂直接投放活动到各经销商微信商城，并承担活动奖品</p>
          <p>下放活动：新建活动后由主机厂下放至各经销商，再由经销商投放至微信商城，并由经销商承担活动奖品</p>
        </div>
      </div>
      <div class="bottom-btn" slot="footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" @click="handleSureAdd" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import Const from "../const/factory";
import { TOOL_LIST } from "@/mock/marketing";
import { Action, State } from "vuex-class";
import IssuedActiveDialog from "./issuedActiveDialog.vue";
import { DialogInfo, HostedActiveModeItem } from "@/@types/activity";
import { issuedActive, deleteFactoryActive, putHostedActive, stopActive, deleteHostedActive } from "@/api";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "listIndex",
  components: { SearchTable, IssuedActiveDialog }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private agentTableRef: any;
  @Ref() private hostedTblRef: any;
  @Ref() private issuedActiveRef: any;

  getBtnByStatus: Function = this.config.getBtnByStatus;
  getHostedBtnByStatus: Function = this.config.getHostedBtnByStatus;
  factoryListItem: string = "hosted";
  readonly hostedActiveTypes: HostedActiveModeItem[] = [
    {
      icon: "iconfont iconzhuban",
      mode: "hosted",
      label: "主办活动",
      desc: "（主机厂主办）"
    },
    {
      icon: "iconfont icondispatch",
      mode: "put",
      label: "下发活动",
      desc: "（经销商主办）"
    }
  ];
  hostType: HostedActiveModeItem = { icon: "", mode: "hosted", label: "主办活动", desc: "（主机厂主办）" };
  // 下发列表的urlMap
  private activeTypeUrlMap: any = {
    lottery: "campaign/luckydraw/template",
    sales: "campaigns/groupon",
    site: "campaign/offline_event/template"
  };
  private hostedActiveUrlMap: any = {
    lottery: "campaign/luckydraw/sponsored",
    sales: "campaigns/groupon/sponsored",
    site: "campaign/offline_event/sponsored"
  };
  private issuedDialog: DialogInfo = {
    title: "下发活动",
    show: false,
    info: {}
  };
  private chooseDialog: DialogInfo = {
    title: "请选择活动主办方式",
    show: false
  };
  private get config() {
    return new Const(this);
  }

  private get constant(): any {
    return this.config.const;
  }

  /**
   * 判断是否有权限
   */
  get hasPermission(): boolean {
    let _perKeyObj: any = {
      lottery: "PERM:LOTTERY_ACTIVITY:EDIT",
      sales: "PERM:PROMOTION_ACTIVITY:EDIT",
      site: "PERM:OFFLINE_ACTIVITY:EDIT"
    };
    let key = _perKeyObj[this.activeType];
    return this.accessIsOpened(key);
  }

  /**
   * 按钮文字
   */
  get btnText(): string {
    let _textObj: any = {
      lottery: "新建抽奖活动",
      sales: "新建促销活动",
      site: "新建线下活动"
    };
    return _textObj[this.activeType];
  }

  /**
   * 面包屑
   */
  get breadGroup() {
    let _labelObj: any = {
      lottery: "抽奖活动",
      sales: "促销活动",
      site: "线下活动"
    };
    let label = _labelObj[this.activeType];
    return [{ label: "活动管理", to: `/marketing/activity/${this.activeType}/index` }, { label: label, to: "" }];
  }

  /**
   * 下发活动表头
   */
  get tableColumns(): Array<{}> {
    let { ACTIVE_TABLE_COLUMNS } = this.constant;
    return ACTIVE_TABLE_COLUMNS;
  }

  /**
   * 主办活动表头
   */
  get hostedTableColumns(): Array<any> {
    let { HOSTED_ACTIVE_TABLE_COLUMNS } = this.constant;
    return HOSTED_ACTIVE_TABLE_COLUMNS;
  }

  /**
   * 活动类型
   */
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

  /**
   * 获取列表url
   */
  get loadUrl(): string {
    if (this.activeType === "sales") {
      return this.activeTypeUrlMap[this.activeType];
    }
    if (this.factoryListItem === "hosted" && this.isFactory) {
      return this.hostedActiveUrlMap[this.activeType];
    } else {
      return this.activeTypeUrlMap[this.activeType];
    }
  }
  /**
   * 获取列表
   **/
  private getTableData() {
    if (this.factoryListItem === "hosted" && this.isFactory && this.activeType !== "sales") {
      this.hostedTblRef.getList();
    } else {
      this.agentTableRef.getList();
    }
  }

  /**
   * 新增活动
   */
  handleAdd() {
    if (this.activeType !== "sales" && this.isFactory) {
      this.chooseDialog.show = true;
    } else {
      this.handleSureAdd();
    }
  }

  /**
   * 选择活动主办方式
   * @param row
   */
  chooseType(row: any) {
    this.hostType = row;
  }

  /**
   * 确认新增
   */
  handleSureAdd() {
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        mode: this.activeType === "sales" || this.isCompany ? "put" : this.hostType.mode
      }
    });
  }

  /**
   * 获取操作
   * @param row
   * @param index
   */
  getDealBtns(row: any, index: number) {
    let that = this;
    return this.getBtnByStatus(row, that);
  }

  /**
   * 获取主办活动操作
   * @param row
   */
  getHostedBtns(row: any) {
    let that = this;
    return this.getHostedBtnByStatus(row);
  }

  /**
   * 删除下发经销商活动
   * @param row
   * @param index
   */
  async deletePutActive(row: any, index: number) {
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要删除该活动？`),
      h("p", { class: "common_tip" }, `删除后无法恢复`)
    ]);
    this.$confirm(message, "提示").then(async () => {
      try {
        await deleteFactoryActive({
          id: row.id || row.campaignId,
          activeType: this.activeType,
          activeItem: this.sysPlat
        });
        this.$message.success("删除活动成功");
        this.getTableData();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  /**
   * 下发活动
   * @param row
   */
  handleIssuedActive(row: any) {
    this.setActDetailInfo(row);
    this.issuedDialog.type = "issued";
    this.issuedDialog.show = true;
    this.issuedDialog.title = "下发活动";
  }

  /**
   * 确认下发活动
   * @param hasSelected
   */
  async hasIssuedActive(hasSelected: Array<any>) {
    let dealerCodes: Array<any> = [];
    hasSelected.forEach(item => {
      dealerCodes.push(item.dealerCode);
    });
    try {
      let { id, campaignId } = this.actDetailInfo;
      await issuedActive({
        id: id || campaignId,
        activeType: this.activeType,
        data: dealerCodes
      });
      this.$message.success("下发活动成功");
      this.issuedDialog.show = false;
      this.issuedDialog.type = "";
      this.issuedActiveRef.handleClose();
      this.getTableData();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * 下发活动的详情
   * @param row
   */
  detailIssuedActive(row: any) {
    this.setActDetailInfo(row);
    this.setActiveItem("factory");
    this.$router.push({
      name: `marketing-activity-${this.activeType}-issuedDetail`,
      params: {
        id: row.id || row.campaignId
      },
      query: {
        activeType: this.activeType,
        releaseId: row.releaseId || row.id,
        activeItem: this.sysPlat,
        mode: "put"
      }
    });
  }

  /**
   * 编辑下发活动
   * @param row
   */
  editPutActive(row: any) {
    this.setActDetailInfo(row);
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        type: "edit",
        id: row.id || row.campaignId,
        mode: "put"
      }
    });
  }

  /**
   * 关闭下发弹框
   */
  closeIssued() {
    this.issuedDialog.show = false;
    this.issuedDialog.type = "";
  }
  handleClose() {
    this.chooseDialog.show = false;
  }

  /**
   * 主办活动详情
   * @param row
   */
  detailHostedActive(row: any) {
    // this.setActDetailInfo(row);
    this.setActiveItem("factory");
    this.$router.push({
      name: `marketing-activity-${this.activeType}-hostedActiveDetail`,
      params: {
        id: row.id || row.campaignId
      },
      query: {
        activeType: this.activeType,
        releaseId: row.releaseId || row.id,
        activeItem: this.sysPlat,
        mode: "hosted"
      }
    });
  }

  /**
   * 主办活动删除
   */
  deleteHosted(row: any) {
    this.deletedHostedActivity(row).then(() => {
      this.getTableData();
    });
  }
  async stopHosted(row: any) {
    await this.stopHostedActive(row);
    this.getTableData();
  }

  /**
   * 投放
   * @param row
   */
  putInHosted(row: any) {
    this.setActDetailInfo(row);
    this.issuedDialog.type = "put";
    this.issuedDialog.show = true;
    this.issuedDialog.title = "投放活动";
  }

  /**
   * 主办活动编辑
   * @param row
   */
  editHosted(row: any) {
    this.editHostedActive(row);
  }

  /**
   * 确定投放主办方活动
   * @param hasSelected
   */
  async hasPutHostedActive(hasSelected: Array<any>) {
    this.hasPutHosted(hasSelected).then(() => {
      this.issuedDialog.show = false;
      this.issuedDialog.type = "";
      this.issuedActiveRef.handleClose();
      this.getTableData();
    });
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
.factory-active-list {
  .active-list-card {
    position: relative;
    .add-btn {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  .choose-host-mode {
    .choose-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .type-list {
        display: flex;
        flex-direction: row;
      }
      .type-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #f5f5f5;
        padding: 15px 20px;
        margin: 15px;
        cursor: pointer;

        .item-icon {
          font-size: 60px;
          color: $tip-color;
        }
        .item-desc {
          color: $tip-color;
        }
        &.active {
          border: 1px solid $primary-color;
          box-shadow: 0 0 2px $primary-color;
          .item-icon {
            color: $primary-color;
          }
        }
      }
    }
  }
}
</style>

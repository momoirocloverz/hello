<!--活动详情-->
<template>
  <div :class="[`${activeType}-detail`, 'active-detail']">
    <breadcrumb-group :breadGroup="breadGroup" />
    <el-card class="mb-15">
      <el-row :gutter="20" class="detail-card">
        <el-col :xl="7" :lg="9" class="left">
          <img class="pic" :src="actDetailInfo.posterUrl" />
        </el-col>
        <el-col :xl="14" :lg="15" class="content">
          <strong class="name">{{ actDetailInfo.name || actDetailInfo.campaignName }}</strong>
          <el-row :gutter="10" class="desc mb-15">
            <el-col :span="10" class="item">活动类型: {{ activeTypeText }}</el-col>
            <el-col :span="9" class="item" v-if="from === 'approval'">经销商:{{ actDetailInfo.dealerName }} </el-col>
            <el-col :span="9" class="item" v-else>{{ creator }} </el-col>
          </el-row>
          <el-row :gutter="10" class="desc">
            <el-col :span="10" class="item">活动时间: {{ activeTime || "-" }}</el-col>
            <el-col :span="9" class="item">创建时间: {{ actDetailInfo.createdTime | momentTime }}</el-col>
          </el-row>
          <div class="btn-list">
            <el-button size="small" v-if="!btn.hide" v-for="(btn, idx) in btns" :key="idx" @click="handleBtn(btn)">{{
              btn.label
            }}</el-button>
            <active-tool :toolArr="toolBtn" :row="actDetailInfo"></active-tool>
          </div>
        </el-col>
        <el-col :xl="4" :lg="4" class="right">
          <slot name="right">
            <div
              class="common_detail-status-text"
              :class="`text-${actDetailInfo.campaignStatus || actDetailInfo.status}`"
            >
              {{ activeStatus }}
            </div>
          </slot>
        </el-col>
      </el-row>
      <popularize-dialog
        v-if="dialogObj.show && isAgent"
        :dialogObj="dialogObj"
        :activeType="activeType"
      ></popularize-dialog>
      <put-in-dialog
        v-if="putDialog.show && isAgent"
        :activeType="activeType"
        @putInSure="putInSure"
        :dialogObj="putDialog"
      ></put-in-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PopularizeDialog from "./popularizeDialog.vue";
import PutInDialog from "./putInDialog.vue";
import ActiveTool from "./activeTool.vue";
import { DialogInfo } from "@/@types/activity";
import { TOOL_LIST } from "@/mock/marketing";
import { getToolBtnByItem } from "../const/";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import {
  stopActive,
  getSaleDetail,
  cancelPut,
  deleteActive,
  deleteFactoryActive,
  approvalActive,
  rejectActive
} from "@/api";
import Const from "../const/";
import ApprovalCon from "../approval/const/";
import { formatDate } from "@/utils/index";
@Component({
  name: "DetailInfo",
  components: { PopularizeDialog, PutInDialog, ActiveTool }
})
export default class extends mixins(ActivityMixin) {
  @Prop({ type: String, default: "detail" }) private type: string;
  getBtnByStatus: Function = this.config.getBtnByStatus;
  getApprovalBtnByStatus: Function = new ApprovalCon(this).getBtnByStatus;

  from: string = "active";
  dialogObj: DialogInfo = {
    title: "推广",
    show: false,
    info: {}
  };
  putDialog: DialogInfo = {
    title: "投放活动",
    show: false,
    info: {}
  };
  get creator(): string {
    let { createdBy, creatorName, dealerName } = this.actDetailInfo;
    return this.isAgent ? `创建人:${createdBy || creatorName}` : `经销商：${dealerName}`;
  }
  get breadGroup() {
    let pLabel: string = "";
    let label = "活动详情";
    let to = `/marketing/activity/${this.activeType}/index`;
    if (this.from === "approval") {
      pLabel = "活动审批";
      to = `/marketing/activity/approval/list`;
    } else {
      let _pLabelObj: any = {
        lottery: "抽奖活动",
        sales: "促销活动",
        site: "线下活动"
      };
      pLabel = _pLabelObj[this.activeType];
    }
    return [{ label: pLabel, to: to }, { label: label, to: "" }];
  }
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }

  get btns(): Array<any> {
    if (this.from === "approval") {
      // 审核页面
      return this.getApprovalBtn();
    } else if (this.isAgent) {
      // 经销商页面
      return this.getActiveBtn();
    } else {
      // 集团和主机厂访问经销商详情
      return [];
    }
  }
  get toolBtn(): Array<any> {
    if (this.activeType === "site" && this.isAgent) {
      return getToolBtnByItem(this.actDetailInfo);
    } else {
      return [];
    }
  }
  private getActiveBtn(): Array<any> {
    let that = this;
    return this.getBtnByStatus(this.actDetailInfo, that).filter((btn: any) => {
      return btn.label !== "详情";
    });
  }
  private getApprovalBtn(): Array<any> {
    let that = this;
    return this.getApprovalBtnByStatus(this.actDetailInfo, that).filter((btn: any) => {
      return btn.label !== "详情";
    });
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
  get campaignType(): string {
    let { marketingToolType } = this.actDetailInfo;
    let _obj: any = this.typeArr.find((item: any) => item.id === marketingToolType) || {};
    return _obj.name || "";
  }
  get activeTypeText(): string {
    let textMap: any = {
      lottery: this.campaignType,
      sales: "限时团购",
      site: "线下活动"
    };
    return textMap[this.activeType];
  }
  get activeTime(): string {
    let { validFrom, validTo } = this.actDetailInfo;
    return validFrom ? formatDate(validFrom) + "~" + formatDate(validTo) : "-";
  }
  get createTime(): string {
    return formatDate(this.actDetailInfo.createdTime);
  }
  get activeStatus(): string {
    let { campaignStatus, approvalStatus, status } = this.actDetailInfo;
    let str = "";
    let _status = campaignStatus || status;
    if (approvalStatus === 0 && this.from === "approval") {
      str = "待审批";
    } else if (approvalStatus === 1) {
      let _obj = this.isAgent ? this.constant.AGENT_STATUS_OBJ : this.constant.GROUP_STATUS_OBJ;
      str = _obj[_status];
    } else if (this.from === "approval" && approvalStatus === 2) {
      str = "审批驳回";
    }
    return str;
  }
  goSiteActive(type: string) {
    this.$router.push({
      path: `/marketing/activity/site/${type}`,
      query: {
        id: this.activeId
      }
    });
  }
  handleBtn(item: any) {
    item.handler();
  }
  delete() {
    let h = this.$createElement;
    let message: any = h("div", {}, [
      h("p", {}, `确定要删除该活动？`),
      h("p", { class: "common_tip" }, `删除后无法恢复`)
    ]);
    this.$confirm(message, "提示").then(async () => {
      try {
        if (this.isAgent || this.activeItem === "agent") {
          await deleteActive({
            id: this.actDetailInfo.id,
            releaseId: this.releaseId,
            campaignId: this.actDetailInfo.campaignId,
            activeType: this.activeType
          });
        } else {
          await deleteFactoryActive({
            id: this.actDetailInfo.id || this.actDetailInfo.campaignId,
            activeType: this.activeType,
            activeItem: this.activeItem || this.sysPlat
          });
        }

        this.$message.success("活动删除成功");
        this.$router.push({
          path: `/marketing/activity/${this.activeType}/index`
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  popularize() {
    this.dialogObj.show = true;
  }
  edit() {
    this.$router.push({
      path: `/marketing/activity/${this.activeType}/add`,
      query: {
        type: "edit",
        id: this.activeId
      }
    });
  }
  stop() {
    let h = this.$createElement;
    let message: any = h("div", {}, [h("p", {}, `确定要终止该活动？`), h("p", `终止后活动将立即结束`)]);
    this.$confirm(message, "终止活动").then(async () => {
      try {
        await stopActive({
          releaseId: this.releaseId,
          activeType: this.activeType
        });
        this.getDetail();
        this.$message.success("活动终止成功");
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  putIn() {
    this.putDialog.show = true;
    this.putDialog.title = "投放活动";
  }
  cancelPutIn() {
    this.$confirm("确定要取消投放该活动", "提示").then(async () => {
      try {
        await cancelPut({
          id: this.releaseId
        });
        // this.getDetail();
        this.$message.success("活动取消投放操作成功");
        this.$router.push({
          path: `/marketing/activity/${this.activeType}/index`
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  putInSure() {
    // todo 获取详情
    this.putDialog.show = false;
  }
  pass(row: any, index: number) {
    this.$confirm(`确定要通过“${this.actDetailInfo.dealerName}”的活动申请`, "提示").then(async () => {
      try {
        await approvalActive({
          id: this.releaseId
        });
        this.getDetail();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  reject(row: any) {
    this.$confirm(`确定要驳回“${this.actDetailInfo.dealerName}”的活动申请？`, "提示").then(async () => {
      try {
        await rejectActive({
          id: this.releaseId
        });
        this.getDetail();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
  async getDetail() {
    this.$emit("getActDetail");
  }
  created() {
    this.from = (<any>this.$route.query).from || "active";
    this.getActDetailInfo();
    this.getDetail();
  }
}
</script>

<style scoped lang="scss">
.detail-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  .left {
    .pic {
      width: 340px;
      height: 170px;
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
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      margin-top: 20px;
      .site-tool {
        margin-left: 15px;
      }
    }
  }
}
</style>

<!--下发或者主机厂主办活动投放活动弹框-->
<template>
  <el-dialog
    class="issued-active"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="70%"
    :before-close="handleClose"
  >
    <div v-if="dialogObj.type === 'issued' || dialogObj.type === 'put'">
      <el-steps :active="step" align-center>
        <el-step title="选择经销商"> </el-step>
        <el-step :title="dialogObj.type === 'issued' ? '确定下发' : '确定投放'"> </el-step>
      </el-steps>
      <div v-show="step === 1" class="mt-15">
        <search-table
          :url="loadUrl"
          :searchParams="searchParams"
          :tableColumns="constant.PUT_TABLE_COLUMN"
          :searchConfig="constant.PUT_SEARCH_CONFIG"
          @selectionChange="handleSelectionChange"
          :initFilter="initFilterForm"
        ></search-table>
      </div>
      <div v-show="step === 2" class="common_flex-center common_flex-column mt-15">
        <img :src="actDetailInfo.posterUrl" class="active-img" />
        <h1 class="active-name mt-15">{{ actDetailInfo.name }}</h1>
        <div class="active-type ">
          <span>活动类型: </span>
          <span>{{ activeTypeText }}</span>
        </div>
        <div class="put-dealer mt-15">
          <span>{{ dialogObj.type === "issued" ? "下发" : "投放" }}经销商：</span>
          <span>{{ this.hasSelected.length }}</span>
        </div>
      </div>
      <div class="btn-wrap">
        <strong>已选:{{ this.hasSelected.length }}</strong>
        <div>
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button size="small" @click="setStep(1)" type="primary" v-if="step === 1">下一步</el-button>
          <el-button size="small" @click="setStep(-1)" v-if="step === 2">上一步</el-button>
          <el-button size="small" type="primary" v-if="step === 2" @click="sure">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import SearchTable from "@/components/search-table/index.vue";
import Const from "../const/factory";
import { TOOL_LIST } from "@/mock/marketing";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  name: "issuedActiveDialog",
  components: {
    SearchTable
  }
})
export default class extends mixins(ActivityMixin) {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  private step: number = 1;
  searchParams: any = {};
  hasSelected: Array<any> = [];
  private get config() {
    return new Const(this);
  }
  get loadUrl() {
    let str = "dealer";
    if (this.sysPlat !== "factory") {
      str = "dealer/bloc";
    } else {
      str = "dealer";
    }
    return str;
  }
  get constant(): any {
    return this.config.const;
  }
  get activeTypeText(): string {
    let type = this.actDetailInfo.type || this.actDetailInfo.campaignType || this.actDetailInfo.marketingToolType || 0;
    let _arr: Array<any> = [];
    let _obj: any = {};
    switch (this.activeType) {
      case "lottery":
        _arr = TOOL_LIST[0].children || [];
        _obj = _arr.find((item: any) => item.id === type) || {};
        return _obj.name || "";

      case "sales":
        return "限时团购";
      default:
        return "线下活动";
    }
  }
  get initFilterForm() {
    let info = storeInfoSetting.getInfo().info;
    return {
      buId: info.businessUnitId || ""
    };
  }
  /**
   * 活动类型
   */
  private get typeArr(): Array<any> {
    switch (this.activeType) {
      case "lottery":
        return TOOL_LIST[0].children;
      case "sales":
        return TOOL_LIST[1].children;
      default:
        return [];
    }
  }
  handleClose(): void {
    this.hasSelected = [];
    this.step = 1;
    this.$emit("closeIssued");
  }

  handleSelectionChange(arr: Array<{}>) {
    this.hasSelected = arr;
  }
  setStep(dir: number) {
    if (dir === -1) {
      this.step = 1;
    } else {
      if (this.hasSelected.length > 0) {
        this.step = 2;
      } else {
        this.$message.warning("请选择经销商");
      }
    }
  }
  private async sure() {
    if (this.dialogObj.type === "issued") {
      this.$emit("hasIssuedActive", this.hasSelected);
    } else {
      this.$emit("hasPutHostedActive", this.hasSelected);
    }
  }
  created() {
    this.searchParams = {
      enabled: 1
    };
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss">
.issued-active {
  .active-img {
    width: 400px;
    height: 240px;
  }
  .btn-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
}
</style>

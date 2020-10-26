<!--活动查询-->
<template>
  <el-dialog
    class="active-query"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="80%"
    :before-close="handleClose"
    append-to-body
  >
    <search-table
      ref="activeRef"
      url="campaign/common/check/valid_date"
      :initFilter="initForm"
      :tableColumns="tableColumns"
      :searchConfig="searchConfig"
      :proxyQuery="proxyQuery"
      @getTblData="getTblData"
    >
      <div slot="table-top" class="mb-15">
        <strong class="ml-10">此时间范围内，共{{ totalCount }}场【{{ activeTypeText }}】</strong>
      </div>
    </search-table>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import searchTable from "@/components/search-table/index.vue";
import { TOOL_LIST } from "@/mock/marketing";
import Const from "../const/";
import { DialogInfo } from "@/@types/activity";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "activeQuery",
  components: {
    searchTable
  }
})
export default class extends mixins(ActivityMixin) {
  @Prop({ default: () => {} }) private form!: any;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: "add" }) private usedFrom: any;
  initForm: any = {};
  lotteryType: any;
  activeTypeText: string = "";
  totalCount: number = 0;
  get searchConfig(): any {
    let _obj: any = {
      props: [
        {
          tag: "datePicker",
          type: "datetimerange",
          prop: "activeTime",
          label: "活动时间"
        }
      ]
    };
    if (this.activeType === "lottery") {
      _obj.props.unshift({
        tag: "select",
        prop: "marketingToolType",
        placeholder: "活动类型",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: TOOL_LIST[0].children
      });
    } else if (this.activeType === "sales") {
      _obj.props.unshift({
        tag: "select",
        prop: "campaignType",
        placeholder: "活动类型",
        keyProp: {
          label: "name",
          value: "id"
        },
        options: TOOL_LIST[1].children
      });
    }

    return _obj;
  }
  private get config() {
    return new Const(this);
  }
  private get const(): any {
    return this.config.const;
  }
  get tableColumns(): Array<{}> {
    let { LOTTERY_TABLE_COLUMNS, SALES_TABLE_COLUMNS, SITE_TABLE_COLUMNS } = this.const;
    let _arr: Array<any> = [];
    switch (this.activeType) {
      case "lottery":
        _arr = LOTTERY_TABLE_COLUMNS;
        // _arr.splice(6, 1);
        if (this.isFactory) {
          // 去掉审批状态
          _arr.splice(4, 1);
        }
        break;
      case "sales":
        _arr = SALES_TABLE_COLUMNS;
        break;
      case "site":
        _arr = SITE_TABLE_COLUMNS;
        _arr.pop();
        if (this.isFactory) {
          _arr.splice(3, 1);
        }
        break;
    }
    _arr.pop();
    return _arr;
  }

  getTblData(res: any) {
    this.totalCount = res.totalCount;
  }
  proxyQuery(filters: any) {
    filters.validFrom = filters.activeTime[0];
    filters.validTo = filters.activeTime[1];
    this.lotteryType = filters.marketingToolType;
    this.activeType === "lottery" && this.getLotteryType();

    delete filters.activeTime;
    return filters;
  }
  handleClose() {
    this.dialogObj.show = false;
  }
  getLotteryType() {
    let _arr: any[] = TOOL_LIST[0].children;
    let _obj: any = _arr.find((item: any) => item.id === this.lotteryType);
    this.activeTypeText = _obj && _obj.name;
  }
  mounted() {
    let keyMap: any = {
      lottery: 0,
      sales: 1,
      site: 2
    };
    let typeKeyMap: any = {
      site: "线下活动",
      sales: "促销活动"
    };

    this.activeTypeText = typeKeyMap[this.activeType];
    // 投放的活动时间查询和编辑的时候需要releaseId
    let _releaseId = this.usedFrom === "put" ? this.form.releaseId : this.pageType === "edit" ? this.releaseId : null;
    this.initForm = {
      activeTime: this.form.activeTime,
      campaignType: keyMap[this.activeType],
      releaseId: _releaseId,
      validFrom: this.form.activeTime[0],
      validTo: this.form.activeTime[1],
      scenario: this.isFactory ? "MANUFACTOR_SELF_MADE" : "DEALER_SELF_MADE_OR_RELEASE"
    };
    if (this.activeType === "lottery") {
      this.initForm.marketingToolType = this.form.marketingToolType || this.form.campaignType || 0;
      this.lotteryType = this.initForm.marketingToolType;
      this.getLotteryType();
    }
  }
}
</script>

<style lang="scss" scoped>
.no-active {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  .iconfont {
    font-size: 80px;
    color: #ccc;
  }
}
</style>

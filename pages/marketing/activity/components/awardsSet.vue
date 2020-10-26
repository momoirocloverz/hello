<!--奖项设置通用table-->
<template>
  <div class="awards-set">
    <div class="mb-15" v-if="usedFrom === 'new' || usedFrom === 'put'">
      <router-link
        :to="`/marketing/gift/coupon/create?sysPlat=${sysPlat}`"
        class="el-link el-link--primary mr-15"
        target="_blank"
        v-if="isAgent && activeType === 'lottery' && hasEditCouponPer"
        ><el-button size="small">新建优惠券</el-button></router-link
      >
      <router-link
        :to="`/marketing/gift/entity/create?sysPlat=${sysPlat}`"
        class="el-link el-link--primary"
        target="_blank"
        v-if="hasEditEntityPer"
        ><el-button size="small">新建实物奖品 </el-button></router-link
      >
    </div>
    <common-table
      border
      :tableColumns="constant.AWARD_SET_COLUMNS"
      :data="data"
      :summaryMethod="getSummaries"
      :showPage="false"
      :showSummary="true"
    >
      <!--个数-->
      <template v-slot:quantity="{ row }">
        <div slot="quantity" :class="{ error: !row.numValid }" v-if="usedFrom === 'new' || usedFrom === 'put'">
          <span v-if="row.id === -1 || row.id === -2 || row.prizeId === -1 || row.prizeId === -2">不限制</span>
          <el-input size="mini" @input="val => checkNumIpt(val, row)" v-else v-model="row.quantity"></el-input>
          <div class="err-msg" v-if="!row.numValid">{{ row.numMsg }}</div>
        </div>
        <div v-else-if="row">
          {{ row.id === -1 || row.id === -2 || row.prizeId === -1 || row.prizeId === -2 ? "无限制" : row.quantity }}
        </div>
      </template>
      <!--概率-->
      <template v-slot:probability="{ row }" v-if="activeType === 'lottery'">
        <div slot="probability" :class="{ error: !row.perValid }" v-if="usedFrom === 'new' || usedFrom === 'put'">
          <span v-if="row.id === -1 || row.prizeId === -1">{{ getNoPercent(row) }}</span>
          <el-input size="mini" @input="val => checkPerIpt(val, row)" v-model="row.probability" clearable v-else>
          </el-input>
          <div class="err-msg" v-if="!row.perValid">{{ row.errorMsg }}</div>
        </div>
        <div v-else>{{ row.probability }}%</div>
      </template>
    </common-table>

    <div class="table-bottom" v-if="usedFrom === 'new' || usedFrom === 'put'">
      <el-button size="small" type="text" icon="el-icon-plus" @click="addAward">添加奖品</el-button>
      <span class="common_tip ml-15">{{ activeType === "site" ? "最多支持添加100个奖项" : "" }}</span>
    </div>
    <add-award-dialog
      :campaignEndAt="campaignEndAt"
      :activeType="activeType"
      :dialogObj="addDialog"
      @checkedAward="checkedAward"
      v-if="addDialog.show"
    ></add-award-dialog>
  </div>
</template>

<script lang="ts">
import CommonTable from "@/components/common-table/index.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import addAwardDialog from "./addAwardDialog.vue";
import { DialogInfo } from "@/@types/activity";
import Const from "../const/index";
import _ from "lodash";
import { toPlus, toMinus, toMultipliedBy } from "@/utils";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "awardsSet",
  components: {
    CommonTable,
    addAwardDialog
  }
})
export default class extends mixins(ActivityMixin) {
  @Prop({ default: () => [] }) data: Array<any>;
  @Prop({ default: "new" }) usedFrom: any;
  @Prop({ default: null }) private campaignEndAt: any;

  private addDialog: DialogInfo = {
    title: "添加奖品",
    show: false,
    info: {}
  };
  private curIdx: number = -1;
  private get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }
  get hasEditCouponPer(): boolean {
    return this.accessIsOpened("PERM:DISCOUNT_COUPON:EDIT");
  }
  get hasEditEntityPer(): boolean {
    return this.accessIsOpened("PERM:PRIZE:EDIT");
  }
  /**
   * 获取无奖品谢谢惠顾的百分比
   * @param row
   */
  getNoPercent(row: any) {
    let _total: number = 0;
    this.data.forEach((item: any) => {
      if (item.probability && item.id !== -1 && item.prizeId !== -1) {
        _total = toPlus(_total, Number(item.probability)) - 0;
      }
    });

    let _num = toMinus(100, _total) - 0;
    row.probability = _num < 0 || _.isNaN(_num) ? 0 : _num;
    row.quantity = 1;
    return row.probability;
  }
  multipliedBy(val: number) {
    toMultipliedBy(val, 100);
  }
  /**
   * 检验奖品数量
   * @param val
   * @param row
   */
  async checkNumIpt(val: any, row: any) {
    val = val - 0;
    var reg = /^([1-9]|[1-9]\d|100)$/;
    if (typeof (val - 0) !== "number" || !reg.test(val)) {
      row.numValid = false;
      row.numMsg = "请输入1~100的整数";
    } else {
      row.numValid = val <= row.stockCount;
      row.numMsg = val <= row.stockCount ? "" : "奖品库存不足";
    }
  }
  /**
   * 检验百分比
   * @param val
   * @param row
   */
  checkPerIpt(val: any, row: any) {
    let _arr = val.split(".") || [];
    let _num = _arr[1] ? _arr[1].length : 0;
    val = val - 0;
    let valid = /^(\d{1,2}(\.\d{0,4}[1-9])?|100)$/.test(val);
    if (typeof (val - 0) !== "number" || !valid || _num > 5 || val === 0) {
      row.perValid = false;
      row.errorMsg = "请输入大于0小于100的数字，最多支持小数点后5位";
    } else {
      row.perValid = true;
      row.errorMsg = null;
    }
  }
  /**
   * 更换奖品
   * @param row
   * @param index
   */
  change(row: object, index: number) {
    if (!this.campaignEndAt) {
      this.$message.warning("请选择活动时间");
      return;
    }
    this.curIdx = index;
    this.addDialog.show = true;
    this.addDialog.type = "edit";
    this.addDialog.title = "选择奖品";
  }

  /**
   * 删除奖品
   * @param row
   * @param idx
   */
  delete(row: object, idx: number) {
    this.$emit("deleteAward", row, idx);
  }

  /**
   * 添加奖品
   */
  addAward(): void {
    let _len = this.priceSetList.length;
    if (!this.campaignEndAt) {
      this.$message.warning("请选择活动时间");
      return;
    }
    if (this.activeType === "lottery") {
      // if (_len > 20) {
      //   this.$message.warning("最多可设置20个奖项");
      //   return;
      // }
    } else {
      if (_len >= 100) {
        this.$message.warning("最多可设置100个奖项");
        return;
      }
    }

    this.addDialog.show = true;
    this.addDialog.type = "add";
    this.addDialog.title = "添加奖品";
  }

  /**
   * 检验是新增还是更换
   * @param row
   */
  checkedAward(row: any) {
    if (this.addDialog.type === "add") {
      this.$emit("addAward", row);
    } else {
      this.$emit("changeAward", row, this.curIdx);
    }
  }

  /**
   * 获取合计
   * @param params
   */
  getSummaries(params: any) {
    const { columns, data } = params;
    const sums: Array<any> = [];
    columns.forEach((columns: any, index: number) => {
      if (index === 4 || (index === 5 && this.activeType === "lottery")) {
        const values = data.map((item: any) => {
          if (item.prizeId !== -1 && item.id !== -2 && item.id !== -1 && item.prizeId !== -2 && index === 4) {
            return Number(item[columns.property]);
          } else if (index === 5) {
            return Number(item[columns.property]);
          }
        });
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return toPlus(prev, curr);
          } else {
            return prev;
          }
        }, 0);
        if (index === 5 && this.activeType === "lottery") {
          sums[index] += "%";
        }
      }
      if (index === 0) {
        sums[index] = "合计";
      }
    });
    return sums;
  }
  created() {
    if (this.usedFrom === "put" && this.activeType === "site") {
      this.setPriceList([]);
    }
  }
}
</script>

<style lang="scss">
.awards-set {
  .poster {
    width: 80px;
    height: 60px;
  }
  .table-bottom {
    padding: 5px;
    border: 1px solid #f5f5f5;
    border-top: none;
  }
  .el-input {
    width: 100%;
  }
  .error {
    .el-input {
      border: 1px solid $red-color;
    }
    .err-msg {
      font-size: 12px;
      color: $red-color;
    }
  }
}
</style>

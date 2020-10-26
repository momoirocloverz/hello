<template>
  <!-- 仅退款 -->
  <div>
    <el-admin-table ref="adminTableRef"
                    :tableAttrs="tableAttrs"
                    :apiFn="apiFn"
                    :formData.sync="searchData"
                    hasSearchBtn>
      <div slot="search">
        <el-form-item prop="orderCode">
          <el-input v-model="searchData.orderCode"
                    size="small"
                    placeholder="订单编号"
                    clearable />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input v-model="searchData.userName"
                    size="small"
                    placeholder="客户姓名"
                    clearable />
        </el-form-item>
        <el-form-item prop="userPhone">
          <el-input v-model="searchData.userPhone"
                    size="small"
                    placeholder="客户电话"
                    clearable />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="searchData.dealerShowStatus"
                     placeholder="售后状态"
                     clearable>
            <el-option v-for="(item, index) in statusList"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dataTime">
          <span>提交时间 </span>
          <el-date-picker v-model="searchData.beginTime"
                          value-format="timestamp"
                          placeholder="开始日期">
          </el-date-picker>
          至
          <el-date-picker v-model="searchData.endTime"
                          value-format="timestamp"
                          placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-admin-table>
    <RefundGoodsDetail :visible.sync="refundGoodsVisible"
                       :list="refundGoodsList"
                       :type="type"
                       v-if="refundGoodsVisible"></RefundGoodsDetail>
    <refundDialog ref="dialogRef"
                  @successful="successful"
                  @openDetail="openRefundGoodsDetail"
                  :dialogType="type === '0'?'goodsOrderRefund':type==='1'?'returnGoods':'changegoods'"></refundDialog>
    <refundDialog ref="dialogDeRef"
                  @successful="successful"
                  @openDetail="openRefundGoodsDetail"
                  :dialogType="type === '0'?'goodsOrderDetail':type === '1'?'returnGoodsDetail':'changeGoodsDetail'"></refundDialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { formatDate } from "@/utils";
import { aftersale_order_list_api } from "@/api";
import { Config } from "./../const/afterSale";
import RefundGoodsDetail from "./refundGoodsDetail.vue";
import refundDialog from "@/components/refund-dialog/index.vue";

@Component({
  components: {
    RefundGoodsDetail,
    refundDialog
  }
})
export default class OnlyRefundTable extends Vue {
  @Ref() readonly dialogRef: any;
  @Ref() readonly dialogDeRef: any;
  @Ref() readonly adminTableRef: any;
  @Prop({ type: String, default: "0" }) type!: string; // 0 仅退款 1 退款退货 2 换货

  private pickerOptions = new Config().get(this);
  private apiFn: any = aftersale_order_list_api;

  private afterSaleVisible: boolean = false;
  private again: boolean = false;
  private refundGoodsVisible: boolean = false;
  private refundGoodsList: any[] = [];

  private searchData = {
    orderCode: "",
    userName: "",
    userPhone: "",
    dealerShowStatus: "",
    afterSaleType: this.type,
    endTime: "",
    beginTime: "",
    dealerCode: ""
  };

  get statusList() {
    let _closeTxt = this.type === "0" ? "退款关闭" : this.type === "1" ? "退款退货关闭" : "换货关闭";
    let _refundList = [
      { label: "待处理", value: 0 },
      { label: "待入账", value: 1 },
      { label: "退款失败", value: 2 },
      { label: "退款成功", value: 3 },
      { label: "已撤销", value: 4 },
      { label: _closeTxt, value: 6 }
    ];
    let _goodList = [
      { label: "待处理", value: 0 },
      { label: "确认退货", value: 5 },
      { label: "已撤销", value: 4 },
      { label: "换货关闭", value: 6 }
    ];
    return this.type === "2" ? _goodList : _refundList;
  }

  get tableAttrs() {
    let col =
      this.type === "0"
        ? this.pickerOptions.only
        : this.type === "1"
        ? this.pickerOptions.refuntAndGood
        : this.pickerOptions.good;
    return {
      columns: [
        ...col,
        {
          prop: "dealerShowStatus",
          label: "售后状态",
          col: {
            width: "160px"
          },
          render: (h: any, row: any) =>
            h("div", [
              h("span", {
                class: (row => {
                  return row.dealerShowStatus === 0 ? "dot dot1" : "dot dot5";
                })(row)
              }),
              h(
                "span",
                {
                  class: (row => {
                    return row.dealerShowStatus === 3 ? "yellow" : "";
                  })(row)
                },
                this.filterStatus(row)
              ),
              h(
                "span",
                {
                  class: (row => {
                    return row.needRemind ? "red" : "hidde";
                  })(row)
                },
                "（即将超时）"
              )
            ])
        },
        {
          prop: "handlingOpinions",
          label: "处理意见"
        },
        {
          prop: "createdTime",
          label: "提交时间",
          col: {
            width: "120px",
            fixed: "right"
          },
          formatter: (row: any) => formatDate(row.createdTime)
        },
        {
          type: "operation",
          col: {
            width: "230px",
            fixed: "right"
          },
          btns: [
            {
              text: "售后详情",
              show: (row: any) => this.accessIsOpened("PERM:AFTER_SALE:VIEW"),
              atClick: (row: any) => this.goToDetail(row)
            },
            {
              text: "退款",
              show: (row: any) =>
                this.accessIsOpened("PERM:AFTER_SALE:EDIT") && this.type !== "2" && row.dealerShowStatus === 0,
              atClick: (row: any) => this.goRefund(row)
            },
            {
              text: "重新退款",
              show: (row: any) =>
                this.accessIsOpened("PERM:AFTER_SALE:EDIT") && this.type !== "2" && row.dealerShowStatus === 2,
              atClick: (row: any) => this.goRefundAgain(row)
            },
            {
              text: "确认换货",
              show: (row: any) =>
                this.accessIsOpened("PERM:AFTER_SALE:EDIT") && this.type === "2" && row.dealerShowStatus === 0,
              atClick: (row: any) => this.confirmGoods(row)
            }
          ]
        }
      ]
    };
  }

  /**
   * @description 操作按钮
   */
  private goToDetail(row: any) {
    let text =
      this.type === "0" ? "售后详情（仅退款）" : this.type === "1" ? "售后详情（退款退货）" : "售后详情（换货）";
    this.dialogDeRef.openDialog(row.id, text, false);
  }
  private goRefund(row: any) {
    let text = this.type === "2" ? "换货确认" : "退款";
    this.dialogRef.openDialog(row.id, text, false);
  }
  private goRefundAgain(row: any) {
    this.dialogRef.openDialog(row.id, "重新退款", true);
  }
  private confirmGoods(row: any) {
    this.dialogRef.openDialog(row.id, "换货确认", false);
  }
  // 退款，退货操作成功
  private successful(e: any) {
    this.adminTableRef.goSearch();
  }
  // 点击 退款商品-退款详情
  private openRefundGoodsDetail({ goodsOutputs }: any) {
    this.refundGoodsList = goodsOutputs;
    this.refundGoodsVisible = true;
  }

  private filterStatus({ dealerShowStatus, needRemind }: any) {
    // type类型不同 关闭描述不同
    let _closeTxt = this.type === "0" ? "退款关闭" : this.type === "1" ? "退款退货关闭" : "换货关闭";
    // needRemind的状态不同 待处理订单显示不同
    let _statusList = ["待处理", "待入账", "退款失败", "退款成功", "已撤销", "确认换货", _closeTxt];
    return _statusList[dealerShowStatus];
  }
}
</script>
<style lang='scss' scoped>
/deep/ {
  .yellow {
    color: #f90;
  }
  .red {
    color: red;
  }
  .hidde {
    display: none;
  }
}
</style>
<template>
  <div class="appointment">
    <breadcrumb-group :breadGroup="[{ label: '在线预订', to: '' }]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    ref="adminTableRef"
                    :customQuery="customQuery"
                    :apiFn="getList"
                    :formData.sync="subForm">
      <template slot="search"
                class="search-head">
        <el-form-item prop="dealerName"
                      v-if="role === '0'">
          <SearchRegion :bId.sync="subForm.businessUnitId"
                        :rId.sync="subForm.regionId"
                        :dId.sync="subForm.dealerCode"
                        :isClear.sync="isClearRegion"
                        @goSearch="goSearchTab"></SearchRegion>
        </el-form-item>
        <!-- <el-form-item prop="dealerName"
                      v-if="role === '0'">
          <el-input placeholder="经销商名称"
                    v-model="subForm.dealerName"
                    clearable></el-input>
        </el-form-item> -->
        <el-form-item prop="customerName">
          <el-input placeholder="客户姓名"
                    v-model="subForm.customerName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.vehicleSeriesCode"
                     placeholder="车系"
                     @change="changeSeries"
                     clearable>
            <el-option v-for="(item, index) in carSeries"
                       :key="index"
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.vehicleModelCode"
                     :disabled="subForm.vehicleSeriesCode ? false : true"
                     placeholder="车型"
                     clearable>
            <el-option v-for="(item, index) in carModel"
                       :key="index"
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="counselorName"
                      v-if="role === '2'">
          <el-input placeholder="专属顾问"
                    v-model="subForm.counselorName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.status"
                     placeholder="订单状态"
                     clearable>
            <el-option v-for="(item, index) in orderStatus"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.dealerShowStatus"
                     placeholder="售后状态"
                     clearable>
            <el-option v-for="(item, index) in saleStatus"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgType"
                      class="btn-order">
          <el-button @click="openDepositDialog"
                     v-if="role === '2' && accessIsOpened('PERM:PRE_PURCHASE:EDIT')">订金核销</el-button>
        </el-form-item>
      </template>
    </el-admin-table>
    <!-- 订金核销 -->
    <el-dialog title="订金核销"
               :show-close="false"
               @close="closeDepDialog"
               :visible.sync="depositDialog">
      <div>
        <el-form :model="formParam"
                 ref="ruleFormRef"
                 :rules="formRule"
                 label-width="33%"
                 @submit.native.prevent>
          <el-row class="row-height">
            <el-col :span="16">
              <el-form-item prop="orderCode"
                            label="核销码:">
                <el-input class="el-code"
                          v-model="formParam.orderCode"
                          size="small"
                          placeholder="请输入内容"
                          maxlength="8"
                          show-word-limit
                          clearable>
                </el-input>
                <el-button size="small"
                           type="primary"
                           @click="checkCode">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="row-height"
                v-if="formParam.orderCode && orderIsShow">
          <el-col :push="6"
                  :span="16"
                  class="success-code"
                  v-if="depositInfo.receiver.val">
            <i class="el-icon-success"></i>有效核销码</el-col>
          <el-col :push="6"
                  :span="16"
                  class="error-code"
                  v-else>
            <i class="el-icon-error"></i>核销码不存在，请核对后重新输入</el-col>
        </el-row>
        <el-row class="row-height"
                v-for="(item, index) in depositInfo"
                :key="index"
                v-show="formParam.orderCode && orderIsShow && depositInfo.receiver.val">
          <el-col class="text-right"
                  :span="5">{{ item.name }}:</el-col>
          <el-col :push="1"
                  :span="16">{{ item.val }}</el-col>
        </el-row>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDepDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDep">确 定</el-button>
      </div>
    </el-dialog>
    <refundDialog ref="dialogRef"
                  @successful="successful"
                  dialogType="carOrderRefund"></refundDialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Ref, Watch } from "vue-property-decorator";
import { roleInfoSetting, storeInfoSetting } from "@/utils/userSetting";
import { prePurchase } from "@/api/modules/appointment";
import { seriesBrandCode, modelBySeriesCode } from "@/api";
import { getOrderDetailByCdkey, gverifyCdkey, agentAfterSaleDetail, afterSaleDeal } from "@/api/modules/appointment";
import { orderStatus, saleStatus, afterSale, depositInfo } from "./const/common";
import dayjs from "dayjs";
import { columns } from "../dealer/const/dealer-list";
import SearchRegion from "@/components/search-region/index.vue";
import refundDialog from "@/components/refund-dialog/index.vue";
interface culmon {
  title: string;
  key: string;
}
interface SubForm {
  dealerName: string;
  counselorName: string;
  customerName: string;
  vehicleSeriesCode: string;
  vehicleModelCode: string;
  status: string;
  dealerShowStatus: string;
  businessUnitId: number | string;
  dealerCode: number | string;
  regionId: number | string;
}
interface msgList {
  orderCode?: string;
  applyExplain: any;
  status: any;
}
@Component({
  components: {
    SearchRegion,
    refundDialog
  }
})
export default class appointment extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  @Ref() readonly dialogRef: any;
  private formData = { businessUnitId: "", dealerCode: "", regionId: "" };
  subForm: SubForm = {
    dealerName: "",
    counselorName: "",
    customerName: "",
    vehicleSeriesCode: "",
    vehicleModelCode: "",
    dealerCode: "",
    status: "",
    dealerShowStatus: "",
    businessUnitId: "",
    regionId: ""
  };
  get customQuery() {
    if (roleInfoSetting.getRole() === "2") {
      return {
        dealerCode: storeInfoSetting.getInfo().dealerCode
      };
    } else if (roleInfoSetting.getRole() === "0") {
      return {
        mfId: storeInfoSetting.getInfo().channelId
      };
    } else {
      return {};
    }
  }
  orderCode: string = "";
  formRule: Object = {
    orderCode: [{ required: true, message: "请输入核销码", trigger: "blur" }]
  };
  role: number | string = roleInfoSetting.getRole();
  // 车系
  carSeries: any[] = [];
  carModel: any[] = [];
  dealerShow: any = {
    prop: "dealerName",
    key: "dealerName",
    label: "经销商名称"
  };
  operateShow: any = {
    type: "operation",
    col: {
      width: "180px"
    },
    btns: [
      {
        text: "退款",
        show: (row: any) => row.dealerShowStatus === 0 && this.accessIsOpened("PERM:AFTER_SALE:EDIT"),
        atClick: (row: any) => {
          this.openDialog(row, "退款", false);
        }
      },
      {
        text: "重新退款",
        show: (row: any) => row.dealerShowStatus === 2 && this.accessIsOpened("PERM:AFTER_SALE:EDIT"),
        atClick: (row: any) => {
          this.openDialog(row, "重新退款", true);
        }
      }
    ]
  };
  // 表单参数
  formParam: msgList = {
    status: 0,
    applyExplain: ""
  };
  @Watch("formParam.orderCode")
  onIsChange(newVal: any, oldVal: any) {
    if (newVal !== oldVal) {
      for (var i in this.depositInfo) {
        this.depositInfo[i].val = "";
      }
      this.orderIsShow = false;
    }
  }
  // 使用状态
  orderStatus: element.Options[] = orderStatus;
  // 售后状态
  saleStatus: element.Options[] = saleStatus;
  // 定金核销dialog
  depositDialog: boolean = false;
  // 定金核销info
  depositInfo: any = depositInfo;
  // 是否展示订单信息
  orderIsShow: boolean = false;
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        prop: "customerName",
        key: "customerName",
        label: "客户姓名"
      },
      {
        prop: "customerPhone",
        key: "customerPhone",
        label: "手机号"
      },
      {
        prop: "modelForCollectionsOutput",
        key: "modelForCollectionsOutput",
        label: "预订车型",
        formatter: (row: any) => {
          if (row.modelForCollectionsOutput && row.modelForCollectionsOutput.name) {
            return `${row.modelForCollectionsOutput.seriesName}-${row.modelForCollectionsOutput.name}`;
          } else {
            return row.modelForCollectionsOutput;
          }
        }
      },
      {
        prop: "expectAt",
        key: "expectAt",
        label: "期望提车时间",
        formatter: (row: any) => {
          return row.expectAt === 1
            ? "一周内"
            : row.expectAt === 2
            ? "半月内"
            : row.expectAt === 3
            ? "一个月内"
            : row.expectAt === 4
            ? "三个月内"
            : "";
        }
      },
      {
        prop: "price",
        key: "price",
        label: "订金(元)"
      },
      {
        prop: "status",
        key: "status",
        label: "订单状态",
        render: (h: any, row: any) =>
          h(
            "div",
            {
              attrs: {
                class: `used${row.status}`
              }
            },
            row.status === 10
              ? "待付款"
              : row.status === 20
              ? "待使用"
              : row.status === 40
              ? "已完成"
              : row.status === 45
              ? "已关闭"
              : "-"
          )
      },
      {
        prop: "dealerShowStatus",
        key: "dealerShowStatus",
        label: "售后状态",
        render: (h: any, row: any) =>
          h(
            "div",
            {
              attrs: {
                class: row.dealerShowStatus === 2 ? "refuse-text" : ""
              }
            },
            row.dealerShowStatus === null ? "未申请" : afterSale[row.dealerShowStatus]
          )
      },
      {
        prop: "handlingOpinions",
        key: "handlingOpinions",
        label: "处理意见",
        formatter: (row: any) => (row.handlingOpinions ? row.handlingOpinions : "-")
      },
      {
        prop: "counselorName",
        key: "counselorName",
        label: "专属顾问"
      },
      {
        prop: "createdTime",
        key: "createdTime",
        label: "提交时间",
        formatter: (row: any) => dayjs(row.createdTime).format("YYYY-MM-DD HH:mm")
      }
    ]
  };
  checkCode() {
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        this.getOrderDetailByCdkey();
      }
    });
  }
  openDialog(row: any, text: string, status: boolean) {
    this.dialogRef.openDialog(row.afterSaleOrderId, text, status);
  }
  // 退款，退货操作成功
  successful(e: any) {
    this.adminTableRef.goSearch();
  }
  closeDepDialog() {
    for (var i in this.depositInfo) {
      this.depositInfo[i].val = "";
      this.formParam.orderCode = "";
    }
    this.orderIsShow = false;
    this.depositDialog = false;
  }
  confirmDep() {
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        this.gverifyCdkey();
      }
    });
  }
  openDepositDialog() {
    this.depositDialog = true;
  }
  getList(param = this.subForm) {
    return prePurchase(param);
  }
  changeSeries() {
    let code = this.subForm.vehicleSeriesCode;
    this.carModel = [];
    this.subForm.vehicleModelCode = "";
    if (code) {
      this.fctoryCarMol(code);
    }
  }
  // 核销订单券码
  async gverifyCdkey() {
    try {
      let { data } = await gverifyCdkey({ cdkey: this.formParam.orderCode });
      if (data) {
        this.$message("操作成功");
        this.closeDepDialog();
        this.adminTableRef.goSearch();
      }
    } catch (error) {
      this.log(error);
    }
  }
  // 通过核销码查询订单
  async getOrderDetailByCdkey() {
    try {
      let { data } = await getOrderDetailByCdkey({ cdkey: this.formParam.orderCode });
      if (data && data.orderDeliveryOutput) {
        this.depositInfo.receiver.val = data.orderDeliveryOutput.receiver;
        this.depositInfo.createdTime.val = dayjs(data.createdTime).format("YYYY-MM-DD HH:mm");
        this.depositInfo.phone.val = data.orderDeliveryOutput.phone;
        this.depositInfo.skuName.val = data.orderItemDetailList[0].skuName;
        this.depositInfo.expectAtStr.val = data.orderDeliveryOutput.expectAtStr;
        this.depositInfo.skuPrice.val = data.orderItemDetailList[0].skuPrice;
      }
      this.orderIsShow = true;
    } catch (error) {
      this.orderIsShow = true;
    }
  }
  // 售后订单详情
  async afterSaleDetail(id: number) {
    let { data } = await agentAfterSaleDetail(id);
  }
  // 处理售后订单
  async afterSaleDeal() {
    let param = {
      afterSaleOrderId: "",
      afterSaleType: 0,
      applyExplain: this.formParam.applyExplain,
      status: Number(this.formParam.status)
    };
    let { data } = await afterSaleDeal(param);
  }
  // 获取主机厂车系
  async factoryCarSeries() {
    let { data } = await seriesBrandCode("geely");
    if (data) {
      this.carSeries = data;
    }
  }
  async fctoryCarMol(code: string) {
    let { data } = await modelBySeriesCode(code);
    if (data) {
      this.carModel = data;
    }
  }
  created() {
    if (this.role === "0") {
      this.tableAttrs.columns.unshift(this.dealerShow);
    } else if (this.role === "2") {
      this.tableAttrs.columns.push(this.operateShow);
    }
    this.factoryCarSeries();
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .used10,
  .used20,
  .used40,
  .used45 {
    position: relative;
    margin-left: 15px;
  }
  .used10:before,
  .used20:before,
  .used40:before,
  .used45:before {
    position: absolute;
    left: -10px;
    bottom: 8px;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
  }
  .used20:before {
    background-color: #d0f30b;
  }
  .used45:before {
    background-color: #f14a08;
  }
  .used40:before {
    background-color: #26c24d;
  }
  .refuse-text {
    color: #d1dd2c;
  }
  .el-form--inline {
    position: relative;
    padding-right: 100px;
  }
}
.row-height {
  padding: 5px 0;
  .text-right {
    text-align: right;
  }
  .el-code {
    width: 260px;
    margin-right: 10px;
  }
  .refund-img {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }
  .success-code {
    color: #26c24d;
  }
  .error-code {
    color: #a0aa11;
  }
}
.code-content {
  display: flex;
  align-items: center;
}
.apply-title {
  font-size: 16px;
}
.from-style {
  width: 70%;
}
.btn-order {
  position: absolute;
  right: 0;
}
</style>

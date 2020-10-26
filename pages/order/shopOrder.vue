<template>
  <!-- 到店订单 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'到店订单'}]" />
    <el-admin-table ref="tableRef"
                    :tableAttrs="tableAttrs"
                    :apiFn="apiFn"
                    :formData.sync="searchData"
                    :customQuery="{type:'0'}"
                    :hasSearchBtn="true"
                    @reset="reset">
      <span slot="right-btns"
            v-if="isAgent">
        <el-button size="small"
                   v-if="accessIsOpened('PERM:SHOP_ORDER_LIST:EDIT')"
                   class="right_btn"
                   type="primary"
                   @click="openCDKModal">订单验券</el-button>
      </span>
      <template slot="search">
        <SearchRegion v-if="isFactory"
                      :bId.sync="searchData.businessUnitId"
                      :rId.sync="searchData.regionId"
                      :dId.sync="searchData.dealerCode"
                      :isClear.sync="isClearRegion"
                      @goSearch="goSearchTab" />

        <orderSearch :formData.sync="searchData"
                     :daterange.sync="daterange" />

      </template>
    </el-admin-table>

    <remarkModal ref="remarkModalRef"
                 :viewOrderInfo="viewOrderInfo"
                 :rowOrderId="rowOrderId"
                 :markVisible.sync="markVisible"
                 @success="getTableList" />

    <elBtnDialog title="订单验券"
                 :visible.sync="modalVisible"
                 :saveAutoClose="false"
                 @save="gverifyCdkey">
      <el-form ref="cdkFormRef"
               :model="cdkForm"
               v-if="modalVisible"
               size="small"
               :rules="cdkFormRule"
               label-width="100px"
               @submit.native.prevent>
        <el-form-item label="核销码："
                      prop="cdkey">
          <el-input v-model="cdkForm.cdkey"
                    class="inputsdf"
                    placeholder="请输入核销码"
                    :maxlength="10"
                    clearable>
            <span slot="suffix">{{cdkForm.cdkey.length}}/10</span>
          </el-input>
          <el-button @click="getOrderDetailByCdkey"
                     size="small"
                     type="primary">查询</el-button>
          <div v-show="showDet"
               class="green">
            <i class="el-icon-success" /> 有效核销码
          </div>
        </el-form-item>
        <div class="minsfa"
             v-show="showDet">
          <el-form-item label="订单编号:">{{cdkObj.orderNo}}</el-form-item>
          <el-form-item label="订单状态:">{{orderStatusFilter(cdkObj.status)}}</el-form-item>
          <el-form-item label="客户姓名:">{{cdkObj.userName}}</el-form-item>
          <el-form-item label="客户手机号:">{{cdkObj.phone || '-'}}</el-form-item>
          <el-form-item label="创建时间:">{{dayjs(cdkObj.createdTime).format('YYYY-MM-DD HH:mm')}}</el-form-item>
          <h4>商品信息</h4>
          <el-form-item label="购买商品:">
            <span v-for="(item, index) in cdkObj.orderItemDetailList || []"
                  :key="index">
              {{item.skuName}}
            </span>
          </el-form-item>
          <el-form-item label="零售价:">
            <span v-for="(item, index) in cdkObj.orderItemDetailList || []"
                  :key="index">
              {{item.skuPrice}} 元
            </span>
          </el-form-item>
        </div>
      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import { mixins } from "vue-class-component";
import orderListMixin from "./mixins/order-list.mixin";
import { Component, Ref } from "vue-property-decorator";
import { agentOrderColumns, factoryOrderColumns } from "./const";
import orderSearch from "./components/order-search.vue";
import remarkModal from "./components/remark-modal.vue";
import SearchRegion from "@/components/search-region/index.vue";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { orderStatusFilter } from "./const";
import { formatDate } from "@/utils";
import dayjs from "dayjs";
import { orderList, getOrderDetailByCdkey, gverifyCdkey } from "@/api";
const type = 0; // 订单类型（0-到店，1-邮寄，2-车辆预订单）
const required = true;
const trigger = ["blur", "change"];
const cdkeyValidator = (r: any, val: any, cb: any) => {
  if (!/^(\d|[a-zA-Z])*$/.test(val)) {
    cb(new Error("只能输入数字、字母"));
  } else {
    cb();
  }
};

@Component({
  components: { orderSearch, SearchRegion, remarkModal, elBtnDialog }
})
export default class ShopOrder extends mixins(orderListMixin) {
  private readonly storeStatus = [{ label: "已上架", value: true }, { label: "已下架", value: false }];
  readonly orderStatusFilter = orderStatusFilter;
  readonly dayjs = dayjs;
  @Ref("tableRef") readonly tableRef: any;
  @Ref("cdkFormRef") readonly cdkFormRef: element.Refs;
  @Ref("remarkModalRef") readonly remarkModalRef: any;
  readonly cdkFormRule: any = {
    cdkey: [{ required, trigger, message: "请输入核销码信息" }, { validator: cdkeyValidator, trigger }]
  };
  private markVisible: boolean = false;
  private modalVisible: boolean = false;
  private showDet: boolean = false;

  private rowOrderId: string = "";
  private cdkForm: any = { cdkey: "" };
  private cdkObj: any = {};
  private viewOrderInfo: any = {};

  private get tableAttrs() {
    const columns = this.isFactory ? factoryOrderColumns : agentOrderColumns;
    return {
      columns: [
        ...columns,
        {
          type: "operation",
          btns: [
            {
              text: "订单详情",
              show: (row: any) => this.accessIsOpened("PERM:SHOP_ORDER_LIST:VIEW"),
              atClick: (row: any) => this.goToDetail(row)
            },
            {
              text: "备注",
              show: (row: any) => this.accessIsOpened("PERM:SHOP_ORDER_LIST:EDIT") && this.isAgent,
              atClick: (row: any) => this.openRemarkModal(row)
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
    this.$router.push({
      name: "order-shopOrderDetail",
      params: {
        id: row.id
      }
    });
  }
  // 修改备注
  openRemarkModal(row: any) {
    this.rowOrderId = String(row.id);
    this.viewOrderInfo = row;
    this.remarkModalRef.openRemarkModal();
  }
  openCDKModal() {
    this.cdkForm = { cdkey: "" };
    this.modalVisible = true;
    this.showDet = false;
  }
  getOrderDetailByCdkey() {
    this.cdkFormRef.validate(async (v: boolean) => {
      if (v) {
        try {
          const { data } = await getOrderDetailByCdkey(this.cdkForm);
          this.cdkObj = data;
          this.showDet = true;
        } catch (e) {
          this.log(e);
        }
      }
    });
  }
  gverifyCdkey() {
    this.cdkFormRef.validate(async (v: boolean) => {
      if (v) {
        this.modalVisible = false;
        try {
          const { data } = await gverifyCdkey(this.cdkForm);
          this.showMsg("核验成功");
        } catch (e) {
          this.log(e);
        }
      }
    });
  }
}
</script>
<style lang='scss' scoped>
.line-box {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .line {
    span {
      font-size: 12px;
    }
  }
}
.right_btn {
  position: absolute;
  right: 0;
}
.inputsdf {
  width: 80%;
}
.minsfa .el-form-item {
  margin-bottom: 0;
}
.green {
  color: rgb(11, 189, 11);
}
</style>

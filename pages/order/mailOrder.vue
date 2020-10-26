<template>
  <!-- 邮寄订单 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'邮寄订单'}]" />
    <el-admin-table ref="tableRef"
                    :tableAttrs="tableAttrs"
                    :apiFn="apiFn"
                    :formData.sync="searchData"
                    :customQuery="{type:'1'}"
                    :hasSearchBtn="true"
                    @reset="resetTabRegion">
      <template slot="search">
        <SearchRegion v-if="isFactory"
                      :bId.sync="searchData.businessUnitId"
                      :rId.sync="searchData.regionId"
                      :dId.sync="searchData.dealerCode"
                      :isClear.sync="isClearRegion"
                      @goSearch="goSearchTab" />

        <orderSearch :formData.sync="searchData"
                     :daterange.sync="daterange"
                     isMail />
      </template>
    </el-admin-table>

    <el-dialog title="查看物流"
               :visible.sync="visible">
      <div class="company">
        <p><b>订单编号：</b>{{orderInfo.orderNo}}</p>
        <p><b>物流公司：</b>{{expressInfo.companyName}}</p>
        <p><b>快递单号：</b>{{expressInfo.logisticsNo}}</p>
      </div>
      <el-timeline class="timeline">
        <el-timeline-item v-for="(activity, index) in (expressInfo.logisticsDetailOutList || [])"
                          :key="index"
                          :type="index===0?'primary':''"
                          placement="top">
          {{dayjs(activity.time).format('YYYY-MM-DD HH:mm')}} <br>
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <deliverInfoModal ref="deliverInfoModalRef"
                      :rowOrderId="rowOrderId"
                      :viewOrderInfo="viewOrderInfo"
                      :infoVisible.sync="infoVisible"
                      :userInfoObj.sync="userInfoObj"
                      @success="getTableList" />
    <remarkModal ref="remarkModalRef"
                 :viewOrderInfo="viewOrderInfo"
                 :rowOrderId="rowOrderId"
                 :markVisible.sync="markVisible"
                 @success="getTableList" />
    <DiliverForm ref="diliverFormRef"
                 :viewOrderInfo="viewOrderInfo"
                 :businessId="rowOrderId"
                 :infoVisible.sync="diliverVisible"
                 @success="getTableList" />
  </div>
</template>

<script lang='ts'>
import { mixins } from "vue-class-component";
import orderListMixin from "./mixins/order-list.mixin";
import { Component, Ref } from "vue-property-decorator";
import { formatDate } from "@/utils";
import { agentOrderColumns, factoryOrderColumns, expressNoClick } from "./const";
import orderSearch from "./components/order-search.vue";
import remarkModal from "./components/remark-modal.vue";
import SearchRegion from "@/components/search-region/index.vue";
import deliverInfoModal from "./components/deliverInfo-modal.vue";
import DiliverForm from "./components//deliver-form.vue";
import dayjs from "dayjs";
import { orderList, getOrderDetail } from "@/api";
const type = 1; // 订单类型（0-到店，1-邮寄，2-车辆预订单）

@Component({
  components: {
    orderSearch,
    SearchRegion,
    remarkModal,
    DiliverForm,
    deliverInfoModal
  }
})
export default class MailOrder extends mixins(orderListMixin) {
  @Ref("remarkModalRef") readonly remarkModalRef: any;
  @Ref("deliverInfoModalRef") readonly deliverInfoModalRef: any;
  @Ref("tableRef") readonly tableRef: any;
  @Ref("diliverFormRef") readonly diliverFormRef: any;

  private expressInfo: any = {};
  private orderInfo: any = {};
  private viewOrderInfo: any = {};
  private visible: boolean = false;
  private dayjs = dayjs;

  private infoVisible: boolean = false;
  private markVisible: boolean = false;
  private diliverVisible: boolean = false;

  private rowOrderId: string = "";
  private userInfoObj: any = {
    // address: "",
    city: "",
    detailAddress: "",
    phone: "",
    receiver: "",
    postalCode: ""
  };

  private get tableAttrs() {
    const columns = this.isFactory ? factoryOrderColumns : agentOrderColumns;
    return {
      columns: [
        ...columns,
        {
          prop: "expressNumber",
          label: "物流单号",
          ...expressNoClick(this.viewExpress)
        },
        {
          type: "operation",
          col: {
            width: this.isFactory ? "80px" : "180px"
          },
          // 订单状态列表(10-待付款，20-待使用，23-待发货，25-待收货,30-待评价，40-已完成，45-已关闭)
          btns: [
            {
              text: "订单详情",
              show: (row: any) => this.accessIsOpened("PERM:MAIL_ORDER_LIST:VIEW"),
              atClick: (row: any) => this.goToDetail(row)
            },
            {
              text: "修改收货信息",
              show: (row: any) =>
                this.accessIsOpened("PERM:MAIL_ORDER_LIST:EDIT") &&
                this.isAgent &&
                [10, 23].indexOf(Number(row.status)) > -1,
              atClick: (row: any) => this.openModifyModal(row)
            },
            {
              text: "发货",
              show: (row: any) =>
                this.accessIsOpened("PERM:MAIL_ORDER_LIST:EDIT") && this.isAgent && Number(row.status) === 23,
              atClick: (row: any) => this.logisticsOrder(row)
            },
            {
              text: "备注",
              show: (row: any) => this.accessIsOpened("PERM:MAIL_ORDER_LIST:EDIT") && this.isAgent,
              atClick: (row: any) => this.isAgent && this.openRemarkModal(row)
            }
          ]
        }
      ]
    };
  }
  /**
   * @description 查看物流
   */
  async viewExpress(row: any) {
    try {
      const { data } = await getOrderDetail(row.id);
      this.orderInfo = data;
      this.expressInfo = data.logisticsRelatedDataOutput;
      this.visible = true;
    } catch (e) {
      this.log(e);
    }
  }
  // 修改备注
  openRemarkModal(row: any) {
    this.rowOrderId = String(row.id);
    this.viewOrderInfo = row;
    this.remarkModalRef.openRemarkModal();
  }
  // 修改收货信息
  openModifyModal(row: any) {
    this.rowOrderId = String(row.id);
    this.viewOrderInfo = row;
    this.userInfoObj = {
      receiver: row.orderDeliveryOutput.receiver || "",
      phone: row.orderDeliveryOutput.phone || "",
      city: "",
      detailAddress: "",
      // address: row.orderDeliveryOutput.address || '',
      postalCode: row.orderDeliveryOutput.postalCode || ""
    };
    this.deliverInfoModalRef.openModifyModal();
  }
  // 发货
  logisticsOrder(row: any) {
    this.viewOrderInfo = row;
    this.rowOrderId = String(row.id);
    this.diliverFormRef.openModal();
  }

  /**
   * @description 操作按钮
   */
  private goToDetail(row: any) {
    this.$router.push({
      name: "order-mailOrderDetail",
      params: {
        id: row.id
      }
    });
  }
}
</script>
<style lang='scss' scoped>
$wh: #f5f5f5;
.line-box {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  align-items: center;
  border-bottom: 1px solid $wh;
  .line {
    span {
      font-size: 12px;
    }
  }
}
.company {
  background: $wh;
  padding: 20px 20px 1px;
  p {
    margin-top: 0;
  }
}
.timeline {
  padding: 20px;
  border: 1px solid $wh;
  height: 220px;
  font-size: 13px;
  overflow: auto;
}
/deep/ {
  .smbt .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      color: #333;
    }
  }
}
</style>

<template>
  <!-- 到店订单、邮寄订单 的订单详情 -->
  <div class="orderDetail">
    <breadcrumb-group :breadGroup="breadGroup" />
    <div class="box-card line"
         id="customer">
      <b>订单编号：{{_orderInfo.orderNo || '-'}}</b>
      <span class="ft-12">提交时间：{{dayjs(_orderInfo.createdTime).format('YYYY-MM-DD HH:mm')}}</span>
      <!-- // 订单状态列表(10-待付款，20-待使用，23-待发货，25-待收货,30-待评价，40-已完成，45-已关闭) -->
      <span v-if="isAgent">
        <el-button size="small"
                   type="primary"
                   v-if="accessIsOpened('PERM:MAIL_ORDER_LIST:EDIT')"
                   @click="openRemarkModal">
          备注
        </el-button>
        <el-button size="small"
                   type="primary"
                   v-if="accessIsOpened('PERM:MAIL_ORDER_LIST:EDIT')&& isMail && [10,23].indexOf(_orderInfo.status)>-1"
                   @click="openModifyModal">
          修改收货信息
        </el-button>
      </span>
    </div>

    <div class="mtcard">
      <div class="top_btns">
        <a href="#customer"
           class="el-button el-button--mini">客户信息</a>
        <a href="#goods"
           class="el-button el-button--mini">商品信息</a>
        <a href="#diliver"
           v-if="isMail"
           class="el-button el-button--mini">物流信息</a>
        <a href="#remark"
           class="el-button el-button--mini">订单备注</a>
      </div>
      <div class="plr20">
        <b class="order-status">订单状态：{{orderStatusFilter(_orderInfo.status)}}</b>
      </div>
    </div>

    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span class="ft-bold">客户信息</span>
      </div>
      <div class="info-table"
           id="goods">
        <slot name="user-info" />
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span class="ft-bold">商品信息</span>
      </div>
      <common-table :tableColumns="tableColumns"
                    :data="_orderInfo.orderItemDetailList || []"
                    :showPage="false"></common-table>

      <div class="ft-12">
        <p>
          <span class="w120sp">商品总金额：</span>{{_orderInfo.itemsTotalAmount || '-'}} 元
        </p>
        <p v-if="_orderInfo.installTotalAmount">
          <span class="w120sp">总安装费：</span>{{_orderInfo.installTotalAmount}} 元
        </p>
        <p>
          <span class="w120sp">优惠金额：</span>{{_orderInfo.discountAmount || '0.0'}} 元<br>
        </p>
        <h4>
          <span class="w120sp">订单合计：</span><span class="riyelal">{{_orderInfo.orderTotalAmount || '-'}} 元</span>
        </h4>
      </div>
    </el-card>

    <el-card class="box-card"
             v-if="isMail">
      <div slot="header"
           class="clearfix dis-Flex">
        <span class="ft-bold">物流信息</span>
        <span class="ft-12"
              v-if="expressInfo">
          {{expressInfo.companyName}}：{{expressInfo.logisticsNo}}
        </span>
      </div>
      <div>
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in (expressInfo.logisticsDetailOutList || [])"
                            :key="index"
                            :type="index===0?'primary':''"
                            placement="top">
            {{dayjs(activity.time).format('YYYY-MM-DD HH:mm')}} <br>
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <el-card class="box-card"
             id="remark">
      <div slot="header"
           class="clearfix">
        <span class="ft-bold">订单备注</span>
      </div>
      <div v-if="_orderInfo.orderRemarkList">
        <div v-for="(remark, j) in _orderInfo.orderRemarkList"
             :key="j"
             class="remark_item">
          <div :class="{'custrom':remark.type==0}">
            <span>【 {{remarksFilter(remark.type)}} {{remark.creatorName}} 】</span>{{remark.content}}
          </div>
          <span>{{dayjs(remark.createdTime).format('YYYY-MM-DD HH:mm')}}</span>
        </div>
      </div>
      <div v-else
           class="remark ft-12">
        暂无
      </div>
    </el-card>
    <imgPreview v-model="imgPreviewUrl" />
    <deliverInfoModal ref="deliverInfoModalRef"
                      :infoVisible.sync="infoVisible"
                      :viewOrderInfo="_orderInfo"
                      :userInfoObj.sync="userInfoObj"
                      @success="getOrderDetail" />
    <remarkModal ref="remarkModalRef"
                 :markVisible.sync="markVisible"
                 :viewOrderInfo="_orderInfo"
                 @success="getOrderDetail" />
    <el-backtop target="#theme-container-main" />

    <refundDialog ref="dialogDeRef"
                  @successful="getOrderDetail"
                  @openDetail="openRefundGoodsDetail"
                  dialogType="goodsOrderDetail" />
    <RefundGoodsDetail :visible.sync="refundGoodsVisible"
                       :list="refundGoodsList"
                       :type="type"
                       v-if="refundGoodsVisible"></RefundGoodsDetail>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Ref, PropSync, Vue } from "vue-property-decorator";
import CommonTable from "@/components/common-table/index.vue";
import imgPreview from "@femessage/img-preview";
import { orderStatusFilter } from "../const";
import { orderDetailStatusFilter, remarksFilter } from "../const/order-detail";
import { getOrderDetail } from "@/api";
import refundDialog from "@/components/refund-dialog/index.vue";
import remarkModal from "./remark-modal.vue";
import deliverInfoModal from "./deliverInfo-modal.vue";
import RefundGoodsDetail from "./refundGoodsDetail.vue";
import dayjs from "dayjs";

@Component({
  components: {
    remarkModal,
    deliverInfoModal,
    CommonTable,
    refundDialog,
    imgPreview,
    RefundGoodsDetail
  }
})
export default class OrderDetail extends Vue {
  private readonly dayjs = dayjs;
  private readonly orderStatusFilter = orderStatusFilter;
  private readonly remarksFilter = remarksFilter;
  @Ref("dialogDeRef") readonly dialogDeRef: any;
  @Ref("remarkModalRef") readonly remarkModalRef: any;
  @Ref("deliverInfoModalRef") readonly deliverInfoModalRef: any;

  @PropSync("orderInfo", {
    type: Object,
    default: () => {
      return {};
    }
  })
  _orderInfo: any;
  @Prop({ type: Boolean, default: false }) isMail: boolean;
  private tabelData: any[] = [];
  private imgPreviewUrl: string = "";
  private infoVisible: boolean = false;
  private markVisible: boolean = false;
  private refundGoodsVisible: boolean = false;
  private refundGoodsList: any[] = [];
  private userInfoObj: any = {
    city: "",
    detailAddress: "",
    phone: "",
    receiver: "",
    postalCode: ""
  };

  get tableColumns() {
    const shopColumn = this.isShop ? [{ title: "安装费（元）", key: "skuInstallPrice" }] : [];
    return [
      {
        title: "商品",
        key: "skuName",
        render: (h: any, row: any) =>
          h("div", { class: "flex_box" }, [
            h("img", {
              on: { click: () => (this.imgPreviewUrl = row.coverUrl) },
              attrs: { class: "ware_img", src: row.coverUrl }
            }),
            h("span", [h("span", row.skuName), h("br"), h("small", row.skuPropertyValue)])
          ])
      },
      {
        title: "零售价（元）",
        key: "skuPrice"
      },
      ...shopColumn,
      {
        title: "数量",
        key: "num"
      },
      {
        title: "状态",
        width: "180px",
        key: "status",
        render: (h: any, row: any) =>
          h(
            "div",
            {
              class: row.status > 2 ? "el-link el-link--primary fz12" : "fz12",
              on: {
                click: () => row.status > 2 && this.afterSaleDetail(row)
              }
            },
            orderDetailStatusFilter(row.status) +
            `${row.status > 0 && typeof row.usedNum === "number" ? "（已使用" + row.usedNum + "）" : ""}`
          )
      }
    ];
  }
  private expressInfo: any = {};
  get isShop() {
    return this.$route.path.indexOf("/shopOrderDetail") > -1;
  }
  get breadGroup() {
    if (this.isShop) {
      return [{ label: "到店订单", to: "/order/shopOrder" }, { label: "订单详情" }];
    }
    return [{ label: "邮寄订单", to: "/order/mailOrder" }, { label: "订单详情" }];
  }
  get orderId() {
    return this.$route.params.id;
  }
  get isAgent() {
    return this.$route.query.sysPlat === "agent";
  }

  async getOrderDetail() {
    try {
      const { data } = await getOrderDetail(this.orderId);
      this._orderInfo = data;
      this.expressInfo = data.logisticsRelatedDataOutput || {};
    } catch (e) {
      this.log(e);
    }
  }
  // 点击 退款商品-退款详情
  private openRefundGoodsDetail({ goodsOutputs }: any) {
    this.refundGoodsList = goodsOutputs;
    this.refundGoodsVisible = true;
  }
  openRemarkModal() {
    this.remarkModalRef.openRemarkModal();
  }
  afterSaleDetail(row: any) {
    this.dialogDeRef.openDialog(row.afterSaleOrderId, "售后详情", false);
  }
  openModifyModal() {
    this.userInfoObj = {
      city: "",
      detailAddress: "",
      receiver: this._orderInfo.orderDeliveryOutput.receiver || "",
      phone: this._orderInfo.orderDeliveryOutput.phone || "",
      // address: this._orderInfo.orderDeliveryOutput.address || '',
      postalCode: this._orderInfo.orderDeliveryOutput.postalCode || ""
    };
    this.deliverInfoModalRef.openModifyModal();
  }
  created() {
    this.getOrderDetail();
  }
}
</script>
<style lang='scss' scoped>
.mtcard {
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  position: sticky;
  top: 0;
  z-index: 4;
}
.plr20,
.top_btns {
  padding: 20px;
}
.top_btns {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.el-button {
  text-decoration: none;
}
.orderDetail {
  padding-bottom: 15px;
}
.ft-12 {
  font-size: 12px;
}
.ft-bold {
  font-weight: bold;
}
.dis-Flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-status {
  color: rgb(18, 125, 215);
}
.ft-yellow {
  color: #ff9900;
}
.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  padding: 18px 20px;
}
.box-card {
  margin-top: 20px;
}
/deep/ {
  .el-timeline-item__content {
    @extend .ft-12;
  }
  .el-input__inner {
    padding-right: 80px;
  }
  .ware_img {
    max-width: 40px;
    cursor: pointer;
    margin-right: 5px;
  }
  small {
    color: #777;
  }
  .flex_box {
    display: flex;
  }
}
.info-table {
  p {
    font-size: 12px;
    line-height: 30px;
    span {
      display: inline-block;
      color: #827f7f;
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
.remark_item {
  font-size: 13px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 5px;
  & + & {
    border-top: 1px solid #eee;
  }
  div {
    width: calc(100% - 160px);
  }
}
.custrom {
  display: flex;
  align-items: center;
  span {
    @extend .order-status;
    font-weight: bold;
  }
}
.riyelal {
  color: #ff9900;
}
.w120sp {
  display: inline-block;
  width: 120px;
}
</style>
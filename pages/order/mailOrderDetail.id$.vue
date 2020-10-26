<template>
  <div>
    <!-- // 订单状态列表(10-待付款，20-待使用，23-待发货，25-待收货,30-待评价，40-已完成，45-已关闭) -->
    <orderDetail ref="orderDetailRef"
                 :orderInfo.sync="orderInfo"
                 isMail>
      <template slot="user-info"
                v-if="orderInfo.orderDeliveryOutput">
        <p>
          <span>客户姓名：</span>{{orderInfo.orderDeliveryOutput.receiver || '-'}}
        </p>
        <p>
          <span>客户手机号：</span>{{orderInfo.orderDeliveryOutput.phone || '-'}}
        </p>
        <p>
          <span>收货地址：</span>{{orderInfo.orderDeliveryOutput.address || '-'}}
        </p>
        <p>
          <span>邮编：</span>{{orderInfo.orderDeliveryOutput.postalCode || '-'}}
        </p>
      </template>
    </orderDetail>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import orderDetail from "./components/orderDetail.vue";
@Component({
  components: {
    orderDetail
  },
})
export default class MailOrderDetail extends Vue {
  @Ref('orderDetailRef') readonly orderDetailRef: any;

  private orderInfo: any = {};
}
</script>
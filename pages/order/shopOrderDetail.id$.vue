<template>
  <div>
    <orderDetail :orderInfo.sync="orderInfo">
      <template slot="user-info">
        <p>
          <span>客户姓名：</span>{{orderInfo.userName || '-'}}
        </p>
        <p>
          <span>客户手机号：</span>{{orderInfo.phone || '-'}}
        </p>
        <template v-if="orderInfo.orderDeliveryOutput">
          <p>
            <span>收货地址：</span>{{orderInfo.orderDeliveryOutput.address || '-'}}
          </p>
          <p>
            <span>邮编：</span>{{orderInfo.orderDeliveryOutput.postalCode || '-'}}
          </p>
        </template>
      </template>
    </orderDetail>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import orderDetail from "./components/orderDetail.vue";
@Component({
  components: {
    orderDetail
  },
})
export default class ShopOrderDetail extends Vue {
  private orderInfo: any = {};
}
</script>
<template>
  <div>
    <el-btn-dialog title="修改收货信息"
                   :visible.sync="_infoVisible"
                   :saveAutoClose="false"
                   @save="updateDeliveryInfo">
      <el-form ref="userInfoObjRef"
               :model="_userInfoObj"
               style="width:90%"
               :rules="userInfoObjRule"
               label-width="100px"
               size="small"
               @submit.native.prevent>
        <div class="smbt">
          <el-form-item label="订单编号"> {{_viewOrderInfo.orderNo}} </el-form-item>
          <el-form-item label="创建时间">{{dayjs(_viewOrderInfo.createdTime).format('YYYY-MM-DD HH:mm')}}</el-form-item>
          <el-form-item label="订单金额">{{_viewOrderInfo.orderTotalAmount}} 元</el-form-item>
          <template v-if="_viewOrderInfo.orderDeliveryOutput">
            <el-form-item label="收货地址">
              {{_viewOrderInfo.orderDeliveryOutput.address}}
            </el-form-item>
            <el-form-item label="客户姓名">{{_viewOrderInfo.orderDeliveryOutput.receiver}}</el-form-item>
            <el-form-item label="客户手机号">{{_viewOrderInfo.orderDeliveryOutput.phone}}</el-form-item>
          </template>
        </div>
        <h4>修改收货信息</h4>
        <el-form-item label="客户姓名"
                      prop="receiver">
          <el-input v-model="_userInfoObj.receiver"
                    :maxlength="20"
                    clearable>
            <span slot="suffix">{{_userInfoObj.receiver.length}}/20</span>
          </el-input>
        </el-form-item>
        <el-form-item label="客户电话"
                      prop="phone">
          <el-input v-model="_userInfoObj.phone"
                    v-formatNum:0="_userInfoObj.phone"
                    :maxlength="11"
                    clearable>
            <span slot="suffix">{{_userInfoObj.phone.length}}/100</span>
          </el-input>
        </el-form-item>
        <el-form-item label="城市选择"
                      prop="city"
                      class="casrjl">
          <el-cascader v-model="_userInfoObj.city"
                       ref="cascaderRef"
                       :options="options" />
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="detailAddress">
          <el-input v-model="_userInfoObj.detailAddress"
                    :maxlength="100"
                    clearable>
            <span slot="suffix">{{_userInfoObj.detailAddress.length}}/100</span>
          </el-input>
        </el-form-item>
        <el-form-item label="邮编"
                      prop="postalCode">
          <el-input v-model.trim="_userInfoObj.postalCode"
                    :maxlength="6"
                    :v-formatNum:0="6"
                    clearable>
            <span slot="suffix">{{_userInfoObj.postalCode.length}}/6</span>
          </el-input>
        </el-form-item>
      </el-form>
    </el-btn-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Ref, Prop, PropSync, Vue } from 'vue-property-decorator';
import { updateDeliveryInfo } from "@/api";
import { orderDetailStatusFilter } from "../const/order-detail";
import area from "@/const/area.json";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import dayjs from "dayjs";
interface userInfoObjRule {
  detailAddress: element.FormRule[],
  city: element.FormRule[],
  phone: element.FormRule[],
  receiver: element.FormRule[],
};
const required = true;
const trigger = ['blur', 'change'];

@Component({
  components: {
    elBtnDialog,
  },
})
export default class DeliverInfo extends Vue {
  readonly dayjs = dayjs;
  readonly orderDetailStatusFilter = orderDetailStatusFilter;
  readonly options = area.jsonList;
  @Ref('cascaderRef') readonly cascaderRef: any;
  @Ref('userInfoObjRef') readonly userInfoObjRef: element.Refs;
  @PropSync('infoVisible', { type: Boolean, default: false }) _infoVisible: boolean;
  @PropSync('userInfoObj', { type: Object, default: false }) _userInfoObj: any;
  @Prop({ type: String }) rowOrderId: string;
  @PropSync('viewOrderInfo', {
    type: Object, default: () => { return {} }
  }) _viewOrderInfo: boolean;

  readonly userInfoObjRule: userInfoObjRule = {
    city: [{ required, trigger, message: '请输入选择城市' }],
    detailAddress: [{ required, trigger, message: '请输入详细地址' }],
    phone: [{ required, trigger, message: '请输入客户电话' }],
    receiver: [{ required, trigger, message: '请输入客户姓名' }]
  };
  get orderId() {
    return this.rowOrderId || this.$route.params.id;
  }
  openModifyModal() {
    this._infoVisible = true;
    this.$nextTick(() => this.userInfoObjRef.clearValidate())
  }
  updateDeliveryInfo() {
    this.userInfoObjRef.validate(async (v: boolean) => {
      if (v) {
        try {
          this._infoVisible = false;
          let prefix: string = this.cascaderRef.presentText;
          prefix = prefix.replace(/[\s/]/gi, '');
          const params = {
            orderId: this.orderId,
            phone: this._userInfoObj.phone,
            receiver: this._userInfoObj.receiver,
            postalCode: this._userInfoObj.postalCode,
            address: prefix + this._userInfoObj.detailAddress,
          }
          const { data } = await updateDeliveryInfo(params)
          this.showMsg('修改成功');
          this.$emit('success')
        } catch (e) {
          this.log(e)
        }
      }
    })
  };
}
</script>
<style lang="scss">
.casrjl .el-cascader {
  width: 100%;
}
</style>
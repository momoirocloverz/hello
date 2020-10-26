<template>
  <div>
    <elBtnDialog title="发货"
                 :saveAutoClose="false"
                 :visible.sync="_infoVisible"
                 @save="checkAfterSale">
      <el-form ref="formRef"
               :rules="deliverInfoRule"
               :model="deliverInfo"
               style="width:90%"
               label-width="100px"
               size="small">
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
        <h5>物流信息填写：<span class="ncnxcyellow">请线下发货后将物流单号填写到此处</span></h5>
        <el-form-item label="物流公司"
                      prop="logisticsCompanyId">
          <el-select v-model="deliverInfo.logisticsCompanyId"
                     placeholder="查询物流公司"
                     filterable
                     remote
                     reserve-keyword
                     :remote-method="getAllLogisticsCompany"
                     :loading="loading">
            <el-option v-for="item in allCompany"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号"
                      prop="logisticsNo">
          <el-input v-model.trim="deliverInfo.logisticsNo"
                    placeholder="请填写物流单号"
                    :maxlength="50"
                    clearable />
        </el-form-item>
      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import { Component, Ref, Prop, PropSync, Vue } from 'vue-property-decorator';
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { getAllLogisticsCompany, logisticsOrder, isInAfterSale } from "@/api";
import dayjs from "dayjs";
const required = true;
const trigger = ['blur', 'change'];
const logisticsNoValidator = (r: any, val: any, cb: any) => {
  if (!/^(\d|[a-zA-Z])*$/.test(val)) {
    cb(new Error('只能输入数字、字母'))
  } else {
    cb()
  }
}
interface DeliverInfoRule {
  logisticsNo: element.FormRule[],
  logisticsCompanyId: element.FormRule[]
}

@Component({
  components: {
    elBtnDialog
  },
})
export default class DiliverForm extends Vue {
  readonly dayjs = dayjs;
  @Ref('formRef') readonly formRef: element.Refs;
  @PropSync('infoVisible', { type: Boolean, default: false }) _infoVisible: boolean;
  @Prop({ type: String }) businessId: string;
  @PropSync('viewOrderInfo', {
    type: Object, default: () => { return {} }
  }) _viewOrderInfo: any;
  private loading: boolean = false;
  private allCompany: any = [];
  private deliverInfo: any = {
    logisticsCompanyId: '',
    logisticsNo: ''
  }
  private readonly deliverInfoRule: DeliverInfoRule = {
    logisticsCompanyId: [{ required, trigger, message: '请选择物流公司' }],
    logisticsNo: [
      { required, trigger, message: '请填写物流单号' },
      { validator: logisticsNoValidator, trigger }
    ],
  }
  openModal() {
    this._infoVisible = true;
    this.deliverInfo = {
      logisticsCompanyId: '',
      logisticsNo: ''
    }
    this.$nextTick(() => this.formRef.clearValidate())
  }
  async getAllLogisticsCompany(search: string) {
    if (!search) return;
    try {
      this.loading = true;
      const { data } = await getAllLogisticsCompany({ search });
      this.allCompany = data || []
      this.loading = false;
    } catch (e) {
      this.log(e)
      this.allCompany = []
      this.loading = false;
    }
  };
  checkAfterSale() {
    this.formRef.validate(async (v: boolean) => {
      if (v) {
        try {
          const { data } = await isInAfterSale(this._viewOrderInfo.id);
          if (data) {
            this.$confirm('该订单已有商品申请售后，确定继续发货？', '提示')
              .then(() => {
                this.logisticsOrder()
              })
              .catch(() => {
                this._infoVisible = false;
              })
          } else {
            this.logisticsOrder()
          }
        } catch (e) {
          this.log(e)
        }
      }
    })
  }
  async logisticsOrder() {
    this._infoVisible = false;
    try {
      const params = {
        businessId: this.businessId,
        ...this.deliverInfo
      }
      const { data } = await logisticsOrder(params);
      this.showMsg('发货成功');
      this.$emit('success')
    } catch (e) {
      this.log(e)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss">
.ncnxcyellow {
  font-weight: 400;
  color: #ce3203;
}
</style>
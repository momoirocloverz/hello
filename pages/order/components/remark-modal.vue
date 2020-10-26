<template>
  <div>
    <el-btn-dialog title="编辑备注"
                   :visible.sync="_markVisible"
                   :saveAutoClose="false"
                   @save="createOrderRemark">
      <el-form ref="markObjRef"
               :model="markObj"
               size="small"
               :rules="markObjRule"
               style="width:90%"
               label-width="100px"
               @submit.native.prevent>
        <div class="smbt">
          <el-form-item label="订单编号"> {{_viewOrderInfo.orderNo}} </el-form-item>
          <el-form-item label="客户姓名">{{_viewOrderInfo.userName}}</el-form-item>
          <el-form-item label="客户手机号">{{_viewOrderInfo.phone}}</el-form-item>
          <el-form-item label="订单状态">{{orderStatusFilter(_viewOrderInfo.status)}}</el-form-item>
          <el-form-item label="创建时间">{{dayjs(_viewOrderInfo.createdTime).format('YYYY-MM-DD HH:mm')}}</el-form-item>
          <el-form-item label="订单金额">{{_viewOrderInfo.orderTotalAmount}} 元</el-form-item>
        </div>
        <el-form-item label="备注信息"
                      prop="content"
                      class="miste">
          <el-input type="textarea"
                    placeholder="请输入"
                    v-model="markObj.content"
                    maxlength="500"
                    show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
    </el-btn-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Ref, PropSync, Vue } from 'vue-property-decorator';
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { orderStatusFilter } from "../const";
import { remarksFilter } from "../const/order-detail";
import dayjs from "dayjs";
import { createOrderRemark } from "@/api";
const required = true;
const trigger = ['blur', 'change'];

@Component({
  components: {
    elBtnDialog,
  },
})
export default class Remark extends Vue {
  readonly dayjs = dayjs;
  readonly orderStatusFilter = orderStatusFilter;
  readonly remarksFilter = remarksFilter;
  readonly markObjRule: any = {
    content: [{ required, trigger, message: '请输入备注信息' }]
  };
  @Ref('markObjRef') readonly markObjRef: element.Refs;
  @PropSync('markVisible', { type: Boolean, default: false }) _markVisible: boolean;
  @PropSync('viewOrderInfo', {
    type: Object, default: () => { return {} }
  }) _viewOrderInfo: boolean;
  @Prop({ type: String }) rowOrderId: string;

  private markObj: any = {
    content: ''
  };
  get orderId() {
    return this.rowOrderId || this.$route.params.id;
  }
  openRemarkModal() {
    this._markVisible = true;
    this.markObj = {
      content: ''
    };
    this.$nextTick(() => this.markObjRef.clearValidate())
  }
  createOrderRemark() {
    this.markObjRef.validate(async (v: boolean) => {
      // 0-买家备注，1-卖家备注，2-买家取消
      const type = 1
      if (v) {
        try {
          this._markVisible = false;
          const params = {
            orderId: this.orderId,
            type,
            ...this.markObj
          }
          const { data } = await createOrderRemark(params)
          this.showMsg('修改成功');
          this.$emit('success')
        } catch (e) {
          this.log(e)
        }
      }
    })
  }
}
</script>
<style lang="scss">
.miste .el-textarea__inner {
  height: 140px;
}
</style>
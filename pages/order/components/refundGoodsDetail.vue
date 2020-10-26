<template>
  <!-- 换货商品详情 -->
  <div class="refundGoodsDetail">
    <el-btn-dialog :visible.sync="_visible"
                   :dialogAttr="{width:'55%'}"
                   :title="title"
                   :saveAutoClose="false"
                   :hasCancelBtn="false"
                   :hasConfirmBtn="false">
      <common-table border
                    :tableColumns="tableColumns"
                    :data="list"
                    :total="list.length"
                    :showPage="list.length > 10">
        <template v-slot:column0="{row}">
          <div class="goods-content">
            <img :src="row.coverUrl"
                 alt="">
            <div>
              <h4 class="text-over">{{row.skuName}}</h4>
              <span class="text-over">{{row.skuPropertyValue}}</span>
            </div>
          </div>
        </template>
      </common-table>
    </el-btn-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Config } from "./../const/afterSale";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import CommonTable from "@/components/common-table/index.vue";
@Component({
  components: { ElBtnDialog, CommonTable }
})
export default class RefundGoodsDetail extends Vue {
  @PropSync("visible", { type: Boolean, default: false }) _visible!: boolean;
  @Prop({ type: Array, default: () => [] }) list!: any[];
  @Prop({ type: String, default: "0" }) type!: string; // 0 仅退款 1 退款退货 2 换货

  private pickerOptions = new Config().get(this);

  get tableColumns() {
    let col = this.type === "0" ? this.pickerOptions.onlyDetail : this.pickerOptions.goodDetail;
    return col;
  }
  get title() {
    let _arr = ["退款商品", "退款退货商品", "换货商品"];
    return _arr[Number(this.type)];
  }
}
</script>
<style lang='scss' scoped>
.goods-content {
  display: flex;
  justify-content: space-between;
  img {
    width: 80px;
    height: 80px;
  }

  .text-over {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
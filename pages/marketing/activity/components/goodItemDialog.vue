<!--添加团购-->
<template>
  <el-dialog
    class="goods-dialog"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="70%"
    :before-close="handleClose"
    append-to-body
  >
    <common-form
      v-if="dialogObj.type === 'addGoods'"
      ref="goodsRef"
      :rules="constant.GOODS_RULES"
      :props="constant.GOODS_PROPS"
      :form="goodsForm"
      :inline="false"
    >
      <el-cascader
        v-model="goodsForm.carModel"
        :props="goodsProps"
        :options="carList"
        @change="changeModel"
        slot="carModel"
      ></el-cascader>
    </common-form>
    <div class="bottom-btn" slot="footer">
      <el-button size="small" @click="handleSure" type="primary">确定</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { DialogInfo } from "@/@types/activity";
import { dealerMaxRule, getSeriesModelList } from "@/api";
import { toCent } from "@/utils/index";
import Const from "../const/";
const prefix = process.env.VUE_APP_API_VERSION;
interface GoodsForm {
  guidePrice: number;
  maxCompanyDiscountPercentage: number;
  maxCompanyDiscountPrice: number;
  maxDealerDiscountPrice: number;
  maxDealerRuleStatus: string;
}
@Component({
  name: "goodsDialog",
  components: {
    CommonForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: () => {} }) private form: any;
  @Ref() private goodsRef: { formRef: HTMLFormElement };
  get constant(): any {
    return new Const(this).const;
  }
  carList: Array<any> = [];
  goodsProps: any = {
    label: "name",
    value: "code",
    children: "modelList"
  };
  private goodsForm: any = {
    carModel: [],
    guidePrice: null,
    maxCompanyDiscountPercentage: null,
    maxCompanyDiscountPrice: null,
    maxDealerDiscountPrice: null,
    maxDealerRuleStatus: null
  };
  private handleClose(): void {
    this.$emit("handleClose");
  }
  async changeModel(val: Array<string> = []) {
    let modelCode = val && val[1];
    if (modelCode) {
      let res = await dealerMaxRule(modelCode);
      this.goodsForm = res.data;
      this.goodsForm.carModel = val;
    }
  }
  handleSure(): void {
    this.goodsRef.formRef.validate((valid: boolean) => {
      if (valid) {
        debugger
        this.goodsForm.goodsGrouponPrice = toCent(this.goodsForm.goodsGrouponPrice);
        this.form.reletedGoods.push(this.goodsForm);
        this.handleClose();
      }
    });
  }
  async getCarList() {
    try {
      let res = await getSeriesModelList();
      let _arr = res.data || [];
      for (let i = 0; i < _arr.length; i++) {
        _arr[i].modelList = _arr[i].modelList.map((car: any) => {
          car.disabled = this.form.reletedGoods.find((item: any) => item.modelCode === car.code);
          return car;
        });
      }
      this.carList = _arr;
    } catch (e) {
      throw new Error(e);
    }
  }
  mounted() {
    this.getCarList();
  }
}
</script>
<style lang="scss">
.goods-dialog {
  .el-input,
  .el-cascader {
    width: 60%;
    .el-input {
      width: 100%;
    }
  }
}
</style>

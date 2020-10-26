<template>
  <!-- 上架组件 -->
  <el-btn-dialog :visible.sync="_visible"
                 :dialogAttr="{width:'55%'}"
                 title="上架"
                 :saveLoading="submitLoading"
                 :saveAutoClose="false"
                 @save="agentSaveAdd"
                 @close="close">
    <b class="title">{{name}}（{{code}}）</b>
    <el-form @submit.native.prevent
             :model="saleForm"
             class="sub_form"
             ref="ruleForm"
             :rules="rules"
             label-width="120px">
      <el-form-item label="热销："
                    prop="isHot">
        <el-switch v-model="saleForm.isHot"></el-switch>
        <span class="ft-12">开启后该商品将显示在首页“ 热销 ”板块中</span>
      </el-form-item>
      <el-form-item label="商品分类："
                    prop="mallCategoryId">
        <el-select v-model="saleForm.mallCategoryId"
                   placeholder="请选择商品分类">
          <el-option v-for="(item, index) in categoryList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提货方式："
                    prop="method">
        <el-checkbox-group v-model="saleForm.method"
                           @change="checkboxChange">
          <el-checkbox :label="1"
                       name="type">到店安装</el-checkbox>
          <el-checkbox :label="2"
                       name="type">物流配送</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="安装费："
                    prop="installationFee"
                    v-if="saleForm.method.includes(1)">
        <el-input v-model="saleForm.installationFee"
                  v-formatNum:2="saleForm.installationFee"
                  size="small"
                  maxlength="7"
                  placeholder="请选择金额">
          <span slot="suffix">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="初始付款人数："
                    prop="paymentNum">
        <el-input v-model="saleForm.paymentNum"
                  v-formatNum:0="saleForm.paymentNum"
                  size="small"
                  maxlength="5"
                  placeholder="请输入数字"></el-input>
      </el-form-item>
    </el-form>
  </el-btn-dialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Prop, Ref } from "vue-property-decorator";
import { product_sale_api, mall_category_list_api } from "@/api";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";

@Component({
  components: {
    ElBtnDialog
  }
})
export default class StoreSale extends Vue {
  @PropSync("visible", { default: false, type: Boolean }) _visible!: boolean;
  @Prop({ type: [Number, String] }) setSaleId!: number | string;
  @Prop({ type: [Number, String] }) code!: number | string;
  @Prop({ type: String, default: "" }) name!: string;
  @Prop({ type: Boolean, default: false }) isReturnList!: string; // 点击取消按钮是否返回列表页面
  @Prop({ type: String }) active!: string;
  @Ref() readonly ruleForm: element.Refs;

  private submitLoading: boolean = false;
  private saleForm = { installationFee: "", isHot: false, mallCategoryId: "", method: [1, 2], paymentNum: "" };
  private categoryList: any[] = [];
  private rules = {
    mallCategoryId: [
      {
        required: true,
        trigger: "blur",
        message: "请选择商品分类"
      }
    ],
    method: [
      {
        required: true,
        trigger: "blur",
        message: "请选择提货方式"
      }
    ],
    installationFee: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: any, callback: any) => {
          if (value && value < 10000) {
            callback();
          } else {
            callback(new Error("安装费必须小于10,000元"));
          }
        }
      }
    ]
  };

  private async agentSaveAdd(row: any) {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        let { installationFee, isHot, mallCategoryId, method, paymentNum } = this.saleForm;
        let _method = method.length === 2 ? method[0] + method[1] : method[0];
        let params = {
          installationFee: Number(installationFee),
          isHot: Number(isHot),
          mallCategoryId,
          method: _method,
          paymentNum: Number(paymentNum)
        };
        this._saveSetSaleApi(params);
      }
    });
  }
  private async _saveSetSaleApi(params: any) {
    try {
      await product_sale_api(this.active, this.setSaleId, { ...params });
      this.showMsg("上架成功");
      this.$emit("save");
      this._visible = false;
    } catch (error) {
      this.log(error);
    }
  }

  // 获取上架里面的商品分类列表
  private async getGoodCategory() {
    try {
      let { data } = await mall_category_list_api();
      this.categoryList = data;
    } catch (error) {
      this.log(error);
    }
  }
  private checkboxChange(val: any) {
    this.rules.installationFee[0].required = val.includes(1);
  }
  private close() {
    this.isReturnList
      ? this.$router.push({
          path: `/goods/store/storeList`
        })
      : "";
  }

  mounted() {
    this.getGoodCategory();
  }
}
</script>
<style lang='scss' scoped>
.ft-12 {
  font-size: 12px;
  margin-left: 20px;
}
</style>
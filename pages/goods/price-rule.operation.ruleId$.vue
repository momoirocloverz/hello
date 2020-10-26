<template>
  <div class="mih100">
    <breadcrumb-group :breadGroup="[{label:'限价规则',to:'/goods/limitPrice'},{label:'新建限价规则'}]" />

    <el-button v-if="operation==='view' && accessIsOpened('PERM:LIMITED_PRICE:EDIT')"
               type="primary"
               size="small"
               class="go_edit"
               @click="goEdit">编辑</el-button>
    <el-card>
      <el-form @submit.native.prevent
               :model="subForm"
               :rules="subFormRule"
               ref="subFormRef"
               size="small"
               class="sub_form"
               label-width="140px">
        <el-form-item prop="name"
                      label="分组名称">
          <el-input v-model="subForm.name"
                    :disabled="disabled"
                    maxlength="10">
            <template slot="suffix">{{subForm.name.length}}/10</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="discountType"
                      label="限价规则">
          <el-radio-group v-model="subForm.discountType"
                          :disabled="disabled"
                          @change="changeRadio">
            <el-radio v-for="item in DiscountType"
                      :key="item.label"
                      :label="item.label">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="maxDiscount"
                      v-if="subForm.discountType==='0'"
                      label="最高优惠金额">
          <el-input :disabled="disabled"
                    v-model="subForm.maxDiscount"
                    v-formatNum:2="subForm.maxDiscount">
            <template slot="suffix">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="maxDiscount"
                      v-if="subForm.discountType==='1'"
                      label="最高优惠百分比">
          <el-input :disabled="disabled"
                    v-model="subForm.maxDiscount"
                    v-formatNum:2="subForm.maxDiscount">
            <template slot="suffix">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="限价车型"
                      prop="modelCodes">
          <!-- <el-tag v-for="(tag, i) in modelsInPage"
                  :key="i"
                  class="tagags">{{tag.name}}</el-tag> -->
          <el-button :disabled="disabled"
                     @click.stop="openModelDialog">点击选择</el-button>
          &nbsp;&nbsp;已选：<el-button type="text">{{subForm.modelCodes.length}}</el-button>
        </el-form-item>
        <el-form-item label="限价区域"
                      prop="regionCodes">
          <!-- <el-tag v-for="(tag, i) in regionsInPage"
                  :key="i"
                  class="tagags">{{tag.name}}</el-tag> -->
          <el-button :disabled="disabled"
                     @click.stop="openRegionDialog">点击选择</el-button>
          &nbsp;&nbsp;已选：<el-button type="text">{{subForm.regionCodes.length}}</el-button>

        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go(-1)">
            {{disabled?"返回":"取消"}}
          </el-button>
          <el-button @click="saveSubForm"
                     v-show="!disabled"
                     v-if="accessIsOpened('PERM:LIMITED_PRICE:EDIT')"
                     type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <elBtnDialog :visible.sync="modelDialog"
                 title="选择限价车型"
                 :dialogAttr="{width:'35%'}"
                 @save="saveModelTree">
      <div class="tree_box">
        <el-tree ref="modelTreeRef"
                 :props="{label:'name',children:'modelList'}"
                 node-key="code"
                 :default-checked-keys="modelDefaultKeys"
                 :data="modelTreeData"
                 show-checkbox />
      </div>
    </elBtnDialog>

    <elBtnDialog :visible.sync="regionDialog"
                 title="选择限价区域"
                 :dialogAttr="{width:'35%'}"
                 @save="saveReginoTree">
      <div class="tree_box">
        <el-tree ref="regionTreeRef"
                 :props="{label:'name',children:'regionList'}"
                 node-key="code"
                 :default-checked-keys="regionDefaultKeys"
                 :data="regionTreeData"
                 show-checkbox />
      </div>
    </elBtnDialog>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import {
  addPriceRule,
  bu2Region,
  getSeriesWithModel,
  getPriceRuleById,
  modifyPriceRule
} from "@/api";
const BigNumber = require('bignumber.js');
const ruleType = 0; // "COMPANY_RULE"
const RULE = { required: true, trigger: 'change' }
const DiscountMsg: any = {
  "0": '请输入最高优惠金额',
  "1": '请输入最高优惠百分比'
}
const DISCOUNT_PRICE = "0";
interface SubFormRule {
  discountType: element.FormRule[],
  maxDiscount: element.FormRule[],
  name: element.FormRule[],
  regionCodes: element.FormRule[],
  modelCodes: element.FormRule[],
}

@Component({
  components: {
    elBtnDialog
  },
})
export default class PriceRule extends Vue {
  @Ref() readonly subFormRef: element.Refs;
  @Ref() readonly modelTreeRef: any;
  @Ref() readonly regionTreeRef: any;

  readonly DiscountType: element.Options[] = [
    { label: "0", value: "最高优惠金额" }, // DISCOUNT_PRICE
    { label: "1", value: "最高优惠百分比" } // DISCOUNT_PERCENTAGE
  ]
  get operation() {
    return this.$route.params.operation
  }
  get ruleId() {
    return this.$route.params.ruleId
  }
  get disabled() {
    return this.$route.params.operation === 'view'
  }
  subForm: any = {
    discountType: "0",
    maxDiscount: "",
    name: "",
    regionCodes: [],
    modelCodes: []
  };
  get subFormRule(): SubFormRule {
    let t = this.subForm.discountType;
    let max = 100;
    let txt = "最高优惠不超过100%";
    if (t === 0) {
      max = 2000;
      txt = "金额不能超过2000万元";
    }
    const validatePass = (rule: any, value: string, callback: any) => {
      if (Number(value) > max) {
        callback(new Error(txt));
      } else if (!value) {
        callback(new Error(`${DiscountMsg[t]}`));
      } else if (Number(value) <= 0) {
        callback(new Error("最低优惠不可小于0"));
      } else {
        callback();
      }
    };
    return {
      discountType: [{ ...RULE, message: '请选择限价规则' }],
      maxDiscount: [{ ...RULE, validator: validatePass }],
      name: [{ ...RULE, message: '请输入分组名称' }],
      regionCodes: [{ ...RULE, message: '请选择限价区域' }],
      modelCodes: [{ ...RULE, message: '请选择限价车型' }],
    }
  };
  dataFromDB: any = {};
  modelDialog: boolean = false;
  modelTreeData: any = [];
  modelDefaultKeys: string[] = [];
  modelsInPage: any = [];

  regionDialog: boolean = false;
  regionTreeData: any = [];
  regionDefaultKeys: string[] = [];
  regionsInPage: any = [];
  goEdit() {
    const { query, params, name } = this.$route;
    this.$router.replace({
      name,
      query,
      params: {
        ...params,
        operation: 'edit'
      }
    })
  }
  /**
   * @description 修改规则类型重置 maxdiscount
   */
  changeRadio(label: string) {
    const { name, discountType, maxDiscount } = this.dataFromDB
    if (String(discountType) === label) {
      if (label === DISCOUNT_PRICE) {
        this.subForm.maxDiscount = Number(BigNumber(maxDiscount).multipliedBy(10000))
      } else {
        this.subForm.maxDiscount = Number(BigNumber(maxDiscount).multipliedBy(100))
      }
    } else {
      this.subForm.maxDiscount = '';
    }
    this.$nextTick(() => {
      this.subFormRef.clearValidate();
    })
  }
  /**
   * @description 获取所有事业部
   */
  async getDealerAllBu() {
    try {
      const params = {}
      const { data } = await bu2Region(params);
      return Promise.resolve(data || [])
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 获取已上架车系下已上架的车型
   */
  async getSeriesWithModel() {
    try {
      const { data } = await getSeriesWithModel();
      return Promise.resolve(data || [])
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 选择限价车型
   */
  async openModelDialog() {
    try {
      let modelLists = await this.getSeriesWithModel();
      let keys: any = [];
      modelLists.forEach((ele: any) => {
        ele.modelList = ele.modelList || [];
        ele.name = `${ele.name}（${ele.modelList.length}）`
      })
      if (this.subForm.modelCodes.length > 0) {
        keys = [...this.subForm.modelCodes]
      }
      this.modelDefaultKeys = keys;
      this.modelTreeData = modelLists;
      this.modelDialog = true
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 选择限价区域
   */
  async openRegionDialog() {
    try {
      let regionLists = await this.getDealerAllBu();
      let keys: any = [];
      let res: any = [];
      regionLists.forEach((ele: any) => {
        ele.regionList = ele.regionList || [];
        ele.name = `${ele.name}（${ele.regionList.length}）`
      })
      if (this.subForm.regionCodes.length > 0) {
        keys = [...this.subForm.regionCodes]
      }
      this.regionDefaultKeys = keys;
      this.regionTreeData = regionLists;
      this.regionDialog = true
    } catch (e) {
      this.log(e)
    }
  }
  /** 
   * @description 保存限价车型数据
   */
  saveModelTree() {
    const nodes = this.modelTreeRef.getCheckedNodes()
      .filter((e: any) => !e.modelList);
    let res: string[] = [];
    nodes.forEach((ele: any) => {
      res.push(ele.code)
    });
    this.subForm.modelCodes = res;
  }
  /**
   * @description 保存限价地区数据
   */
  saveReginoTree() {
    const nodes = this.regionTreeRef.getCheckedNodes()
      .filter((e: any) => !e.regionList);
    let res: string[] = [];
    nodes.forEach((ele: any) => {
      res.push(ele.code)
    });
    this.subForm.regionCodes = res;
  }
  /**
   * @description 保存最整个form
   * @function addPriceRule
   */
  async saveSubForm() {
    let flag = true;
    this.subFormRef.validate((v: boolean) => flag = v)
    if (!flag) return;
    try {
      let maxDiscount = this.subForm.maxDiscount;
      if (this.subForm.discountType !== DISCOUNT_PRICE) {
        maxDiscount = Number(BigNumber(maxDiscount).dividedBy(100).decimalPlaces(4));
      } else {
        maxDiscount = Number(BigNumber(maxDiscount).multipliedBy(10000));
      }
      const params = {
        ruleType,
        ...this.subForm,
        maxDiscount
      };
      let fn = addPriceRule
      if (this.operation === 'edit') {
        fn = modifyPriceRule
        params.id = this.ruleId
      }
      const { data } = await fn(params)
      if (data) {
        this.showMsg('操作成功');
        this.$router.replace({
          name: "goods-limitPrice"
        })
      }
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 编辑状态下获取信息
   */
  async getPriceRuleById() {
    if (this.operation === "add") return;
    try {
      const ruleId = this.ruleId;
      let { data } = await getPriceRuleById(ruleId);
      this.dataFromDB = data;
      this.subForm = {
        name: data.name,
        discountType: String(data.discountType),
        maxDiscount: String(data.discountType) === DISCOUNT_PRICE
          ? Number(BigNumber(data.maxDiscount).dividedBy(10000))
          : Number(BigNumber(data.maxDiscount).multipliedBy(100)),
        modelCodes: data.models.map((ele: any) => ele.code),
        regionCodes: data.regions.map((ele: any) => ele.regionCode),
      }
      this.modelsInPage = data.models.map((ele: any) => {
        return {
          name: ele.name,
          code: ele.code
        }
      })
      this.regionsInPage = data.regions.map((ele: any) => {
        return {
          name: ele.regionName,
          code: ele.regionCode
        }
      })
    } catch (e) {
      this.log(e)
    }
  };
  created() {
    this.getPriceRuleById()
  }
}
</script>
<style lang="scss" scoped>
.sub_form {
  width: 500px;
}
.mih100 {
  min-height: 100%;
  position: relative;
}
.go_edit {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 100px;
}
.tree_box {
  width: 75%;
  margin: 0 auto;
}
.tagags {
  margin-left: 4px;
  margin-right: 4px;
}
</style>

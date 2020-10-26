<template>
  <div class="main-container">
    <breadcrumb-group
      :breadGroup="[
        { label: '优惠券', to: '/marketing/gift/coupon/index' },
        { label: pageId ? '编辑优惠券' : '新建优惠券', to: '' }
      ]"
    />

    <el-card class="main-panel">
      <el-form @submit.native.prevent ref="form" :model="form" :rules="rule" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="优惠券名称：" prop="name">
              <el-input
                type="input"
                maxlength="8"
                size="small"
                v-model="form.name"
                style="width:80%;margin-right:10px;"
                placeholder="请输入优惠券名称"
              ></el-input>
              <span>{{ form.name.length }}/8</span>
            </el-form-item>
            <el-form-item label="有效期：" prop="timeRange">
              <el-date-picker
                v-model="form.timeRange"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                :default-time="defaultTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="库存：" prop="stock">
              <el-input
                type="text"
                maxlength="6"
                size="small"
                @keyup.native="number"
                v-model.number="form.stock"
                style="width:80%;margin-right:10px;"
                placeholder="请输入优惠券库存数"
              ></el-input>
            </el-form-item>
            <el-form-item label="优惠券类型：" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="item.value" v-for="(item, index) in CONST.COUPON_TYPE" :key="index">{{
                  item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="form.type === 'CASH' ? '面值：' : '折扣：'"
              :prop="form.type === 'CASH' ? 'discountValue' : 'discountRatio'"
            >
              <el-input
                placeholder="0"
                type="text"
                maxlength="8"
                v-model="form.discountValue"
                @keyup.native="money"
                v-if="form.type === 'CASH'"
              >
                <template slot="append"
                  >元</template
                >
              </el-input>
              <el-input
                placeholder="0"
                v-model="form.discountRatio"
                type="text"
                maxlength="4"
                @keyup.native="discount"
                v-if="form.type !== 'CASH'"
              >
                <template slot="append"
                  >折</template
                >
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <div style="margin-top:20px;margin-bottom:20px;" v-if="form.type !== 'CASH'">
                <el-checkbox v-model="checkbox.limit">上限金额</el-checkbox>
                <el-input
                  placeholder="请输入金额"
                  type="text"
                  maxlength="6"
                  v-model="form.discountUpperLimit"
                  @keyup.native="number"
                  style="width:200px;margin-left:10px;"
                  :disabled="!checkbox.limit"
                >
                  <template slot="append"
                    >元</template
                  >
                </el-input>
              </div>
              <div>
                <el-checkbox v-model="checkbox.lowest">门槛金额</el-checkbox>
                <el-input
                  placeholder="请输入金额"
                  type="text"
                  v-model="form.discountBase"
                  maxlength="6"
                  @keyup.native="number"
                  style="width:200px;margin-left:10px;"
                  :disabled="!checkbox.lowest"
                >
                  <template slot="append"
                    >元</template
                  >
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="获取规则：" prop="releaseChannel">
              <el-checkbox-group v-model="form.releaseChannel">
                <el-checkbox :label="item.value" v-for="(item, index) in CONST.COUPON_RULE" :key="index">{{
                  item.label
                }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="适用类型：" prop="goodsType">
              <el-radio-group v-model="form.goodsType" @change="goodsTypeChange">
                <el-radio :label="item.value" :key="item.index" v-for="item in CONST.COUPON_GOODS_TYPE">{{
                  item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="使用范围：" prop="goodsScope">
              <el-radio-group v-model="form.goodsScope">
                <el-radio :label="item.value" :key="item.index" v-for="item in CONST.COUPON_GOODS_SCOPE">{{
                  form.goodsType === "MODEL_GOODS" && item.index === 1 ? "指定车型" : item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="指定商品：" prop="sourceId" v-if="form.goodsScope === 'SPECIFIED'">
              <div style="margin-bottom:10px;">
                <el-tag v-for="(item, index) in selectList" :key="index" style="margin-left:8px;">{{
                  item.name
                }}</el-tag>
              </div>
              <!-- <el-input placeholder=""
                        v-model="form.value"
                        style="width:200px;">
              </el-input> -->
              <el-button type="default" icon="el-icon-plus" style="margin-left:10px;" @click="showDialog()"
                >添加</el-button
              >
            </el-form-item>
            <el-form-item label="使用说明：" prop="description">
              <div class="form-textarea">
                <el-input
                  type="textarea"
                  :rows="5"
                  size="small"
                  v-model="form.description"
                  maxlength="500"
                  placeholder="请输入使用说明"
                ></el-input>
                <span class="form-textarea_count">{{ form.description.length }}/500</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="coupon-review">
        <div class="coupon-header">
          <div class="coupon-title">
            <div class="coupon-title_t">{{form.name || '优惠券名称'}}</div>
            <div class="coupon-title_tag">{{couponType}}</div>
          </div>
        </div>
        <span class="coupon-expires">{{form.description || '有效期:2019-05-22~2019-07-22'}}</span>
        <div class="coupon-price-box">
          <div class="coupon-price">¥50</div>
          <div class="coupon-rule">满10000元可用</div>
        </div>
        <div class="coupon-bottom">
          <span>核销码：S30040XWE98</span>
          <div class="fr">
            <a href="javascript:">使用规则</a>
            <div class="btn-coupon">立即领取</div>
          </div>
        </div>
      </div> -->
      <div class="btn-group">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="submit('form')">提交</el-button>
      </div>
    </el-card>

    <dialog-authorization
      :showDialog="dialogVisible[0]"
      :info="curItem"
      :isModelList="true"
      @selected="selectedChange"
      @close="dialogVisible[0] = false"
    >
    </dialog-authorization>

    <dialog-select-products
      :showDialog="dialogVisible[1]"
      :info="curItem"
      @selected="selectedProductChange"
      @close="dialogVisible[1] = false"
    >
    </dialog-select-products>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import api from "@/api/restful";
import { Component, Vue, Watch } from "vue-property-decorator";
import { COUPON_TYPE, COUPON_RULE, COUPON_GOODS_SCOPE, COUPON_GOODS_TYPE } from "../const/type";
import dialogAuthorization from "../../../goods/components/dialogAuthorization.vue";
import dialogSelectProducts from "./dialogSelectProducts.vue";
import { Model, Goods, Coupon, Type, Rule, GoodsType, GoodsScope } from "../const/couponTypes";

let formChange: boolean = false;
let vm: Vue;

const validateRatio = (rule: any, value: any, callback: any) => {
  if ((<any>vm).form.discountRatio) {
    if ((<any>vm).form.discountRatio > 10) {
      callback(new Error("折扣格式无效"));
    } else {
      callback();
    }
  } else {
    callback(new Error("请输入折扣"));
  }
};

const validateDiscountVal = (rule: any, value: any, callback: any) => {
  if ((<any>vm).form.discountValue) {
    if ((<any>vm).form.discountValue > 10000 || (<any>vm).form.discountValue < 1) {
      return callback(new Error("面值金额需要在1到10000之间"));
    }
    callback();
  } else {
    callback(new Error("请输入大于0的面值金额"));
  }
};

const validateStock = (rule: any, value: any, callback: any) => {
  if ((<any>vm).form.stock) {
    if ((<any>vm).form.stock > 1000000) {
      callback(new Error("库存不能大于1000000"));
    } else {
      callback();
    }
  } else {
    callback(new Error("请输入大于0的库存"));
  }
};

@Component({
  components: {
    dialogAuthorization,
    dialogSelectProducts
  }
})
export default class CouponDetail extends Vue {
  private CONST: any = { COUPON_TYPE, COUPON_RULE, COUPON_GOODS_SCOPE, COUPON_GOODS_TYPE };
  private dialogVisible: any = {
    0: false,
    1: false
  };
  private pageId: number | null = null;
  private curItem: any = {
    code: null,
    list: []
  };
  private selectList: Model[] = [];
  private checkbox: any = {
    limit: 0,
    lowest: 0
  };
  private form: Coupon = {
    type: Type["CASH"],
    name: "",
    validFrom: "",
    validTo: "",
    stock: null,
    discountValue: null,
    discountRatio: null,
    discountBase: null,
    discountUpperLimit: null,
    releaseChannel: [Rule["CAMPAIGN"], Rule["INDIVIDUAL"]],
    description: "",
    modelCodes: [],
    timeRange: [],
    url: "COUPONS",
    goodsType: GoodsType["ORDINARY_GOODS"],
    goodsScope: GoodsScope["UNIVERSAL"],
    goodsIds: []
  };
  get defaultTime() {
    // 延后3分钟生效，否则后端通不过验证
    return [
      dayjs()
        .add(180, "second")
        .format("HH:mm:ss")
    ];
  }
  get rule() {
    let rule: any = {
      name: [{ required: true, message: "请输入优惠券名称", trigger: "blur" }],
      timeRange: [{ required: true, message: "请选择有效期", trigger: "blur" }],
      stock: [{ required: true, validator: validateStock, trigger: "blur" }],
      releaseChannel: [{ required: true, message: "请选择获取规则", trigger: "blur" }],
      description: [{ required: true, message: "请输入使用说明", trigger: "blur" }],
      type: [{ required: true, message: "请选择优惠券类型", trigger: "blur" }],
      goodsType: [{ required: true, message: "请选择适用类型", trigger: "blur" }],
      goodsScope: [{ required: true, message: "请选择使用范围", trigger: "blur" }]
    };
    if (this.form.type === Type["CASH"]) {
      rule.discountValue = [{ validator: validateDiscountVal, trigger: "blur" }];
    } else {
      rule.discountRatio = [{ validator: validateRatio, trigger: "blur" }];
    }
    return rule;
  }
  get couponType() {
    let item = COUPON_TYPE.find((v: any) => v.value === this.form.type);
    if (item) {
      return item.label;
    } else {
      return "-";
    }
  }
  number(e: any) {
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    e.target.value = e.target.value.replace(".", "");
  }
  money(e: any) {
    // e.target.value = e.target.value.replace(/[^\d|.]/g, "");
    e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
  }
  decimals(e: any) {
    e.target.value = e.target.value.replace(/[^\d|.]/g, "");
  }
  discount(e: any) {
    // e.target.value = e.target.value.replace(/[^\d|.]/g, "");
    e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
  }
  showDialog(code: string) {
    if (this.form.goodsType === GoodsType["MODEL_GOODS"]) {
      this.dialogVisible[0] = true;
      this.curItem.list = JSON.parse(JSON.stringify(this.selectList));
    } else {
      this.dialogVisible[1] = true;
    }
  }
  selectedChange({ modelDetailList }: { modelDetailList: Model[] }) {
    this.selectList = JSON.parse(JSON.stringify(modelDetailList));
  }
  selectedProductChange(data: Goods[]) {
    this.selectList = data;
  }
  goodsTypeChange() {
    this.selectList = [];
  }
  submit(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        if (this.checkbox.limit && !Number(this.form.discountUpperLimit)) {
          return this.$message({
            type: "error",
            message: "请输入上限金额"
          });
        }

        if (this.checkbox.lowest && !Number(this.form.discountBase)) {
          return this.$message({
            type: "error",
            message: "请输入门槛金额"
          });
        }

        if (this.form.goodsScope === "SPECIFIED" && this.selectList.length === 0) {
          return this.$message({
            type: "error",
            message: "请选择商品"
          });
        }

        let param: Coupon = Object.assign({}, this.form);
        if (!this.checkbox.limit) {
          delete param.discountUpperLimit;
          delete (<any>param).discountValueUpperLimit;
        }

        if (!this.checkbox.lowest) {
          delete param.discountBase;
          delete (<any>param).discountValueBase;
        }
        param.modelCodes = [];
        param.goodsIds = [];
        param.validFrom = this.form.timeRange[0];
        param.validTo = this.form.timeRange[1];
        if (param.discountRatio) {
          param.discountRatio = param.discountRatio / 10;
        }
        if (param.type === "CASH") {
          delete param.discountRatio;
        }
        delete param.timeRange;
        if (this.form.goodsScope === "SPECIFIED" && this.form.goodsType === "MODEL_GOODS") {
          this.selectList.map((v: Model) => {
            param.modelCodes.push(v.code);
          });
        }
        if (this.form.goodsScope === "SPECIFIED" && this.form.goodsType === "ORDINARY_GOODS") {
          this.selectList.map((v: Model) => {
            param.goodsIds.push(v.id);
          });
        }
        this.request(param);
      } else {
        // let message = params[Object.keys(params)[0]][0].message;
        // this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  request(param: Coupon) {
    let request;
    if (this.pageId) {
      request = api.put({ ...param, prizeId: this.pageId, isAdminApi: true });
    } else {
      request = api.post({ ...param, isAdminApi: true });
    }
    request.then((data: any) => {
      if (data.code === "000000") {
        this.$emit("submit", true);
        this.$message({ type: "success", message: this.pageId ? "修改成功" : "创建成功" });
        this.$router.push("/marketing/gift/coupon/index");
      }
    });
  }
  getDetail(id: number) {
    api.get({ url: "COUPON_BASEINFO", isAdminApi: true, id: id }).then((data: any) => {
      if (data.code === "000000") {
        const d = data.data;
        d.timeRange = [d.validFrom, d.validTo];
        // d.range = d.goodsScope === "UNIVERSAL" ? 0 : 1;
        d.stock = d.stockCount;
        if (!d.releaseChannel) {
          d.releaseChannel = [];
        }
        // 转换releaseChannels到enum类型
        let arr: string[] = [];
        d.releaseChannels.map((v: number) => {
          let s = COUPON_RULE.find((vv: any) => vv.index === v);
          arr.push(s.value);
        });
        d.releaseChannel = arr;

        // 转换type到enum类型
        let ss = COUPON_TYPE.find((vv: any) => vv.index === d.type);
        d.type = ss.value;

        if (d.discountValueUpperLimit) {
          this.checkbox.limit = true;
          d.discountUpperLimit = d.discountValueUpperLimit;
        }
        if (d.discountRatio) {
          d.discountRatio = Math.floor(d.discountRatio * 100) / 10;
        }
        if (d.discountValueBase) {
          this.checkbox.lowest = true;
          d.discountBase = d.discountValueBase;
        }
        if (d.modelNames) {
          d.modelNames.map((v: Model, k: number) => {
            (<any>this.selectList).push({
              name: v,
              code: d.modelCodes[k]
            });
          });
        }
        if (d.goodsNames) {
          d.goodsNames.map((v: Model, k: number) => {
            (<any>this.selectList).push({
              name: v,
              id: d.goodsIds[k]
            });
          });
        }
        this.form = Object.assign(this.form, d);
      }
    });
  }
  created() {
    vm = this;
    if (this.$route.params.id) {
      this.pageId = parseInt(this.$route.params.id);
      this.getDetail(this.pageId);
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-list {
  display: block;
  margin-bottom: 10px;
  .el-input {
    width: 40%;
    margin-right: 8px;
  }
}

.coupon-review {
  position: absolute;
  right: 20px;
  top: 30px;
  width: 40%;
  max-width: 400px;
  background: #f0f7fd;
  font-size: 12px;
  border: 1px solid #fff;
  box-sizing: border-box;

  .coupon-header {
    height: 60px;
    padding: 10px;
    margin-bottom: 15px;
  }

  .coupon-img {
    width: 60px;
    height: 60px;
    float: left;
  }

  .coupon-expires {
    margin-left: 10px;
    margin-bottom: 10px;
    display: inline-block;
  }

  .coupon-title {
    margin-left: 10px;
    .coupon-title_t {
      font-size: 18px;
    }
    .coupon-title_tag {
      border: 1px solid #666;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      padding: 0 5px;
    }
  }

  .coupon-price-box {
    position: absolute;
    right: 10px;
    top: 10px;
    text-align: right;

    .coupon-price {
      font-size: 35px;
      font-weight: 500;
      color: red;
      line-height: 1.2em;
    }
    .coupon-rule {
      color: #666;
    }
  }

  .coupon-bottom {
    border-top: 1px solid #fff;
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;

    a {
      color: #666;
    }

    .btn-coupon {
      padding: 0 10px;
      height: 36px;
      background: gray;
      color: #fff;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      display: inline-block;
    }
  }
}
</style>

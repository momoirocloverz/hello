<template>
  <!-- 库存管理 -->
  <div class="stockManagement">
    <el-btn-dialog :visible.sync="_visible"
                   :dialogAttr="{width:'55%'}"
                   :title="title"
                   :saveAutoClose="false"
                   @save="saveAdd">
      <div class="line">
        <p>
          <span>精品编号</span>{{info.code}}
        </p>
        <p>
          <span>精品名称</span>{{info.name}}
        </p>
        <p>
          <span>精品类目</span>{{info.categoryName}}
        </p>
        <p>
          <span>总库存</span>{{info.totalStock}}
        </p>
      </div>
      <p>规格信息：</p>
      <customizeTable v-if="skuTag_1.length>0"
                      :skuTag_1="skuTag_1"
                      :skuTag_2="skuTag_2"
                      :skuTag_3="skuTag_3"
                      :keyList.sync="keyList"
                      :skuTitleList.sync="skuTitleList"
                      :skuPriceGroup.sync="skuPriceGroup"
                      priceDisabled />
    </el-btn-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import customizeTable from "./customizeTable.vue";
import { DEVIDE_CHAR, numReg } from "../const/wares-vars";
import { product_detail_api, editStock } from "@/api";

@Component({
  components: { ElBtnDialog, customizeTable }
})
export default class StockManagement extends Vue {
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @Prop({
    default: () => {
      return {};
    },
    type: Object
  })
  info: any;
  private title: string = "库存管理";
  private detailInfo: any = {};

  skuTag_1: any = [];
  skuTag_2: any = [];
  skuTag_3: any = [];
  keyList: any[] = [];
  skuTitleList: any[] = [];
  skuPriceGroup: any = {};
  specForSubmit: any = [];
  get isAgent() {
    return this.$route.query.sysPlat === "agent";
  }
  beforeSaveStock() {
    const group = this.skuPriceGroup;
    const sku = [];
    let flag = true;
    // sku: [ { price: stock: surplusStock:  specsValue: [白色，10米]}]
    for (let key in group) {
      if (!numReg.test(group[key].value)) {
        this.showMsg("所有价格须为大于0的数字，最多两位小数", "warning");
        flag = false;
        break;
      }
      if (this.isAgent) {
        if (!/^\d\d*$/.test(group[key].stock) || group[key].stock < 0 || group[key].stock > 1000000) {
          this.showMsg("所有库存须为0~1,000,000之间的整数", "warning");
          flag = false;
          break;
        }
      }
      if (group[key].value < 0 || group[key].value > 100000) {
        this.showMsg("所有金额须为在0~100000之间", "warning");
        flag = false;
        break;
      }
      if (this.keyList.indexOf(key) > -1) {
        let res: any = {
          skuId: group[key].skuId,
          stockId: group[key].stockId,
          stock: Number(group[key].stock)
        };

        sku.push(res);
      }
    }
    this.specForSubmit = sku;
    return flag;
  }
  private async saveAdd() {
    let b = this.beforeSaveStock();
    if (!b) return;
    try {
      const params = this.specForSubmit;
      const { data } = await editStock(this.info.id, params);
      this.showMsg("编辑成功");
      this._visible = false;
      this.$emit("saveSuccess");
    } catch (e) {
      this._visible = false;
      this.log(e);
    }
  }

  private async fetchData() {
    try {
      this.skuTag_1 = [];
      this.skuTag_2 = [];
      this.skuTag_3 = [];
      let { data } = await product_detail_api(this.info.id);
      this.detailInfo = data;
      const { properties, specs } = data;
      specs.forEach((e: any) => {
        const key = e.specsValue[0].value;
        let res: any = {
          value: e.price,
          stock: e.surplusStock, // 库存管理的库存指的是剩余库存
          stockId: e.stockId,
          skuId: e.skuId,
          spuId: e.spuId
        };
        this.$set(this.skuPriceGroup, key, res);
      });
      properties.forEach((e: any, index: number) => {
        e.value.split(DEVIDE_CHAR).forEach((v: any, i: number) => {
          i === 0 && this.skuTitleList.push({ skuLabel: v, key: Math.random() });
          if (i > 0) {
            (<any>this)[`skuTag_${index + 1}`].push({
              label: v,
              disabled: true
            });
          }
        });
      });
    } catch (error) {
      this.log(error);
    }
  }

  created() {
    this.fetchData();
  }
}
</script>
<style lang='scss' scoped>
.stockManagement {
  .line {
    p {
      font-size: 12px;
      line-height: 30px;
      span {
        display: inline-block;
        color: #827f7f;
        width: 100px;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
}
</style>
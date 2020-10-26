<template>
  <div class="storeListDetail">
    <breadcrumb-group :breadGroup="[{label:'商品列表',to:'/goods/store/storeList'},{label:'商品详情'}]" />
    <main>
      <section class="line store-line">
        <!-- 自建商品：删除 编辑 上下架  主机厂：库存管理 上下架 -->
        <el-button @click="setSale"
                   v-if="accessIsOpened('PERM:GOODS_LIST:EDIT')&& saleBtn"
                   size="small">上架</el-button>
        <el-button @click="setOffSale(detailId,_active,channel)"
                   v-if="accessIsOpened('PERM:GOODS_LIST:EDIT')&& offSaleBtn"
                   size="small">下架</el-button>
        <el-button size="small"
                   v-if="accessIsOpened('PERM:GOODS_LIST:EDIT')&& saleBtn && _active === '2'"
                   @click="removeWare">删除</el-button>
        <el-button size="small"
                   @click="goEdit"
                   v-if="accessIsOpened('PERM:GOODS_LIST:EDIT') && _active === '2'">编辑</el-button>
        <el-button size="small"
                   @click="goToStock"
                   v-if="accessIsOpened('PERM:GOODS_LIST:EDIT') && _active === '0'">库存管理</el-button>
      </section>
      <section class="
                   section_2">
        <div class="block">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in detailInfo.mainImg"
                              :key="item">
              <img :src="item"
                   class="inner_img" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="text">
          <p><b>{{detailInfo.name}}</b></p>
          <p>￥{{priceInfo.minPrice || '-'}} - {{priceInfo.maxPrice || '-'}}</p>
          <p class="sales-text">
            <span v-if="channel === '2'">总库存：{{priceInfo.totalStock || '-'}}</span>
            <span>总销量：{{priceInfo.sales || '-'}}</span>
          </p>
        </div>
      </section>
      <section class="mb20">
        <div class="line store-line">
          <b>商品类目：</b>
          <span class="smtext">{{detailInfo.categoryName}}</span>
        </div>
        <div class="line store-line">
          <b>基本信息</b>
        </div>
        <el-form label-width="200px"
                 size="small"
                 class="pd20">
          <el-form-item label="品牌：">
            {{detailInfo.brand}}
          </el-form-item>
          <el-form-item label="最小订购量：">
            {{detailInfo.minOrder}}
          </el-form-item>
          <el-form-item label="最小包装：">
            {{detailInfo.minPack}}
          </el-form-item>
          <el-form-item label="商品类型：">
            {{detailInfo.type===1?'车辆精品':'普通商品'}}
          </el-form-item>
          <el-form-item label="适用车系："
                        v-if="detailInfo.type===1">
            {{detailInfo.vehicleNames.join('、')}}
          </el-form-item>
        </el-form>
        <div class="line">
          <b>规格信息</b>
        </div>
        <div class="tabeldsf">
          <customizeTable :skuTag_1="skuTag_1"
                          :skuTag_2="skuTag_2"
                          :skuTag_3="skuTag_3"
                          :skuTitleList.sync="skuTitleList"
                          :skuPriceGroup.sync="skuPriceGroup"
                          disabled />
        </div>
        <div v-if="detailInfo.desc"
             class="sectipe">
          <div class="line"><b>图文描述</b></div>
          <div v-html="detailInfo.desc"
               class="desc_t ql-editor" />
        </div>
      </section>
    </main>
    <storeSale :visible.sync="saleFormVisible"
               :setSaleId="detailId"
               :code="saleCode"
               :active="channel"
               :name="setSaleName"
               v-if="saleFormVisible"
               @save="getDetailInfo"></storeSale>
    <stock-management v-if="stockVisible"
                      :info="stockInfo"
                      :visible.sync="stockVisible"></stock-management>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import customizeTable from "./components/customizeTable.vue";
import StoreSale from "./components/storeSale.vue";
import { DEVIDE_CHAR } from "./const/wares-vars";
import { mixins } from "vue-class-component";
import StoreOffSaleMixin from "./mixins/storeOffSale.mixin";
import StockManagement from "./components/stockManagement.vue";
import { product_detail_api, warePriceInfo, product_list_delete_api } from "@/api";

@Component({
  components: { customizeTable, StoreSale, StockManagement }
})
export default class StoreListDetail extends mixins(StoreOffSaleMixin) {
  private detailInfo: any = {};
  private saleFormVisible: boolean = false;
  private stockVisible: boolean = false;
  private stockInfo: any = {};
  private priceInfo: any = {};
  private saleCode: number | string;
  private setSaleName: string = "";

  skuTag_1: any = [];
  skuTag_2: any = [];
  skuTag_3: any = [];
  skuTitleList: any[] = [];
  skuPriceGroup: any = {};

  get offSaleBtn() {
    let btnShow: boolean;
    btnShow =
      this._active === "2" ? this.detailInfo.status : this.detailInfo.spuSale && this.detailInfo.spuSale.saleStatus;
    return btnShow;
  }
  get saleBtn() {
    let btnShow: boolean;
    btnShow =
      this._active === "2"
        ? !this.detailInfo.status
        : !this.detailInfo.spuSale || (this.detailInfo.spuSale && !this.detailInfo.spuSale.saleStatus);
    return btnShow;
  }

  private get _active() {
    return this.$route.params.type;
  }
  private get detailId(): string {
    return this.$route.params.id;
  }
  get isAgent() {
    return this.$route.query.sysPlat === "agent";
  }

  @Watch("offSaleStatus")
  onOffSaleStatusChange() {
    this.getDetailInfo();
  }
  goEdit() {
    this.$router.push({
      name: "goods-store-wares",
      params: {
        operateType: "edit",
        type: this._active,
        id: this.detailId
      }
    });
  }

  //
  goToStock() {
    this.stockInfo = this.detailInfo;
    this.stockVisible = true;
  }

  // 上架
  private setSale() {
    this.channel === "2" ? this.agentSetSale() : this.factorySetSale(this.detailInfo);
  }
  private agentSetSale() {
    this.saleFormVisible = true;
    this.saleCode = this.detailInfo.code;
    this.setSaleName = this.detailInfo.name;
  }
  /**
   * @description 关键函数->返回的数据进行格式化
   */
  async getDetailInfo() {
    try {
      this.skuTag_1 = [];
      this.skuTag_2 = [];
      this.skuTag_3 = [];
      let { data } = await product_detail_api(this.detailId);
      this.detailInfo = data;
      const { properties, specs } = data;
      specs.forEach((e: any) => {
        const key = e.specsValue[0].value;
        let res: any = {
          value: e.price,
          stock: e.surplusStock,
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
  async warePriceInfo() {
    try {
      let { data } = await warePriceInfo(this.detailId);
      this.priceInfo = data;
    } catch (error) {
      this.log(error);
    }
  }
  // 删除
  removeWare(id: number | string) {
    this.$confirm("确定删除吗", "提示")
      .then(async () => {
        try {
          await product_list_delete_api(this.detailId);
          this.showMsg("删除成功");
          this.$router.replace({
            name: "goods-store-storeList"
          });
        } catch (error) {
          this.log(error);
        }
      })
      .catch(() => {});
  }

  created() {
    this.getDetailInfo();
    this.warePriceInfo();
  }
}
</script>
<style lang='scss' scoped>
.line {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}
.store-line {
  border-top: none;
}
.section_2 {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .block {
    width: 250px;
    margin-right: 20px;
  }
  .text {
    display: flex;
    margin-left: 20px;
    flex-direction: column;
    justify-content: space-between;
    p:nth-of-type(1) {
      font-size: 15px;
    }
    p:nth-of-type(2) {
      font-size: 18px;
      color: #ff9900;
    }
    p:nth-of-type(3) {
      font-size: 12px;
      color: #827f7f;
    }
  }
}
section {
  background: #fff;
}
.inner_img {
  max-width: 100%;
  max-height: 100%;
}
.detail-tag {
  padding-left: 20px;
}
.mb20 {
  margin-bottom: 20px;
  margin-top: 15px;
  padding-bottom: 15px;
}
.pd20 {
  padding-top: 20px;
}
.tabeldsf {
  padding: 20px;
}
.desc_t {
  margin: 20px;
  padding-bottom: 20px;
}
.smtext {
  font-size: 13px;
}
.sales-text {
  display: flex;
  flex-direction: column;
}
/deep/ {
  .breadcrumb {
    margin: 0 -20px 15px;
  }
}
</style>
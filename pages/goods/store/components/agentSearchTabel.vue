<template>
  <!-- 经销商商品列表 -->
  <div>
    <el-admin-table ref="adminTableRef"
                    :tableAttrs="tableAttrs"
                    :apiFn="apiFn"
                    :formData.sync="searchData"
                    :totalCount.sync="totalCount"
                    @getListDone="countSpu"
                    hasSearchBtn>
      <div slot="search">
        <el-form-item prop="number">
          <el-input v-model="searchData.code"
                    size="small"
                    placeholder="商品编号"
                    clearable />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="searchData.name"
                    size="small"
                    placeholder="商品名称"
                    clearable />
        </el-form-item>
        <el-form-item prop="class">
          <search-category :category.sync="searchData.category"></search-category>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="searchData.status"
                     placeholder="商品状态">
            <el-option v-for="(item, index) in storeStatus"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dataTime">
          <span>创建时间 </span>
          <el-date-picker v-model="searchData.startDate"
                          value-format="yyyy-MM-dd"
                          placeholder="开始日期">
          </el-date-picker>
          至
          <el-date-picker v-model="searchData.endDate"
                          value-format="yyyy-MM-dd"
                          placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </div>
      <div slot="line"
           class="line-box">
        <div class="line">
          <span v-if="active === '2'"
                class="span">自建</span>
          <span v-if="active === '0'"
                class="span">主机厂</span>
          <span class="span">商品</span>
          <template v-if="!outOfTimeInSearch">
            <span>（&nbsp;已上架：{{upperNumber}} &nbsp;&nbsp;
              <template v-if="!InTimeInSearch">
                已下架： {{totalCount > upperNumber?totalCount - upperNumber:0}}
              </template>&nbsp;）
            </span>
          </template>
          <template v-else>
            (&nbsp;已下架：{{totalCount}}&nbsp;)
          </template>
        </div>
        <div>
          <el-button @click="goToAdd"
                     size="small"
                     type="primary"
                     v-if="accessIsOpened('PERM:GOODS_LIST:EDIT') &&active === '2'">发布新商品</el-button>
        </div>
      </div>
    </el-admin-table>

    <stock-management v-if="stockVisible"
                      :info="stockInfo"
                      :visible.sync="stockVisible"
                      @saveSuccess="onActiveChange">
    </stock-management>
    <storeSale :visible.sync="saleFormVisible"
               :setSaleId="setSaleId"
               :active="active"
               :name="setSaleName"
               @save="goSearch"
               :code="setSaleCode"
               v-if="saleFormVisible"></storeSale>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import StoreOffSaleMixin from "./../mixins/storeOffSale.mixin";
import { formatDate } from "@/utils";
import StockManagement from "./stockManagement.vue";
import StoreSale from "./storeSale.vue";
import SearchCategory from "./searchCategory.vue";
import {
  product_spus_list_api,
  product_offSale_api,
  product_sale_api,
  mall_category_list_api,
  countManufactorSpu,
  countSpu
} from "@/api";
import deepClone from "../../../../utils/deepClone";

@Component({
  components: {
    StockManagement,
    StoreSale,
    SearchCategory
  }
})
export default class AgentSearchTabel extends mixins(StoreOffSaleMixin) {
  @Prop({ type: Function }) apiFn: any;

  private saleFormVisible: boolean = false;
  private setSaleId: number | string = "";
  private setSaleCode: number | string = "";
  private setSaleName: string = "";

  private stockVisible: boolean = false;
  private searchData = { code: "", name: "", status: "", category: "", startDate: "", endDate: "" };
  private upperNumber: number = 0;
  private totalCount: number = 0;
  private searchDataMirror: any = {};
  get outOfTimeInSearch() {
    let b = this.searchDataMirror.status === this.searchData.status;
    return b && String(this.searchData.status) === "false";
  }
  get InTimeInSearch() {
    let b = this.searchDataMirror.status === this.searchData.status;
    return b && String(this.searchData.status) === "true";
  }

  private stockInfo: any = {};
  private storeCategory = [
    { label: "一级类目", value: 1 },
    { label: "二级类目", value: 2 },
    { label: "三级类目", value: 3 }
  ];
  private storeStatus = [{ label: "已上架", value: true }, { label: "已下架", value: false }];
  private tableAttrs = {
    columns: [
      {
        prop: "code",
        label: "商品编号"
      },
      {
        prop: "name",
        label: "商品名称",
        render: (h: any, row: any) =>
          h("div", [
            h(
              "span",
              {
                class: (row => {
                  return this.active === "0" && !row.status ? "yellow" : "";
                })(row)
              },
              this.active === "2" ? row.name : this.filterName(row)
            )
          ])
      },
      {
        prop: "categoryName",
        label: "商品类目"
      },
      {
        prop: "totalStock",
        label: "总库存"
      },
      {
        prop: "totalSale",
        label: "总销量"
      },
      {
        prop: "status",
        label: "商品状态",
        render: (h: any, row: any) =>
          h("div", [
            h("span", {
              class: (row => {
                return this.active === "2"
                  ? this.filterStatusClass(row.status)
                  : this.filterStatusClass(row.saleStatus);
              })(row)
            }),
            h("span", this.active === "2" ? this.filterStatus(row.status) : this.filterStatus(row.saleStatus))
          ])
      },
      {
        prop: "createdTime",
        label: "创建时间",
        formatter: (row: any) => formatDate(row.createdTime)
      },
      {
        type: "operation",
        col: {
          width: this.active === "2" ? "230px" : "150px"
        },
        btns: [
          {
            text: "详情",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:VIEW"),
            atClick: (row: any) => this.goToDetail(row)
          },
          {
            text: "编辑",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:EDIT") && this.active === "2",
            atClick: (row: any) => this.goToEdit(row)
          },
          {
            text: "库存管理",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:EDIT"),
            atClick: (row: any) => this.goToStock(row)
          },
          {
            text: "下架",
            show: (row: any) =>
              this.accessIsOpened("PERM:GOODS_LIST:EDIT") && (this.active === "2" ? row.status : row.saleStatus),
            atClick: (row: any) => this.setOffSale(row.id, this.active, "2")
          },
          {
            text: "上架",
            show: (row: any) =>
              this.accessIsOpened("PERM:GOODS_LIST:EDIT") && (this.active === "2" ? !row.status : !row.saleStatus),
            atClick: (row: any) => this.setSale(row)
          },
          {
            text: "删除",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:EDIT") && !row.status && this.active === "2",
            atClick: (row: any) => this.goToDelete(row.id)
          }
        ]
      }
    ]
  };

  private onActiveChange() {
    this.goSearch();
  }

  /**
   * @description 操作按钮
   */
  private goToDetail(row: any) {
    this.$router.push({
      path: `/goods/store/storeListDetail/${row.id}/${this.active}`
    });
  }
  private async goToStock(row: any) {
    this.stockInfo = row;
    this.stockVisible = true;
  }
  private goToEdit(row?: any) {
    this.$router.push({
      name: "goods-store-wares",
      params: {
        operateType: "edit",
        type: this.active,
        id: row.id
      }
    });
  }
  private goToAdd(row?: any) {
    this.$router.push({
      path: `/goods/store/wares/add/${this.active}`
    });
  }
  private goToDelete(id: number | string) {
    this.deleteconfirm(() => {
      this._deleteApi(id);
    });
  }

  private async countSpu() {
    try {
      this.upperNumber = 0;
      let fn = countSpu;
      if (this.active === "0") {
        fn = countManufactorSpu;
      }
      const { data } = await fn(this.searchData);
      this.upperNumber = data;
      this.searchDataMirror = deepClone(this.searchData);
    } catch (e) {
      this.log(e);
    }
  }

  // 上架
  private setSale(row: any) {
    this.setSaleId = row.id;
    this.setSaleCode = row.code;
    this.setSaleName = row.name;
    this.saleFormVisible = true;
  }

  private filterStatusClass(status: boolean) {
    // 状态： saleStatus 主机厂  Status 经销
    return status ? "dot dot1" : "dot dot5";
  }
  private filterStatus(status: boolean) {
    return status ? "已上架" : "已下架";
  }
  private filterName(row: any) {
    return row.status ? row.name : `${row.name}（主机厂已下架）`;
  }
}
</script>
<style lang='scss' scoped>
.line-box {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .line {
    .span {
      font-weight: bold;
    }
  }
}
.title {
  margin-bottom: 20px;
  display: inline-block;
}
/deep/ {
  .yellow {
    color: #f90;
  }
}
</style>
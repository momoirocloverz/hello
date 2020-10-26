<template>
  <!-- 主机厂商品列表 -->
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
        <el-form-item prop="category">
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
        <div class="line">商品
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
                     v-if="accessIsOpened('PERM:GOODS_LIST:EDIT')"
                     type="primary">发布新商品</el-button>
        </div>
      </div>
    </el-admin-table>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import { formatDate } from "@/utils";
import { product_spus_list_api, product_offSale_api, product_sale_api, countSpu } from "@/api";
import { mixins } from "vue-class-component";
import StoreOffSaleMixin from "./../mixins/storeOffSale.mixin";
import SearchCategory from "./searchCategory.vue";
import deepClone from '../../../../utils/deepClone';
@Component({
  components: {
    SearchCategory
  }
})
export default class FactoryStoreListTable extends mixins(StoreOffSaleMixin) {
  @Ref() readonly adminTableRef: any;
  private totalCount: number = 0;
  private apiFn: any = product_spus_list_api;
  private storeStatus = [{ label: "已上架", value: true }, { label: "已下架", value: false }];
  private storeCategory = [
    { label: "一级类目", value: 1 },
    { label: "二级类目", value: 2 },
    { label: "三级类目", value: 3 }
  ];
  private searchData = { code: "", name: "", status: "", category: "", startDate: "", endDate: "" };
  private upperNumber: number = 0;
  private searchDataMirror: any = {};
  get outOfTimeInSearch() {
    let b = this.searchDataMirror.status === this.searchData.status;
    return b && String(this.searchData.status) === 'false';
  }
  get isFactory() {
    return this.$route.query.sysPlat === 'factory';
  }
  get InTimeInSearch() {
    let b = this.searchDataMirror.status === this.searchData.status;
    return b && String(this.searchData.status) === 'true';
  }
  get tableAttrs() {
    return {
      columns: [
        {
          prop: "code",
          label: "商品编号"
        },
        {
          prop: "name",
          label: "商品名称"
        },
        {
          prop: "categoryName",
          label: "商品类目"
        },
        {
          prop: "status",
          label: "商品状态",
          render: (h: any, row: any) =>
            h("div", [
              h("span", {
                class: (row => {
                  return row.status ? "dot dot1" : "dot dot5";
                })(row)
              }),
              h("span", row.status ? "已上架" : "已下架")
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
            width: "170px"
          },
          btns: [
            {
              text: "详情",
              show: (row: any) => this.accessIsOpened('PERM:GOODS_LIST:VIEW'),
              atClick: (row: any) => this.goToDetail(row)
            },
            {
              text: "编辑",
              show: (row: any) => this.isFactory && this.accessIsOpened("PERM:GOODS_LIST:EDIT"),
              atClick: (row: any) => this.goToEdit(row)
            },
            {
              text: "下架",
              show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:EDIT") && row.status,
              atClick: (row: any) => this.setOffSale(row.id, "0", "0")
            },
            {
              text: "上架",
              show: (row: any) => this.accessIsOpened("PERM:GOODS_LIST:EDIT") && !row.status,
              atClick: (row: any) => this.factorySetSale(row)
            },
            {
              text: "删除",
              show: (row: any) => this.isFactory && this.accessIsOpened("PERM:GOODS_LIST:EDIT") && !row.status,
              atClick: (row: any) => this.goToDelete(row.id)
            }
          ]
        }
      ]
    }
  };

  /**
   * @description 操作按钮
   */
  private goToDetail(row: any) {
    this.$router.push({
      path: `/goods/store/storeListDetail/${row.id}/2`
    });
  }
  private goToEdit(row?: any) {
    this.$router.push({
      name: "goods-store-wares",
      params: {
        operateType: "edit",
        type: "0",
        id: row.id
      }
    });
  }
  private goToAdd(row?: any) {
    this.$router.push({
      name: "goods-store-wares",
      params: {
        operateType: "add",
        type: "0"
      }
    });
  }
  private goToDelete(id: number | string) {
    this.deleteconfirm(() => {
      this._deleteApi(id);
    });
  }
  private async countSpu() {
    this.upperNumber = 0;
    try {
      const { data } = await countSpu(this.searchData);
      this.searchDataMirror = deepClone(this.searchData);
      this.upperNumber = data;
    } catch (e) {
      this.log(e);
    }
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
    span {
      font-size: 12px;
    }
  }
}
</style>

<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择商品"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <search-table ref="searchTableRef"
                      :url="urls.PRODUCTS_LIST"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
                      :isCommonURL="false"
                      :proxyQuery="proxyQuery"
                      :defaultSelected="info.selectList"
                      @reset="reset"
                      @selectionChange="selectionChange">
        </search-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span style="float:left;margin-top:10px;">已选：{{selectList.length}}/100</span>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import api from "@/api/restful";
import urls from "@/api/urls";
import dayjs from "dayjs";
import SearchCategory from "@/pages/goods/store/components/searchCategory.vue";

interface Item {
  id: number;
  mobile: string;
  name: string;
  position: string;
}

@Component({
  components: {
    SearchTable,
    SearchCategory
  }
})
export default class dialogReview extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  private options: any[] = [];
  private tableData: Item[] = [];
  private urls: any = urls;
  private selectList: Item[] = [];
  private category: any = "";
  private categoryRef: any = "";
  private searchConfig: object = {
    props: [
      {
        tag: "input",
        prop: "code",
        placeholder: "商品编号"
      },
      {
        tag: "input",
        prop: "name",
        placeholder: "商品名称"
      },
      {
        placeholder: "商品类目",
        prop: "category",
        render: (h: any, ctx: any) => {
          let vm = this;
          return h(SearchCategory, {
            props: {
              category: vm.category
            },
            on: {
              update: vm.updateCat
            }
          });
        }
      }
    ]
  };
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "商品编号",
      key: "code",
      width: 150
    },
    {
      title: "商品名称",
      key: "name",
      width: 150
    },
    {
      title: "商品类目",
      key: "categoryName"
    },
    {
      title: "总库存",
      key: "totalStock",
      render: (h: any, ctx: any) => {
        return h("span", {}, ctx.totalStock + "");
      }
    },
    {
      title: "总销量",
      key: "totalSale",
      render: (h: any, ctx: any) => {
        return h("span", {}, ctx.totalSale + "");
      }
    },
    {
      title: "商品状态",
      key: "saleStatus",
      render: (h: any, ctx: any) => {
        return h("span", {}, ctx.saleStatus ? "已上架" : "已下架");
      }
    },
    {
      title: "创建时间",
      key: "createdTime",
      render: (h: any, ctx: any) => {
        return h("span", {}, dayjs(ctx.createdTime).format("YYYY-MM-DD HH:mm:ss"));
      }
    }
  ];
  closeDialog() {
    this.searchTableRef.resetDefaultSelect();
    this.$emit("close", true);
  }
  /**
   * 关闭弹窗并通知刷新
   */
  closeAndRefresh() {
    if (this.selectList.length > 100) {
      return this.$message({ type: "error", message: "最多选择100个" });
    }
    this.$emit("selected", JSON.parse(JSON.stringify(this.selectList)));
    this.$emit("close", true);
  }
  proxyQuery(filters: any) {
    filters.category = this.category;
    return filters;
  }
  updateCat(val: number) {
    this.category = val;
  }
  reset() {
    console.log('reset');
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) { }
}
</script>

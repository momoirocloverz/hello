<template>
  <div class="query-table-wrap">
    <div class="search-head" v-if="searchConfig">
      <slot name="header">
        <div class="filter-content">
          <slot name="search">
            <common-form :props="props" :form="filterForm" formLabelWidth="80px" :inline="true">
              <el-form-item slot="item">
                <el-button size="small" @click="handleQuery" type="primary">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </el-form-item>
            </common-form>
          </slot>
          <slot name="deal">
            <div class="add-btn" v-if="searchConfig.optBtns">
              <el-button
                size="small"
                @click="item.handler"
                type="primary"
                :key="index"
                v-for="(item, index) in searchConfig.optBtns"
                >{{ item.label }}</el-button
              >
            </div>
            <div class="add-btn" v-if="searchConfig.addBtn">
              <el-button size="small" @click="addBtn.handler" type="primary">{{ addBtn.label }}</el-button>
            </div>
          </slot>
        </div>
      </slot>
    </div>
    <slot name="table-top"></slot>
    <common-table
      ref="CommonTableRef"
      :loading="tableObj.loading"
      :layout="layout"
      :tableColumns="tableColumns"
      :total="tableObj.total"
      :data="listData"
      :showPage="showPage"
      :spanMethod="spanMethod"
      @singleSelectChange="singleSelectChange"
      :filter="filter"
      @sizeChange="sizeChange"
      @selectionChange="selectionChange"
      @currentChange="currentChange"
    >
      <template v-slot:[item.slotName]="{ row }" v-for="(item, index) in tableColumns">
        <slot :name="item.slotName" v-if="item.slot" :row="row" :index="index"></slot>
      </template>
    </common-table>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import CommonTable from "../common-table/index.vue";
import CommonForm from "../common-form/index.vue";
import { Component, Vue, Prop, Watch, Ref } from "vue-property-decorator";
import service from "@/api/axios";

const prefix = process.env.VUE_APP_API_VERSION;
const commonPrefix = process.env.VUE_APP_API_PREFIX;

@Component({
  name: "queryTable",
  components: { CommonTable, CommonForm }
})
export default class extends Vue {
  @Ref() readonly CommonTableRef!: any;
  @Prop({ default: () => {} }) private searchConfig!: any;
  @Prop({ default: () => {} }) private searchParams!: any; // 筛选条件
  @Prop({ default: () => {} }) private initFilter?: any;
  @Prop({ required: false }) private data!: Array<any>;
  @Prop({ default: false }) private loading!: Boolean;
  @Prop({ required: true }) private tableColumns!: Array<[]>;
  @Prop({ default: undefined }) private spanMethod?: Function;
  @Prop({ default: undefined }) private proxyQuery?: Function; // 对筛选条件个性化处理
  @Prop({ default: false }) private isDefaultQuery?: Boolean; // 是否默认增加筛选条件，只有在proxyQuery存在时有效
  @Prop({ default: undefined }) private proxyData?: Function; // 对返回数据个性化处理
  @Prop({ default: false }) private isCommonURL?: Boolean; // 代理地址是否是/api/v1, false-admin/api/v1, true-api/v1
  @Prop({ default: true }) private showPage!: boolean;
  @Prop({ default: "" }) private url!: string;
  @Prop({ default: false }) private isDelayRequest?: boolean; // 是否延迟获取数据，true-通过isRefresh通知获取
  @Prop({ default: false }) private isRefresh?: boolean; // 是否刷新列表,值改变即刷新
  @Prop({ default: () => [] }) private defaultSelected?: any[]; // 选中列表，id做匹配
  @Prop({ default: "id" }) private selectItemKey?: string; // 如果默认选中列表为number类型，默认选中列表的key值

  @Prop({ default: "prev, pager, next, sizes, jumper,total" })
  private layout!: string;
  listData: Array<any> = this.data || [];
  private filter = {
    size: 10,
    page: 1
  };
  private tableObj = {
    list: [],
    loading: false,
    total: 0
  };

  private filterForm = {};
  private selectedList: any[] = [];
  get props() {
    return this.searchConfig.props || [];
  }
  get addBtn() {
    return this.searchConfig.addBtn || {};
  }
  sizeChange(val: number): void {
    this.filter.size = val;
    this.getList();
  }
  currentChange(val: number): void {
    this.filter.page = val;
    this.getList();
  }
  singleSelectChange(val: any) {
    this.$emit("singleSelectChange", val);
  }
  /**
   * 监听选中行变化，记录历史
   **/
  selectionChange(val: any) {
    let notSelectedList: any[] = [];
    this.listData.map((v: any) => {
      let item = val.find((vv: any) => vv.id === v.id);
      if (!item) {
        notSelectedList.push(v);
      }
    });
    // 去除未选中行
    notSelectedList.map((v: any) => {
      let index = this.selectedList.findIndex((s: any) => s.id === v.id);
      if (index !== -1) {
        this.selectedList.splice(index, 1);
      }
    });
    // 增加新行
    val.map((v: any) => {
      let index = this.selectedList.findIndex((s: any) => s.id === v.id);
      if (index === -1) {
        this.selectedList.push(v);
      }
    });
    this.$emit("selectionChange", this.selectedList);
  }
  clearSelections() {
    this.CommonTableRef.clearSelection();
  }
  private async getList(filters?: any) {
    this.tableObj.loading = true;
    let params = {
      ...this.filter,
      ...this.filterForm,
      ...this.searchParams
    };
    // 父级通过proxyQuery对filters进行处理
    if (filters) {
      params = Object.assign({}, params, filters);
    }
    // 如果默认增加筛选条件
    if (this.isDefaultQuery && this.proxyQuery) {
      let defaultFilter = this.proxyQuery(filters || {});
      params = Object.assign({}, params, defaultFilter);
    }
    try {
      const prefixUrl = this.isCommonURL ? commonPrefix : prefix;
      let res = await service.get(prefixUrl + this.url, {
        params
      });
      // 父级通过proxyData对data进行处理
      if (this.proxyData) {
        // 处理常规表格数据结构
        if (Array.isArray(res.data)) {
          this.listData = this.proxyData(res.data);
          this.tableObj.total = res.totalCount;
        } else {
          let data = this.proxyData(res);
          if (!data) {
            return console.log("proxyData not return data");
          }
          this.listData = data.data;
          this.tableObj.total = data.totalCount;
        }
      } else {
        this.listData = Array.isArray(res.data) ? res.data : [];
        this.tableObj.total = res.totalCount;
      }
      this.$emit("getTblData", res);
      // 设置默认选中
      this.defaultSelect();
      this.tableObj.loading = false;
    } catch (e) {
      console.log(e);
      this.tableObj.loading = false;
    }
  }
  /**
   * 设置表格行默认选中
   **/
  defaultSelect() {
    this.selectedList.map((v: any) => {
      this.listData.map((vv: any) => {
        if (v.id === vv.id) {
          this.CommonTableRef.toggleRowSelection(vv, true);
        }
      });
    });
  }
  /**
   * 重置为默认选中状态
   **/
  resetDefaultSelect() {
    this.CommonTableRef.clearSelection();
    this.selectedList = [];
    this.handleDefaultSelectedList();
    this.defaultSelect();
  }
  handleQuery() {
    this.filter.page = 1;
    let filters: any = Object.assign({}, this.filterForm);
    if (this.proxyQuery) {
      this.proxyQuery(filters);
    }
    this.getList(filters);
  }
  /**
   * 重置表格和过滤条件
   **/
  handleReset() {
    this.filter = {
      page: 1,
      size: 10
    };
    this.filterForm = Object.assign({}, this.initFilter);
    this.$emit("reset");
    this.getList();
  }
  /**
   * 处理默认选中数据兼容
   * defaultSelected number[] | object[]
   **/
  handleDefaultSelectedList() {
    let arr: any = [];
    if (this.defaultSelected && typeof this.defaultSelected[0] !== "object") {
      this.defaultSelected.map((v: number) => {
        let item = this.listData.find((vv: any) => vv[this.selectItemKey as keyof typeof vv] === v);
        if (item) {
          arr.push(item);
        }
      });
    } else {
      (this.defaultSelected || []).map((v: any) => {
        if (v) {
          arr.push(v);
        }
      });
      // arr = this.defaultSelected;
    }
    this.selectedList = this.selectedList.concat(arr);
  }
  setFilterForm(filter: any) {
    this.filterForm = Object.assign({}, this.filterForm, filter);
  }
  mounted() {
    this.filterForm = Object.assign({}, this.initFilter);
    if (this.url && !this.isDelayRequest) {
      this.handleDefaultSelectedList();
      this.getList();
    }
  }
  @Watch("isRefresh")
  onIsRefresh(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.getList();
    }
  }
  @Watch("initFilter")
  onInitFilter() {
    this.filterForm = Object.assign({}, this.initFilter);
  }
}
</script>

<style scoped lang="scss">
.filter-content {
  display: flex;
  justify-content: space-between;
}
.add-btn {
  margin-bottom: 20px;
}
</style>

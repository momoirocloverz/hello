<template>
  <div>
    <!--dialog-->
    <el-dialog title="从素材库中选择图文"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <el-tabs v-model="currentTab">
          <el-tab-pane :label="item.label"
                       :name="item.value"
                       :key="index"
                       v-for="(item, index) in tabs"></el-tab-pane>
        </el-tabs>
        <el-row :gutter="10">
          <el-col :span="4">
            <div class="tree-cat_panel">
              <div class="tree-cat_content">
                <ul v-loading="loading">
                  <li v-for="(item, index) in categories"
                      :key="index"
                      :class="{'active': item.id === curCategory}
                    "
                      @click="setGroup(item)">
                    <span>{{item.name}}({{item.materialNum}})</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <search-table ref="searchTableRef"
                          :url="urls.MATERIAL_ARTICLES"
                          :tableColumns="tableColumns"
                          :searchConfig="searchConfig"
                          :isDelayRequest="true"
                          :isDefaultQuery="true"
                          :proxyData="proxyData"
                          :proxyQuery="proxyQuery"
                          :spanMethod="spanMethod"
                          @singleSelectChange="currentChange">
              <template v-slot:radio="{row}">
                <el-radio v-model="radioValue"
                          :label="row.id +'_' + row.realDataIndex"
                          @change="radioChange">&nbsp;</el-radio>
              </template>
              <template v-slot:column0="{row}">
                <article-list :item="row"
                              :showCount="false"></article-list>
              </template>
            </search-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"
           class="dialog-footer">
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
import articleList from "../../source/components/articleList.vue";
import { Config, Item, ArticleItem, expendItem } from "../../const/config";
import api from "@/api/restful";
import urls from "@/api/urls";

let tableData: Item[] = [];
let selectedRadio: string | null = null;

@Component({
  components: {
    SearchTable,
    articleList
  }
})
export default class dialogReview extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  private urls: any = urls;
  private tabs: any[] = [{ value: "2", label: "自建" }, { value: "1", label: "集团" }, { value: "0", label: "主机厂" }];
  private currentTab: string = "2";
  private selected: Item | {} = {};
  private radioValue: string | null = null;
  private conf = new Config().get(this);
  private spanMethod: Function = this.conf.spanMethod([0, 1]);
  private searchConfig: object = {};
  private loading: boolean = false;
  private curCategory: number | null = null;
  private categories: any[] = [];
  get tableColumns() {
    this.conf.tableColumns.pop();
    this.conf.tableColumns.unshift({
      title: "",
      key: "index",
      slot: true,
      width: 120,
      slotName: "radio"
    });
    return this.conf.tableColumns;
  }
  closeDialog() {
    this.radioValue = selectedRadio;
    this.$emit("close", true);
  }
  closeAndRefresh() {
    selectedRadio = this.radioValue;
    this.$emit("selected", this.selected);
    this.closeDialog();
  }
  async getOptions() {
    try {
      this.loading = true;
      let { data } = await api.get({
        url: "MATERIAL_GROUP",
        isAdminApi: true,
        source: parseInt(this.currentTab), // 0-主机厂 1-集团 2-经销商
        type: 0 // 0-图文  1-图片  2-视频
      });
      this.loading = false;
      this.categories = data;
      if (data && data.length > 0) {
        this.setGroup(data[0]);
      }
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  }
  private proxyQuery(filters: any) {
    filters.source = parseInt(this.currentTab);
    filters.groupId = this.curCategory;
    return filters;
  }
  private proxyData(data: Item[]) {
    tableData = data; // 保存原始数据
    return this.conf.handleTableData(data);
  }
  radioChange(val: string) {
    let index: number = parseInt(val.split("_")[1]);
    this.selected = tableData[index];
  }
  currentChange(obj: expendItem) {
    if (obj) {
      this.selected = tableData[obj.realDataIndex];
    }
  }
  clearSelect() {
    this.radioValue = null;
    this.selected = {};
  }
  setGroup(item: any) {
    this.curCategory = item.id;
    // 获取列表
    this.searchTableRef.handleReset();
  }
  created() {
    // 根据角色确定source
    let s: string = (<any>this.$route.query).sysPlat;
    if (s === "factory") {
      this.tabs = [];
      this.currentTab = "0";
    } else if (s === "company") {
      this.tabs.shift();
      this.currentTab = "1";
    }
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      // 如果没有历史选中，取消选中行
      if (!this.info.id) {
        this.clearSelect();
      }
      if (this.categories.length === 0) {
        this.getOptions();
      }
    }
  }
  @Watch("currentTab")
  onCurrentTab(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      if (this.showDialog) {
        this.getOptions();
      }
    }
  }
}
</script>

<style lang="scss">
.tree-cat_panel {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding-top: 10px;
  .tree-cat_content {
    width: 100%;
    ul li {
      line-height: 40px;
      padding: 0 15px;
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      * {
        line-height: 40px;
      }
    }
    li:hover {
      background: #e3f2ff;
    }
    li.active {
      background: #e3f2ff;
    }
  }
}
</style>
<template>
  <div class="main-container">
    <el-row :gutter="20"
            style="margin-bottom:20px;">
      <el-col :span="12"
              :key="index"
              v-for="(item, index) in handleData">
        <el-card>
          <h1>{{internalSumary[item.key] || 0}}</h1>
          <h5>{{item.label}}</h5>
        </el-card>
      </el-col>
    </el-row>
    <h4>阅读记录</h4>
    <el-admin-table :tableAttrs="tableColumns"
                    :pagerAttrs.sync="pagerAttrs"
                    ref="adminTableRef"
                    :apiFn="apiFn" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { tableColumns } from "../const/infoConfig";
interface InternalSumary {
  readerCount?: number,
  receiverCount?: number
}

@Component
export default class coupinStatistics extends Vue {
  @Prop({ type: Object }) articleObj: any;
  @Ref() readonly adminTableRef: any;
  @Prop({ type: Function }) internalAll: Function;
  @Prop({ type: Function }) sumaryFn: Function;
  readonly tableColumns = tableColumns;
  readonly handleData: any = [
    { key: 'readerCount', label: "阅读人数" },
    { key: 'receiverCount', label: "送达人数" }
  ];
  private internalSumary: InternalSumary = {};
  private pagerAttrs: any = { 'page-size': 5 };

  apiFn(params = {}) {
    return this.sumaryFn(this.articleObj.id, params)
  };
  async articleInternalAll() {
    try {
      const { data } = await this.internalAll(this.articleObj.id);
      this.internalSumary = data || {};
    } catch (e) {
      this.log(e)
    }
  };
  refresh() {
    this.adminTableRef.goSearch();
    this.articleInternalAll();
  };
  created() {
    this.articleInternalAll();
  }
}
</script>

<style lang="scss" scoped>
h1,
h5 {
  text-align: center;
  margin: 5px 0;
}
h1 {
  line-height: 1.5em;
}
</style>

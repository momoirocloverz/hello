<template>
  <div class="main-container">
    <el-row :gutter="20"
            style="margin-bottom:20px;">
      <el-col :span="6"
              :key="index"
              v-for="(item, index) in handleData">
        <el-card>
          <h1>{{item.number}}</h1>
          <h5>{{item.name}}</h5>
        </el-card>
      </el-col>
    </el-row>
    <h4>公众号文章分析</h4>
    <search-table :data="tableData"
                  :tableColumns="tableColumns"
                  :searchConfig="searchConfig">
    </search-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import { Config, Item } from "../const/wxStatisticsConfig";

@Component({
  components: {
    SearchTable
  }
})
export default class coupinStatistics extends Vue {
  @Prop()
  counts: any;
  private conf = new Config().get(this);
  private tableData: Item[] = [];
  private searchConfig: object = this.conf.searchConfig;
  private tableColumns: object = this.conf.tableColumns;
  get handleData() {
    const c = this.counts ? this.counts : {};
    return [
      { number: c.count || 0, name: "送达人数" },
      { number: c.occpation || 0, name: "阅读人数" },
      { number: c.hasGet || 0, name: "分享人数" },
      { number: c.hasUse || 0, name: "微信收藏人数" }
    ];
  }
  created() {
    this.tableData = Array(10).fill({
      time: 1564023210108,
      readPeople: 10,
      readCount: 233,
      sharePeople: 10,
      shareCount: 233,
      wxPeople: 100,
      wxCount: 495
    });
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

<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'车型限价管理'}]" />

    <el-tabs v-model="activeTab">
      <el-tab-pane v-for="(item, i) in tabs"
                   :key="i"
                   :label="`${item.label}${i==1?'（'+totalCount+'）':''} `"
                   :name="item.name"></el-tab-pane>
    </el-tabs>
    <limitRule v-show="activeTab==='limitRule'" />
    <applyForLowPrice v-show="activeTab==='applyForLowPrice'"
                      @getListDone="getlowPriceList" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import applyForLowPrice from "./components/applyForLowPrice.vue";
import limitRule from "./components/limitRule.vue";
import { getlowPriceList } from "@/api";
@Component({
  components: {
    applyForLowPrice,
    limitRule
  }
})
export default class LimitPrice extends Vue {
  readonly tabs = [{ name: "limitRule", label: "限价规则" }, { name: "applyForLowPrice", label: "经销商低价申请" }];
  activeTab: any = "limitRule";
  totalCount: number = 0;
  async getlowPriceList() {
    try {
      const { data, totalCount } = await getlowPriceList({
        page: 1,
        size: 9999,
        status: 0
      });
      this.totalCount = totalCount || (data && data.length) || 0;
    } catch (e) {
      this.log(e);
    }
  }
  created() {
    if (this.$route.query.activeTab) {
      this.activeTab = this.$route.query.activeTab;
    }
  }
}
</script>
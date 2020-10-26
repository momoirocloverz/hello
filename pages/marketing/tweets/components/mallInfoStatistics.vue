<template>
  <div class="main-container">
    <el-row :gutter="20"
            style="margin-bottom:20px;">
      <el-col :span="handleData?24/handleData.length:3"
              :key="index"
              v-for="(item, index) in handleData">
        <el-card>
          <h1>{{shopSumary[item.key] || 0}}</h1>
          <h5>{{item.label}}</h5>
        </el-card>
      </el-col>
    </el-row>
    <div style="text-align:center;margin:20px 0;">
      <el-radio-group size="small"
                      v-model="radioBtn">
        <el-radio-button v-for="item in radioGroup"
                         :key="item.label"
                         :label="item.label">
          {{item.text}}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-for="item in radioGroup"
         :key="item.label">
      <el-admin-table ref="componentRef"
                      :tableAttrs="item.tableAttrs"
                      :apiFn="item.apiFn"
                      :pagerAttrs.sync="pagerAttrs"
                      v-show="radioBtn===item.label" />

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";

@Component
export default class CoupinStatistics extends Vue {
  @Prop({ type: Object }) articleObj: any;
  @Prop({
    type: Array,
    default: () => {
      return []
    }
  }) radioGroup: any;

  @Prop({
    type: Array,
    default: () => {
      return []
    }
  }) handleData: any;

  @Prop({
    type: Function,
    default: () => { }
  }) articleAll: Function

  private radioBtn: string = "0";
  private shopSumary: any = {};
  pagerAttrs: any = { 'page-size': 5 };
  async getArticleAll() {
    try {
      const { data } = await this.articleAll(this.articleObj.id);
      this.shopSumary = data || {};
    } catch (e) {
      this.log(e)
    }
  };
  refresh() {
    const refs: any = this.$refs.componentRef;
    refs.forEach((ref: any) => {
      ref.goSearch()
    });
    this.getArticleAll();
  };
  created() {
    this.getArticleAll();
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

<template>
  <div class="goods-choose" v-loading="loading">
    <el-radio-group v-model="checkedGoods" v-if="goodsList.length > 0">
      <el-radio v-for="item in goodsList" :label="item.code" @change="chooseInfo(item)" :key="item.code">
        {{ item.name }}
      </el-radio>
    </el-radio-group>
    <div class="empty-text" v-else>暂无车系</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { getSeriesModelList } from "@/api";
@Component({
  name: "goods"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private currentForm: any;
  private loading: boolean = false;
  checkedGoods: any = null;
  goodsList: Array<any> = [];
  private chooseInfo(child: any): void {
    this.$emit("chooseInfo", child);
  }
  created() {
    this.loading = true;
    // 获取已上架全部车系车型
    getSeriesModelList().then(
      (res: any) => {
        this.loading = false;
        this.goodsList = res.data;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
  @Watch("currentForm", { immediate: true, deep: true })
  "currentForm.info"() {
    console.log(this.currentForm.info);
    this.checkedGoods = this.currentForm.info;
  }
}
</script>

<style scoped lang="scss">
.goods-choose {
  min-height: 120px;
  .child-item {
    margin-bottom: 15px;
  }
}
</style>

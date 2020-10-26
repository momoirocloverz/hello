<template>
  <!-- 搜索商品类目 -->
  <div>
    <el-cascader v-model="categoryVal"
                 :options="categoryList"
                 :props="props"
                 clearable
                 placeholder="商品类目"
                 @change="handleChange"></el-cascader>
  </div>

</template>

<script lang='ts'>
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import { product_list_api } from "@/api";

@Component
export default class SearchCategory extends Vue {
  @PropSync("category", { type: [Number, String], default: "" }) _category: string | number;

  private categoryVal: Array<string | number> = [];
  private categoryList: any = [];
  private _id: number = 0;
  private props: any = {
    label: "name",
    value: "id",
    expandTrigger: 'hover',
    checkStrictly: true,
    lazy: true,
    lazyLoad: (node: any, resolve: any) => this.lazyLoadGetList(node, resolve)
  };
  @Watch("_category")
  codeChange(newVal: boolean, oldVal: boolean) {
    this.categoryVal = !newVal ? [] : this.categoryVal;
  }

  private async lazyLoadGetList(node?: any, resolve?: any) {
    if (!node.data) {
      return;
    }
    let id = node.data.id;
    try {
      let { data } = await product_list_api(id);
      const res = data.map((e: any) => {
        return {
          ...e,
          leaf: !e.hasChild
        }
      })
      resolve(res);
    } catch (error) {
      resolve([]);
      this.log(error);
    }
  }

  private async getCategoryApi(id: number) {
    try {
      let { data } = await product_list_api(id);
      const res = data.map((e: any) => {
        return {
          ...e,
          leaf: !e.hasChild
        }
      })
      this.categoryList = res;
    } catch (error) {
      this.log(error);
    }
  }
  private handleChange(val: Array<string | number>) {
    this._category = val[val.length - 1];
    // 传递给render方法使用
    this.$emit("update", val[val.length - 1]);
  }

  created() {
    this.getCategoryApi(0);
  }
}
</script>
<style lang='scss' scoped>
</style>
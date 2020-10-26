<template>
  <!-- 商品详情Table -->
  <div class="storeDetailTable">
    <p>
      <span>品牌：</span>吉利
    </p>
    <p>
      <span>最小包装：</span>吉利
    </p>
    <p>
      <span>商品类型：</span>吉利
    </p>
    <p>
      <span>适用车系：</span>吉利
    </p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
@Component
export default class StoreDetailTable extends Vue {}
</script>
<style lang='scss' scoped>
.storeDetailTable {
  padding-bottom: 20px;
  p {
    font-size: 12px;
    line-height: 30px;
    span {
      display: inline-block;
      color: #827f7f;
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>
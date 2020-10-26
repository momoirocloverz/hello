<template>
  <!-- 评价面板 -->
  <div class="evaluatePanel">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {}
</script>
<style lang='scss' scoped>
</style>
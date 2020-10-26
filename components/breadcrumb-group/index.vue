<template>
  <div class="breadcrumb">
    当前位置：
    <el-breadcrumb separator="/">
      <template v-if="len > 1">
        <el-breadcrumb-item v-for="x in breadGroup.slice(0, len-1)"
                            :to="x.to"
                            :key="x.label">
          {{x.label}}
        </el-breadcrumb-item>
      </template>
      <el-breadcrumb-item>
        {{breadGroup[len-1].label}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
interface BreadGroup {
  label: string;
  to: string;
}

@Component
export default class Breadcrumb extends Vue {
  @Prop({ type: Array }) breadGroup: BreadGroup[];
  get len() {
    return this.breadGroup.length
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  line-height: 1;
  height: 40px;
  background: #fff;
  margin: 0 -20px 20px;
  padding: 0 20px;
}
</style>
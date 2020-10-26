<template>
  <div class="full_screen">
    <span @click.stop="screenOption.full"
          class="full_btn">
      <small>全屏</small>
      <i class="el-icon-full-screen" />
    </span>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import screenOption from "@/utils/screenOption";
@Component
export default class FullScreen extends Vue {
  readonly screenOption = screenOption;
}
</script>
<style lang="scss" scoped>
.full_screen {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  text-align: right;
  background: rgba($color: #000000, $alpha: 0.1);
  z-index: 9999;
}
.full_btn {
  font-size: 20px;
  padding-right: 10px;
  cursor: pointer;
  color: rgba($color: #fff, $alpha: 0.4);
  opacity: 0.85;
  &:hover {
    opacity: 1;
  }
}
small {
  font-size: 13px;
  position: relative;
  top: -2px;
}
</style>
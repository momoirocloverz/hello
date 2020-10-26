<template>
  <!-- 没有权限提示页面 -->
  <div class="permissions">
    <img src="/imgs/permissions.svg">
    <h3>抱歉您没有任何权限，无法访问</h3>
    <span>请联系负责人开通权限</span>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {}
</script>
<style lang='scss' scoped>
.permissions {
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    color: #000;
  }
  span {
    color: #e9e6e6;
  }
}
</style>
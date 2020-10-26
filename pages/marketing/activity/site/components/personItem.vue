<template>
  <div class="person-item-box" :class="`box-${size}`">
    <img class="avatar" src="https://via.placeholder.com/80x80.png" />
    <div class="base-info">
      <strong class="num">1号</strong>
      <span class="name">王小花儿</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "personItem"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private row: any;
  @Prop({ default: "medium" }) private size: string;
}
</script>

<style scoped lang="scss">
.person-item-box {
  display: flex;
  align-items: center;
  width: 200px;
  border: 1px solid $card-border;
  padding: 15px;
  margin: 5px;
  .avatar {
    width: 80px;
    height: 80px;
  }
  .base-info {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    .name {
      margin-top: 10px;
    }
  }
  &.box-small {
    .width {
      width: 180px;
    }
    .avatar {
      width: 50px;
      height: 50px;
    }
  }
}
</style>

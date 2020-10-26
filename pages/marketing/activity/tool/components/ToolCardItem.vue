<template>
  <div :class="['card-item', `tool-type-${parent.id}`]">
    <div :class="['tool-pic', `${toolItem.id}`]">
      <img :alt="toolItem.name" :src="require(`../style/${toolItem.pic}.png`)" />
    </div>
    <div class="tool-info">
      <div class="name">{{ toolItem.name }}</div>
      <div class="desc">{{ toolItem.desc }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ToolCardItem"
})
export default class extends Vue {
  @Prop({ required: true }) private toolItem!: Object;
  @Prop({ required: true }) private parent!: Object;
}
</script>

<style scoped lang="scss">
.card-item {
  border: 1px solid #cccccc;
  background: #fff;
  border-radius: 5px;
  padding: 15px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border: 1px solid $primary-color;
  }
  .tool-pic {
    float: left;
    width: 80px;
    height: 80px;
    margin-right: 15px;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tool-info {
    margin: 10px 0;
    .name {
      font-weight: bold;
      color: #091017;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .desc {
      font-weight: 400;
      color: #8a96a0;
      font-size: 14px;
    }
  }
}
</style>

<!--简易弹幕-->
<template>
  <div id="barrage"
       class="barrage-wrap"
       ref="barrageRef">
    <barrage-item v-for="(item, index) in barrageArr"
                  :key="index"
                  :barrageItem="item"></barrage-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import BarrageItem from "./barrageItem.vue";
@Component({
  name: "barrage",
  components: {
    BarrageItem
  }
})
export default class extends Vue {
  barrageArr: Array<any> = [];
  @Prop({ default: () => [] }) private barrageItem: any;
  @Ref() barrageRef: HTMLElement;
  @Watch("barrageItem")
  onBarrageItem(n: any, o: any) {
    this.barrageArr.push(n);
  }
  mounted() {}
  beforeDestroy() {}
}
</script>

<style lang="scss">
.barrage-wrap {
  position: absolute;
  top: 0;
  left: 0;
  height: 600px;
  width: 100%;
  padding-top: 30px;
  overflow: hidden;
  z-index: 1000;
}
</style>

<template>
  <div class="water-full-container" ref="waterRef">
    <div class="water-full-content" v-if="dataList.length > 0">
      <div class="list-content" ref="dataListRef" v-for="(item, idx) in dataList" :key="idx">
        <slot name="content" ref="itemRef" :item="item"></slot>
      </div>
    </div>
    <div v-else>暂无数据</div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import _ from "lodash";

@Component({
  name: "index"
})
export default class extends Vue {
  @Prop({ default: () => [] }) dataList: Array<any>;
  @Ref() readonly waterRef: HTMLElement;
  @Ref() dataListRef: any;
  private heightArr: Array<number> = [];

  /**
   * 是否触底
   */
  isBottom() {
    let flag = false;
    if (this.waterRef.scrollTop + this.waterRef.offsetHeight >= this.waterRef.scrollHeight - 50) {
      flag = true;
    }
    return flag;
  }

  loadData() {
    this.$emit("loadData");
  }

  /**
   * 设置位置
   */
  setPosition() {
    let containerWidth = this.waterRef.offsetWidth;
    let $child: any = this.dataListRef && this.dataListRef[0];
    if ($child) {
      let boxWidth = $child.firstChild.offsetWidth;
      let column = Math.floor(containerWidth / boxWidth);
      for (let i = 0; i < this.dataListRef.length; i++) {
        let $item = this.dataListRef[i].firstChild;
        let boxWidth = $item.offsetWidth + 20;
        let itemHeight = $item.offsetHeight + 15;
        if (i < column) {
          this.heightArr[i] = itemHeight;
        } else {
          let minHeight = Math.min.apply(null, this.heightArr);
          let minIdx = this.heightArr.indexOf(minHeight);
          $item.style = `position:absolute;top:${minHeight}px;left:${minIdx * boxWidth}px`;
          this.heightArr[minIdx] += itemHeight;
        }
      }
    }
  }
  mounted() {
    this.setPosition();
    this.waterRef.addEventListener(
      "scroll",
      _.throttle(() => {
        if (this.isBottom()) {
          this.loadData();
        }
      })
    );
  }
  @Watch("dataList", { immediate: true, deep: true })
  "dataList.length"() {
    this.$nextTick(() => {
      this.setPosition();
    });
  }
}
</script>

<style scoped lang="scss">
.water-full-container {
  display: flex;
  flex-direction: column;
  .water-full-content {
    position: relative;
    width: 100%;
    height: 100%;
    /*display: flex;*/
    /*flex-direction: row;*/
    /*flex-wrap: wrap;*/
  }
  .list-content {
  }
}
</style>

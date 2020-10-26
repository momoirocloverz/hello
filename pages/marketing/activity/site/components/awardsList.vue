<template>
  <el-scrollbar class="awards-box">
    <div
      class="price-level "
      :class="item.isHide ? 'hide' : 'show'"
      @click="chooseCurrentLevel(item, idx)"
      v-for="(item, idx) in awardSets"
      :key="idx"
    >
      <strong class="price-item-info">
        <span class="price-name">{{ item.name }} </span>
        <span v-if="item.awardsPerson">({{ item.num }}位)</span>
        <span v-else>(等待抽奖)</span>
      </strong>
      <div class="price-winner" v-if="item.awardsPerson">
        <person-item size="small" v-for="(person, idx) in item.awardsPerson" :row="person" :key="idx" />
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import personItem from "./personItem.vue";
import fans from "@/pages/customer/fans.vue";
@Component({
  name: "awardsList",
  components: {
    personItem
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) private row: any;
  @Prop({ default: () => [] }) private awardSets: Array<{}>;
  private chooseCurrentLevel(item: any, i: number) {
    if (item.awardsPerson && item.awardsPerson.length > 0) {
      item.isHide = !item.isHide;
    } else {
      this.$emit("chooseCurrentLevel", item);
    }
  }
}
</script>

<style scoped lang="scss">
.awards-box {
  height: 80vh;
  overflow-y: hidden;
  .price-winner {
    transition: all 0.3s ease-in;
  }
  .hide {
    .price-winner {
      height: 0;
      opacity: 0;
    }
  }
  .show {
    .price-winner {
      height: inherit;
      opacity: 1;
    }
  }
}
.price-level-list {
}
</style>

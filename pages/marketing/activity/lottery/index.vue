<!--抽奖-->
<template>
  <div class="lottery-page">
    <list-index activeType="lottery" v-if="isAgent"></list-index>
    <factory-list activeType="lottery" v-else></factory-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ListIndex from "../components/listIndex.vue";
import FactoryList from "../components/factoryList.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "lotteryIndex",
  components: {
    ListIndex,
    FactoryList
  }
})
export default class extends mixins(ActivityMixin) {
  created() {
    this.setActiveType("lottery");
    this.setActiveItem("agent");
  }
}
</script>

<style scoped lang="scss">
.lottery-page {
}
</style>

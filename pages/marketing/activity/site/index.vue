<!--活动管理-->
<template>
  <div>
    <list-index activeType="site" v-if="isAgent"></list-index>
    <factory-list activeType="site" v-else></factory-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ListIndex from "../components/listIndex.vue";
import FactoryList from "../components/factoryList.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "siteIndex",
  components: {
    ListIndex,
    FactoryList
  }
})
export default class extends mixins(ActivityMixin) {
  created() {
    this.setActiveType("site");
    this.setActiveItem("agent");
  }
}
</script>

<style scoped></style>

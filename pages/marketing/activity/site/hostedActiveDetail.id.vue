<!--投放详情-->
<template>
  <hosted-detail activeType="site" type="hosted" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import hostedDetail from "../components/hostedDetail.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "lotteryPutDetail",
  components: {
    hostedDetail
  }
})
export default class extends mixins(ActivityMixin) {
  created() {
    this.setActiveType("site");
  }
}
</script>

<style scoped></style>

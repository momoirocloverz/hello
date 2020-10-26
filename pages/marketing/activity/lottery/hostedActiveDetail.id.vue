<!--投放详情-->
<template>
  <hosted-detail activeType="lottery" type="hosted" />
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
    this.setActiveType("lottery");
  }
}
</script>

<style scoped></style>

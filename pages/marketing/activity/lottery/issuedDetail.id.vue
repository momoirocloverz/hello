<template>
  <issued-detail activeType="lottery" type="issued" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IssuedDetail from "../components/issuedDetail.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "lotteryIssuedDetail",
  components: {
    IssuedDetail
  }
})
export default class extends mixins(ActivityMixin) {
  created() {
    this.setActiveType("lottery");
  }
}
</script>

<style scoped></style>

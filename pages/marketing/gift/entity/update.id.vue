<template>
  <set-entity></set-entity>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SetEntity from "../components/setEntity.vue";

@Component({
  components: {
    SetEntity
  }
})
export default class createCoupon extends Vue {
  beforeRouteLeave(to: any, from: any, next: any) {
    const h = this.$createElement;
    const message: any = h("p", {}, [h("p", { style: "color: #333" }, "编辑信息未保存，确定要离开吗？ ")]);
    this.$confirm(message, "提示")
      .then(_ => {
        next();
      })
      .catch(_ => {
        next(false);
      });
  }
}
</script>

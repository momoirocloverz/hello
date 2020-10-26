<template>
  <set-coupon @submit="submit"></set-coupon>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SetCoupon from "../components/setCoupon.vue";

@Component({
  components: {
    SetCoupon
  }
})
export default class updateCoupon extends Vue {
  private isSubmit: boolean = false;
  submit(data: boolean) {
    if (data) {
      this.isSubmit = true;
    }
  }
  private beforeRouteLeaveCount: number = 0;
  async beforeRouteLeave(to: any, from: any, next: any) {
    // bug:beforeRouteLeave会走两次
    this.beforeRouteLeaveCount++;
    if (this.beforeRouteLeaveCount <= 1 || this.isSubmit) {
      return next();
    }
    const h = this.$createElement;
    const message: any = h("p", {}, [h("p", { style: "color: #333" }, "编辑信息未保存，确定要离开吗？ ")]);
    try {
      let res = await this.$confirm(message, "提示");
      if (res) {
        next();
      }
    } catch (err) {
      this.beforeRouteLeaveCount = 0;
      next(false);
    }
  }
}
</script>

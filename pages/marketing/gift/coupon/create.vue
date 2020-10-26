<template>
  <set-coupon></set-coupon>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SetCoupon from "../components/setCoupon.vue";

@Component({
  components: {
    SetCoupon
  }
})
export default class createCoupon extends Vue {}
</script>

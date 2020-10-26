<!--商城首页-->
<template>
  <banner-set bannerType="mall"></banner-set>
</template>

<script lang="ts">
import bannerSet from "../components/bannerSet.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "mallSet",
  components: {
    bannerSet
  }
})
export default class extends Vue {}
</script>

<style scoped lang="scss"></style>

<!--商城首页-->
<template>
  <banner-set bannerType="interact"></banner-set>
</template>

<script lang="ts">
import bannerSet from "../components/bannerSet.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "interactSet",
  components: {
    bannerSet
  }
})
export default class extends Vue {}
</script>

<style scoped lang="scss"></style>

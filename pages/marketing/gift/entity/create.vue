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
export default class createCoupon extends Vue {}
</script>

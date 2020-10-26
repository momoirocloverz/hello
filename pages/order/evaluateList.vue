<!--评价列表-->
<template>
  <div class="comment-page">
    <breadcrumb-group :breadGroup="[{ label: '评价列表', to: '' }]" />
    <agent-list v-if="sysPlat === 'agent'"></agent-list>
    <factory-list v-else></factory-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import agentList from "./components/comment/agentList.vue";
import factoryList from "./components/comment/factoryList.vue";

@Component({
  name: "commentPage",
  components: { agentList, factoryList }
})
export default class extends Vue {
  sysPlat: string = "agent";
  created() {
    this.sysPlat = (<any>this.$route.query).sysPlat;
  }
}
</script>

<style scoped lang="scss"></style>

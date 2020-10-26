<!--活动模板-->
<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'活动管理',to:''},{label:'活动模版',to:'/marketing/activity/template/index'}]" />
    <el-card>
      <templatesList :showEdit="true"></templatesList>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import templatesList from "./components/templatesList.vue";

@Component({
  name: "templateIndex",
  components: {
    templatesList
  }
})
export default class extends Vue {}
</script>

<style scoped></style>

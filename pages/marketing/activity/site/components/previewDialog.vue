<template>
  <el-dialog el-dialog :title="dialogObj.title" :visible.sync="dialogObj.show" width="60%">
    <div class="ql-editor container" v-html="description"></div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
@Component({
  name: "sitePreview",
  components: {}
})
export default class preview extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: () => "" }) private description: string;
}
</script>

<style scoped lang="scss">
.container {
  border: 1px solid $card-border;
  box-shadow: 0 0 1px 1px $card-border;
  padding: 10px;
}
</style>

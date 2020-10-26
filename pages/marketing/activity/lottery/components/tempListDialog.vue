<!--模板列表-->
<template>
  <el-dialog
    class="pop-wrap"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="60%"
    :before-close="handleClose"
  >
    <templates-list :showEdit="false" @useTemp="useTemp"></templates-list>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import templatesList from "../../template/components/templatesList.vue";
@Component({
  name: "tempList",
  components: {
    templatesList
  }
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  handleClose() {
    this.$emit("handleClose");
  }
  useTemp(temp: any) {
    this.$emit("handleClose");
    this.$emit("chooseTemp", temp);
  }
}
</script>

<style lang="scss" scoped></style>

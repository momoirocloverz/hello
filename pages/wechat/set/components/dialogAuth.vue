<template>
  <div>
    <!--dialog-->
    <el-dialog title="确认授权" :visible.sync="showDialog" :before-close="closeDialog" width="30%">
      <div class="dialog-content">
        <p>请再次确认</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"><a :href="url" referrerpolicy="origin">去授权</a></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import api from "@/api/restful";

@Component({
  components: {}
})
export default class dialogAuth extends Vue {
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly url: any;

  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh() {}
}
</script>

<style lang="scss">
.el-button--primary {
  a {
    display: block;
    color: #fff;
    text-decoration: none;
  }
}
</style>

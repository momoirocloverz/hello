<template>
  <!-- 经销商-退款售后 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'退款售后'}]" />

    <el-admin-table :tableAttrs="tableAttrs">
      <template slot="search">

      </template>
    </el-admin-table>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { postsaleTableColumns } from "./const";
@Component({
  components: {}
})
export default class Postsale extends Vue {
  readonly tableAttrs = {
    columns: [
      ...postsaleTableColumns,

      {
        type: "operation",
        col: {
          width: "200px"
        },
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT"),
            text: "详情",
            atClick: (row: any) => this.log(row)
          },
          {
            show: (row: any) => this.accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT"),
            text: "退款",
            atClick: (row: any) => this.log(row)
          },
          {
            show: (row: any) => this.accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT"),
            text: "重新退款",
            atClick: (row: any) => this.log(row)
          }
        ]
      }
    ]
  };
}
</script>
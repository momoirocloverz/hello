<template>
  <div>
    <search-table url="campaign/common/released" :tableColumns="constant.ACTIVE_COLUMNS" :searchConfig="searchConfig">
      <template v-slot:radio="{ row }">
        <el-radio @change="chooseInfo(row)" v-model="selectedAct" :label="row.id"> {{ label }}</el-radio>
      </template>
    </search-table>
  </div>
</template>

<script lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Const from "../const";

@Component({
  name: "active",
  components: {
    SearchTable
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) private currentForm: any;
  selectedAct: any = 1;
  label: string = "   ";
  searchConfig: any = {
    props: [
      {
        tag: "input",
        prop: "code",
        placeholder: "活动编号"
      },
      {
        tag: "input",
        prop: "name",
        placeholder: "活动名称"
      },
      {
        tag: "select",
        prop: "type",
        placeholder: "活动类型",
        options: [
          {
            value: 0,
            label: "抽奖活动",
            key: "LUCKY_DRAW"
          },
          {
            value: 1,
            label: "团购活动",
            key: "GROUP_ON"
          },
          {
            value: 2,
            label: "线下活动",
            key: "OFF_LINE"
          }
        ]
      }
    ]
  };
  get constant() {
    return new Const(this).const;
  }

  private chooseInfo(row: any): void {
    this.$emit(
      "chooseInfo",
      row || {
        id: this.selectedAct
      }
    );
  }
  @Watch("currentForm", { immediate: true, deep: true })
  "currentForm.info"() {
    this.selectedAct = this.currentForm.info;
  }
}
</script>

<style scoped></style>

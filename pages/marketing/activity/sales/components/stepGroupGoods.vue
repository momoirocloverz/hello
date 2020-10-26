<!--团购商品-->
<template>
  <group-goods ref="stepRef" :form="salesForm"> </group-goods>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import groupGoods from "../../components/groupGoods.vue";
import { SalesForm } from "@/@types/activity";

@Component({
  name: "stepGroupGoods",
  components: {
    groupGoods
  }
})
export default class StepActiveSet extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @State(state => state.activity.salesForm) private salesForm!: SalesForm;
  @Prop({ default: () => {} }) private constant: any;
}
</script>

<style scoped></style>

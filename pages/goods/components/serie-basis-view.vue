<template>
  <div>
    <detailHighlight :highlightListForSubmit.sync="highlightListForSubmit">
      <div slot="header" />
      <div slot="footer" />
    </detailHighlight>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import SerieDetailMixin from "../mixin/serie-detail.mixin";
import detailHighlight from "./detail-highlight.vue";
import {
  detailForMainFactory,
  detailForDealer,
} from "@/api";
const brandCode = "geely";

@Component({
  inheritAttrs: false,
  components: {
    detailHighlight
  },
})
export default class SerieBasis extends mixins(SerieDetailMixin) {
  @PropSync('serieForm', {
    type: Object, default: () => {
      return {}
    }
  }) _serieForm: any;
  @PropSync('serieData', {
    type: Object, default: () => {
      return {}
    }
  }) _serieData: any;
  highlightListForSubmit: any[] = [];
  async getBasisInfo() {
    try {
      const { sysPlat } = this.$route.query;
      const fn = sysPlat === 'factory' ? detailForMainFactory : detailForDealer;
      const seriesCode: any = this.$route.params.serieCode;
      const { data } = await fn({ seriesCode });
      const { logo, name, externalCode, introduction, minPrice, maxPrice } = data;
      this._serieForm = {
        logo, name, externalCode, introduction
      }
      this._serieData = { minPrice, maxPrice };
      // const 
    } catch (e) {
      this.log(e)
    }
  }
  created() {
    this.getBasisInfo()
  }
}
</script>
<style lang="scss" scoped>
.minw {
  /deep/ .el-input {
    width: 30%;
  }
}
.logo_pic {
  max-width: 100px;
}
/deep/ {
  .el-date-editor {
    width: 100%;
  }
  .el-input__inner {
    padding-right: 50px;
  }
}
</style>
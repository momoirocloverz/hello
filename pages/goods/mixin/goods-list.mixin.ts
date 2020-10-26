import { Ref, Vue, Component } from "vue-property-decorator";
import {
  seriesBrandCode,
  modelBySeriesCode,
  dealerModelsBySerie,
  dealerSeriesByBrand
} from "@/api";
const brandCode = 'geely';

@Component
export default class GoodsListMixin extends Vue {
  @Ref() readonly adminTableRef: any;
  readonly textStyle = "color:#888;font-size:13px";

  loading: boolean = true;
  totalCount: number = 0;
  customQuery: any = { seriesCode: '' };
  currentSeriesTab: string = '-1';
  modalVisible: boolean = false;
  dialogType: number = 1;
  seriesInPage: any = {};
  seriesGroup = [];
  previewUrl: string = "";
  get sysPlat() {
    return this.$route.query.sysPlat
  }
  /**
   * @description 点击车系展示在右边的车型列表
   */
  chooseSerie(serie: any) {
    this.currentSeriesTab = serie.code;
    this.seriesInPage = serie;
    this.customQuery = { seriesCode: serie.code };
    localStorage[`${this.sysPlat}-seriecode`] = serie.code;
    this.$nextTick(() => {
      this.adminTableRef.goSearch();
    })
  };
  showImgPreview(row: any) {
    this.previewUrl = row.logo
  }
  /**
   * @description 查看车系
   */
  viewSeire(serie: any) {
    localStorage[`${this.sysPlat}-seriecode`] = serie.code;
    this.$router.push({
      name: "goods-serieinfo",
      params: {
        operation: "view",
        serieCode: serie.code
      }
    });
  }
  /**
   * @description 跳转详情
   */
  goDetail(row: any, operation: "view" | "edit") {
    this.$router.push({
      name: "goods-modelinfo",
      params: {
        operation,
        modelCode: row.code
      },
      query: {
        serie: this.seriesInPage.code
      }
    })
  };
  /**
   * @description 车系列表
   */
  async getSeriesByBrandCode() {
    try {
      let fn = seriesBrandCode
      if (this.$route.query.sysPlat === "agent") {
        fn = dealerSeriesByBrand
      }
      const { data } = await fn(brandCode);
      this.seriesGroup = data || [];
      this.loading = false;
      if (this.currentSeriesTab === '-1' && this.seriesGroup.length > 0) {
        let sc = localStorage[`${this.sysPlat}-seriecode`]
        let item = this.seriesGroup.find((e: any) => {
          return e.code === sc;
        })
        if (item) {
          this.chooseSerie(item);
        } else {
          this.chooseSerie(data[0])
        }
      }
    } catch (e) {
      this.loading = false;
      this.log(e)
    }
  };
  /**
   * @description 根据车系获取车型
   */
  getModelBySeriesCode(params: any) {
    let fn = modelBySeriesCode
    if (this.$route.query.sysPlat === "agent") {
      fn = dealerModelsBySerie
    }
    return fn(this.customQuery.seriesCode, params);
  };

  created() {
    this.getSeriesByBrandCode();
  }
}

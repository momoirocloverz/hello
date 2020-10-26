import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { product_offSale_api, product_list_delete_api, product_sale_api } from "@/api";
import { filterUser } from "@/utils/userSetting";
@Component
export default class StoreOffSaleMixin extends Vue {
  @Ref() readonly adminTableRef: any;
  @Prop({ default: "2", type: String }) active: string;
  channel: any = filterUser().channel;

  getDetailInfo() {}
  goSearch() {
    this.adminTableRef ? this.adminTableRef.goSearch() : this.getDetailInfo();
  }
  setOffSale(id: number | string, type: string, showType: string) {
    // type 2 经销商 type 1 主机厂
    type === "2" && this.channel === "2" ? this.agentSetOffSale(id, type) : this.factorySetOffSale(id, type, showType);
  }

  // 经销商下架
  agentSetOffSale(id: number | string, type: string) {
    this.txtconfirm(
      async () => {
        try {
          await product_offSale_api(id, { id, channel: type });
          this.showMsg("下架成功");
          this.goSearch();
        } catch (error) {
          this.log(error);
        }
      },
      "确定要下架该商品？（下架后将立即生效）",
      "下架"
    );
  }

  /**
   * @deprecated 主机厂下架
   * @param id
   * @param type 接口请求需要的 channel 经销商那边有两个tab 不同的tab channel不一样
   * @param showType 弹窗显示不同的内容 经销商和主机厂不一样
   */
  factorySetOffSale(id: number | string, type: string, showType: string) {
    let txt =
      showType === "2" ? "（下架后将立即生效）" : "（下架后经销商将无法再上架该商品，经销商已上架的商品不受影响）";
    this.txtconfirm(
      async () => {
        try {
          await product_offSale_api(id, { id, channel: type });
          this.showMsg("下架成功");
          this.goSearch();
        } catch (error) {
          this.log(error);
        }
      },
      `确定要下架该商品？${txt}`,
      "下架"
    );
  }

  // 删除
  async _deleteApi(id: number | string) {
    try {
      await product_list_delete_api(id);
      this.showMsg("删除成功");
      this.goSearch();
    } catch (error) {
      this.log(error);
    }
  }

  // 主机厂上架成功 gosearch
  factorySetSaleGoSearch() {}
  // 主机厂上架
  async factorySetSale(row: any, goToList?: boolean) {
    let id = row.id;
    this.txtconfirm(
      async () => {
        try {
          await product_sale_api(this.channel, id, {});
          this.showMsg("上架成功");
          this.goSearch();
          goToList ? this.goToList() : "";
        } catch (error) {
          this.log(error);
        }
      },
      "确定要上架该商品？",
      "上架"
    );
  }

  goToList() {
    this.$router.replace({
      name: "goods-store-storeList"
    });
  }
}

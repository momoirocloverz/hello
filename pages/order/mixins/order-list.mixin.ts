import { Component, Vue, Ref } from "vue-property-decorator";
import deepClone from "@/utils/deepClone";
import { currentMonth } from "../const/date-selection";
import { orderList } from "@/api";

@Component
export default class OrderListMixin extends Vue {
  tableRef: any;
  apiFn(params: any) {
    const params2 = deepClone(params)
    if (!params2.statusList[0]) {
      delete params2.statusList;
    }
    if (!params.orderNos[0]) {
      delete params2.orderNos;
    }
    return orderList(params2)
  };
  get isFactory() {
    return this.$route.query.sysPlat === 'factory';
  }
  get isAgent() {
    return this.$route.query.sysPlat === 'agent';
  }
  private daterange = [];
  // 搜索条件
  searchData: any = {};
  private searchDataOrigin = {
    businessUnitId: '',
    regionId: '',
    dealerCode: '',
    orderNos: [''],
    userName: '',
    phone: '',
    statusList: [''],
    startTime: '',
    endTime: ''
  };
  getTableList() {
    this.tableRef.goSearch()
  }
  reset() {
    this.daterange = [];
    this.searchData = deepClone(this.searchDataOrigin);
  };

  created() {
    this.reset();
  }
}
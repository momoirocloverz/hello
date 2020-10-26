<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'经销商设置',to:''}]" />
    <el-card>
      <el-form :model="subForm"
               ref="ruleFormRef"
               :rules="formRule"
               label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="门店名称"
                          prop="name">
              <el-input clearable
                        maxlength="50"
                        :disabled="editorStatus"
                        v-model="subForm.name">
                <i slot="suffix">{{subForm.name.length}}/50</i>
              </el-input>
            </el-form-item>
            <el-form-item label="门店位置"
                          prop="area">
              <el-input :disabled="editorStatus"
                        @click.native="openMap"
                        v-model="subForm.area"
                        :readonly="true">
                <i slot="prefix"
                   class="el-icon-location"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="客服电话"
                          prop="contactNumber">
              <el-input clearable
                        maxlength="20"
                        :disabled="editorStatus"
                        v-model="subForm.contactNumber">
                <i slot="suffix">{{subForm.contactNumber.length}}/20</i>
              </el-input>
            </el-form-item>
            <el-form-item label="客服人员"
                          prop="customersStaffIds">
              <div class="advisor-select">
                <el-button type="default"
                           size="small"
                           :disabled="editorStatus"
                           @click="showDialog">选择用户</el-button>
                <el-tag v-for="(item, index) in adviserList"
                        :key="index">{{item.name}}</el-tag>
                <p>请至少设置1名客服人员，最多支持设置5名客服人员，客服人员将接收到关于订单售后相关消息提醒</p>
              </div>
            </el-form-item>
            <!-- <el-form-item label="版权信息"
                          prop="copyright">
              <el-input clearable
                        maxlength="20"
                        :disabled="editorStatus"
                        v-model="subForm.copyright">
                <span slot="prefix">©</span>
              </el-input>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-form-item label="门店介绍"
                      prop="introduction"
                      class="lh0">
          <quillEditor :content.sync="subForm.introduction"
                       :disabled="editorStatus" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!editorStatus"
                     @click="cancel">取消</el-button>
          <el-button type="primary"
                     v-if="!editorStatus"
                     @click="confirm">保存</el-button>
          <el-button type="primary"
                     v-if="accessIsOpened('PERM:DEALER_OPTIONS:EDIT') && editorStatus"
                     @click="editorStatus = false">编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="选择位置"
               :visible.sync="mapStatus">
      <div>定位位置：{{currentPosition?currentPosition:"获取位置中..."}}</div>
      <div class="amap-page-container">
        <div class="search-box">
          <input v-model="searchKey"
                 placeholder="请输入搜索信息"
                 type="text"
                 id="search">
          <button @click="searchByHand">搜索</button>
          <div class="tip-box"
               id="searchTip"></div>
        </div>
        <el-amap vid="amap"
                 :plugin="plugin"
                 class="amap-demo"
                 :center="center"
                 :events="events">
          <el-amap-marker vid="component-marker"
                          :position="center"></el-amap-marker>
        </el-amap>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="mapStatus = false">取 消</el-button>
        <el-button type="primary"
                   @click="searchByHand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户弹窗 -->
    <dialog-users :showDialog="dialogVisible[0]"
                  :info="curItem"
                  @selected="usersChange"
                  @close="dialogVisible[0] = false">
    </dialog-users>

  </div>

</template>

<script lang='ts'>
import VueAMap from "vue-amap";
// import { AMapManager } from "vue-amap";
import quillEditor from "@/components/vue-quill-editor";
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { dealerInfo, setDealerInfo } from "@/api/modules/dealerList";
import { mapState } from "vuex";
import { serveValidator, introductionValidator } from "@/const/reg";
import dialogUsers from "./components/dialogSelectKf.vue";
VueAMap.initAMapApiLoader({
  // 高德key
  key: "c0d8f7ac1c9c578fabe041d23405efa6",
  // 插件集合 （插件按需引入）
  plugin: [
    "AMap.Geolocation",
    "Geocoder",
    "AMap.Map",
    "AMap.AdvancedInfoWindow",
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.MapType",
    "AMap.ToolBar",
    "AMap.OverView",
    "AMap.Scale"
  ],
  v: "1.4.4",
  uiVersion: "1.0"
});

let adviserTempList: any[] = [];

const MapInitConfig: any = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0,
  convert: true,
  showButton: true,
  buttonPosition: "RB",
  showMarker: true,
  showCircle: true,
  panToLocation: true,
  zoomToAccuracy: true,
  extensions: "all",
  pName: "Geolocation"
};
interface Rules {
  name: element.FormRule[];
  area: element.FormRule[];
  contactNumber: element.FormRule[];
  // copyright: element.FormRule[];
  introduction: element.FormRule[];
  customersStaffIds: element.FormRule[];
}
interface SubForm {
  name: string | null;
  area: string | null;
  contactNumber: string | null;
  // copyright: string | null;
  introduction: string | null;
  lonLat: string | null;
  customersStaffIds: number[];
}

@Component({
  components: {
    quillEditor,
    dialogUsers
  }
})
export default class StoreSetting extends Vue {
  @Prop({ default: "StoreSetting -> defaultName" }) name: string;
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  searchKey: string = "";
  editorContent: string = "";
  poiPicker: any;
  amapSearchResult: any = {};
  editMode: boolean = false;
  curItem: object = {};
  adviserList: any[] = [];
  private dialogVisible: any = {
    0: false
  };
  // amapManager: any = new AMapManager();
  currentPosition: string = "";
  subForm: SubForm = {
    name: "",
    area: "",
    contactNumber: "",
    // copyright: "",
    introduction: "",
    lonLat: "",
    customersStaffIds: []
  };
  editorStatus: boolean = true;
  mapStatus: boolean = false;
  center: number[] = [104.07, 30.67];
  mapInPageCOunt: number = 0;
  positionInfo: any = {};
  get plugin() {
    const self = this;
    if (this.mapInPageCOunt === 1) {
      return [
        {
          ...MapInitConfig,
          events: {
            init(o: any) {
              o.getCurrentPosition((status: any, result: any) => {
                console.log("result1", result);
                if (result && result.position) {
                  self.currentPosition = result.formattedAddress;
                  self.setPosition(result.position.lng, result.position.lat);
                } else {
                  o.getCityInfo((s: any, r: any) => {
                    if (r.type === "complete") {
                      self.currentPosition = r.city;
                      self.setPosition(r.center[0], r.center[1]);
                    }
                  });
                }
              });
            }
          }
        }
      ];
    }
    return [
      {
        ...MapInitConfig
      }
    ];
  }
  showDialog() {
    this.dialogVisible[0] = true;
    this.curItem = {
      selectList: this.adviserList
    };
  }
  usersChange(val: any[]) {
    this.adviserList = val;
    this.setAdviserIds();
    this.ruleFormRef.validate();
  }
  searchByHand() {
    // let amapSearchResult = this.amapSearchResult;
    // if (!amapSearchResult.item) {
    //   return;
    // }
    // this.setPosition(
    //   amapSearchResult.item.location.lng,
    //   amapSearchResult.item.location.lat,
    //   amapSearchResult.item.name
    // );
    this.subForm.lonLat = `${this.positionInfo.lng},${this.positionInfo.lat}`;
    this.subForm.area = this.positionInfo.name;
    this.mapStatus = false;
  }
  initSearch() {
    let vm = this;
    // let map = this.amapManager.getMap();
    AMapUI.loadUI(["misc/PoiPicker"], function(PoiPicker: any) {
      var poiPicker = new PoiPicker({
        input: "search"
      });
      vm.poiPicker = poiPicker;
      poiPicker.on("poiPicked", function(poiResult: any) {
        // 用户选中的poi点信息
        console.log("poiResult", poiResult);
        vm.center = [poiResult.item.location.lng, poiResult.item.location.lat];
        vm.amapSearchResult = poiResult;
        vm.searchKey = poiResult.item.name;
        vm.currentPosition = poiResult.item.name;
        vm.setPosition(poiResult.item.location.lng, poiResult.item.location.lat, poiResult.item.name);
      });
    });
  }
  get events(): any {
    const self: any = this;
    return {
      click(e: any) {
        self.setPosition(e.lnglat.lng, e.lnglat.lat);
        // self.mapStatus = false;
      }
    };
  }
  setPosition(lng: any, lat: any, name?: string) {
    // 设置位置信息
    const self: any = this;
    if (name) {
      self.positionInfo = {
        lng,
        lat,
        name
      };
      // self.subForm.lonLat = `${lng},${lat}`;
      // self.subForm.area = name;
      return;
    }
    var geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress([lng, lat], (status: any, result: any) => {
      if (status === "complete" && result.info === "OK") {
        self.positionInfo = {
          lng,
          lat,
          name: result.regeocode.formattedAddress
        };
        self.center = [lng, lat];
        // self.subForm.lonLat = `${lng},${lat}`;
        // self.subForm.area = result.regeocode.formattedAddress;
        self.currentPosition = result.regeocode.formattedAddress;
      }
    });
  }
  dealerInfo: any = {};
  readonly formRule: Rules = {
    name: [{ required: true, message: "门店名称不可为空", trigger: "blur" }],
    area: [{ required: true, message: "请选择门店位置", trigger: "blur" }],
    contactNumber: [{ validator: serveValidator, required: true, trigger: "blur" }],
    // copyright: [{ required: true, message: "版权信息不可为空", trigger: "blur" }],
    introduction: [{ validator: introductionValidator, trigger: ["change", "blur"] }],
    customersStaffIds: [
      {
        required: true,
        message: "请选择客服人员",
        validator: (rule: any, value: any, callback: Function) => {
          if (value.length === 0) {
            callback(new Error("请选择客服人员"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ]
  };
  async getDealerInfo() {
    // 获取经销商信息
    let { data } = await dealerInfo();
    if (data) {
      let arr: number[] = [];
      let { name, area, contactNumber, introduction, lonLat, customersStaffs } = data;
      (customersStaffs || []).map((v: any) => {
        arr.push(v.id);
      });
      this.adviserList = adviserTempList = customersStaffs || [];
      this.dealerInfo = JSON.parse(
        JSON.stringify({
          name: name ? name : "",
          area: area ? area : "",
          contactNumber: contactNumber ? contactNumber : "",
          introduction: introduction ? introduction : "",
          lonLat: lonLat ? lonLat : ""
        })
      );
      this.subForm = JSON.parse(
        JSON.stringify({
          name: name ? name : "",
          area: area ? area : "",
          contactNumber: contactNumber ? contactNumber : "",
          introduction: introduction ? introduction : "",
          lonLat: lonLat ? lonLat : "",
          customersStaffIds: arr
        })
      );
    }
  }
  async setDealerInfo(param: any) {
    let { data } = await setDealerInfo(param);
    if (data) {
      this.$message({
        type: "info",
        message: "操作成功"
      });
      this.editorStatus = true;
      this.getDealerInfo();
    }
  }
  openMap() {
    if (this.editorStatus) {
      return;
    }
    this.mapInPageCOunt += 1;
    this.mapStatus = true;
    this.initSearch();
  }
  setAdviserIds() {
    let arr: string[] = [];
    this.adviserList.map(v => {
      arr.push(v.id);
    });
    this.$set(this.subForm, "customersStaffIds", arr);
  }
  confirm() {
    this.setAdviserIds();
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        this.setDealerInfo(this.subForm);
      }
    });
  }

  cancel() {
    this.subForm = JSON.parse(JSON.stringify(this.dealerInfo));
    this.editorStatus = true;
    this.adviserList = adviserTempList;
  }
  created() {
    this.getDealerInfo();
  }
}
</script>
<style lang="scss" scoped>
.lh0 {
  /deep/ {
    .el-form-item__content {
      line-height: initial;
    }
  }
}
/deep/ {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .amap-ui-poi-picker-sugg-container {
    max-width: 300px;
    max-height: 220px !important;
  }
}
.advisor-select {
  /deep/ {
    .el-button,
    .el-tag {
      margin-right: 6px;
    }
    p {
      line-height: 1.5em;
      font-size: 1em;
    }
  }
}
.amap-demo {
  height: 500px;
}
.amap-page-container {
  height: 500px;
  position: relative;
}
.search-box {
  position: absolute;
  z-index: 5;
  width: 90%;
  left: 5%;
  top: 10px;
  height: 30px;
}
.search-box input {
  float: left;
  width: 300px;
  height: 30px;
  border: 1px solid #38f;
  padding: 0 8px;
}
.search-box button {
  float: left;
  width: 100px;
  height: 30px;
  background: #38f;
  border: 1px solid #38f;
  color: #fff;
}
</style>

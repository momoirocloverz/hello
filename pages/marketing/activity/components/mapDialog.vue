<!--地图-->
<template>
  <el-dialog :title="dialogObj.title" :visible.sync="dialogObj.show" width="60%" append-to-body>
    <div>定位位置：{{ currentPosition ? currentPosition : "获取位置中..." }}</div>
    <div class="amap-page-container">
      <div class="search-box">
        <input v-model="searchKey" placeholder="请输入搜索信息" type="text" id="search" />
        <button @click="searchByHand">搜索</button>
        <div class="tip-box" id="searchTip"></div>
      </div>
      <el-amap vid="amap" :plugin="plugin" class="amap" :center="center" :events="events">
        <el-amap-marker vid="component-marker" :position="center"></el-amap-marker>
      </el-amap>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogObj.show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="searchByHand" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import VueAMap from "vue-amap";
import { AMapManager } from "vue-amap";
VueAMap.initAMapApiLoader({
  // 高德key
  key: "c0d8f7ac1c9c578fabe041d23405efa6",
  // 插件集合 （插件按需引入）
  plugin: [
    "AMap.Geolocation",
    "AMap.Geocoder",
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
const MapInitConfig: any = {
  enableHighAccuracy: true,
  timeout: 100,
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

@Component({
  name: "mapDialog"
})
export default class extends Vue {
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: 0 }) private mapInPageCount: number;
  addr: any;
  lonLat: any;
  poiPicker: any;
  center: number[] = [104.07, 30.67];
  amapManager: any = new AMapManager();
  amapSearchResult: any = {};
  searchKey: string = "";
  currentPosition: string = "";
  get plugin() {
    const self = this;
    if (this.mapInPageCount === 1) {
      return [
        {
          ...MapInitConfig,
          events: {
            init(o: any) {
              o.getCurrentPosition((status: any, result: any) => {
                if (result && result.position) {
                  self.setPosition(result.position.lng, result.position.lat);
                  self.initSearch();
                } else {
                  o.getCityInfo((s: any, r: any) => {
                    if (r.type === "complete") {
                      self.setPosition(r.center[0], r.center[1]);
                      self.initSearch();
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
    this.$emit("hideMap", this.addr, this.lonLat, this.center[0], this.center[1]);
  }
  get events(): any {
    const self: any = this;
    return {
      click(e: any) {
        self.setPosition(e.lnglat.lng, e.lnglat.lat);
      }
    };
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
        vm.center = [poiResult.item.location.lng, poiResult.item.location.lat];
        vm.amapSearchResult = poiResult;
        vm.searchKey = poiResult.item.name;
        vm.setPosition(poiResult.item.location.lng, poiResult.item.location.lat, poiResult.item.name);
      });
    });
  }
  setPosition(lng: any, lat: any, name?: string) {
    return new Promise((resolve, reject) => {
      // 设置位置信息
      const self: any = this;
      if (name) {
        self.center = [lng, lat];
        self.lonLat = `${lng},${lat}`;
        self.addr = name;
        self.currentPosition = name;
        return;
      }
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress([lng, lat], (status: any, result: any) => {
        if (status === "complete" && result.info === "OK") {
          self.center = [lng, lat];
          self.lonLat = `${lng},${lat}`;
          self.addr = result.regeocode.formattedAddress;
          self.currentPosition = result.regeocode.formattedAddress;
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .amap-ui-poi-picker-sugg-container {
    max-width: 300px;
    max-height: 220px !important;
  }
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

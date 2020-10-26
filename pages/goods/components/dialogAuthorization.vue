<template>
  <div>
    <!--dialog-->
    <el-dialog :title="info.code?info.code + '网授权管理':'选择车型'"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="40%">
      <div class="dialog-content">
        <p class="no-data"
           v-if="tableData.length === 0">主机厂无上架的车型</p>
        <el-collapse :accordion="false"
                     v-model="curCollapse">
          <el-collapse-item :title="item.name"
                            :name="item.code"
                            :key="index"
                            v-show="item.modelList.length > 0"
                            v-for="(item, index) in tableData">
            <template slot="title">
              <div class="checkbox-box"
                   @click.stop="check(item, 0)">
                <el-checkbox :indeterminate="item.isIndeterminate"
                             v-model="item.checked">{{item.name}} <template v-if="info.code">（{{item.modelList.length}}）</template></el-checkbox>
              </div>
            </template>
            <div class="model-box"
                 :key="i"
                 v-for="(model, i) in item.modelList">
              <div class="checkbox-box"
                   @click.stop="check(model, 1)">
                <el-checkbox v-model="model.checked">{{model.name}}</el-checkbox>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   :disabled="tableData.length === 0"
                   @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/**
 * 车型授权及车型选择公用组件
 * @prop (Object) info {code: null, list: modelList} 如果code为空，为选择车型，可选(L,G)表示车型授权
 * @return (Object) {data: modelList, code: enum Code(null, L, G), modelDetailList?: modelDetailList} modelDetailList车型详细列表，用于车型选择
 **/
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import api from "@/api/restful";

interface Model {
  id: number;
  name: string;
  code: string;
  checked: boolean;
  seriesCode: string;
}

interface Item {
  id: number;
  code: string;
  name: string;
  checked: boolean;
  isIndeterminate: boolean;
  modelList: Model[];
}

@Component({
  components: {}
})
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: {} }) readonly info: any;
  private curCollapse: string[] = [];
  private tableData: Item[] = [];
  private selectList: Model[] = [];

  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh() {
    let models: string[] = [];
    this.selectList.map((v: Model) => {
      models.push(v.code);
    });
    this.$emit("selected", { data: models, code: this.info.code, modelDetailList: this.selectList });
    this.closeDialog();
  }
  async getList(cb: Function) {
    try {
      let url;
      if (this.info.code) {
        url = "AUTH_LIST";
      } else {
        url = "GET_AUTH_SERIES_AND_MODELS";
      }
      let data = await api.get({ url: url, isAdminApi: true });
      data = data.data || [];
      data.map((v: Item) => {
        v.checked = false;
        v.isIndeterminate = false;
        v.modelList.map((vv: Model) => {
          vv.checked = false;
          vv.seriesCode = v.code;
        });
      });
      this.tableData = data;
      if (cb) cb();
    } catch (err) {
      throw new Error(err);
    }
  }
  check(item: Item | Model, level: number) {
    // 如果当前没有展开的行或者点击行跟展开行不一致，展开点击的行
    if (this.curCollapse === [] || this.curCollapse.indexOf(item.code) === -1) {
      this.curCollapse.push(item.code);
    }
    item.checked = !item.checked;
    if (level === 0 && (<Item>item).modelList) {
      (<Item>item).isIndeterminate = false;
      this.toggleAllChildren(item.code);
    } else {
      if (item.checked) {
        this.addToSelectList(<Model>item);
      } else {
        this.removeSelect(<Model>item);
      }
      // 子级变更，设置父级
      this.setParentSelect((<Model>item).seriesCode);
    }
  }
  // 根据子级选中数量设置父级的选中状态
  setParentSelect(code: string) {
    this.tableData.map((v: Item) => {
      if (v.code === code) {
        let count = 0;
        v.modelList.map((vv: Model) => {
          if (vv.checked) {
            count++;
          }
        });
        if (count === v.modelList.length) {
          v.checked = true;
          v.isIndeterminate = false;
        } else if (count === 0) {
          v.checked = false;
          v.isIndeterminate = false;
        } else if (count < v.modelList.length) {
          v.isIndeterminate = true; // 半选中
        }
      }
    });
  }
  // 选中/不选中某个车系下的所有车型
  toggleAllChildren(code: string) {
    this.tableData.map((v: Item) => {
      if (v.code === code) {
        v.modelList.map((vv: Model) => {
          vv.checked = v.checked ? true : false;
          // 加入选择列表
          if (vv.checked) {
            this.addToSelectList(vv);
          } else {
            this.removeSelect(vv);
          }
        });
      }
    });
  }
  addToSelectList(item: Model) {
    let l = this.selectList.find((v: Model) => item.code === v.code);
    if (!l) {
      this.selectList.push(item);
    }
  }
  // 取消选中所有checkbox
  uncheckAll(cb: Function) {
    this.tableData.map((v: Item) => {
      v.checked = false;
      if (v.modelList) {
        v.modelList.map((vv: Model) => {
          vv.checked = false;
          this.removeSelect(vv);
        });
      }
      if (cb) cb();
    });
  }
  // 从selectList中移除
  removeSelect(item: Model) {
    let index: number | undefined;
    this.selectList.map((v: Model, k: number) => {
      if (v.code === item.code) {
        index = k;
      }
    });
    if (index !== undefined) {
      this.selectList.splice(index, 1);
    }
  }
  // 设置历史选中
  initCheckbox() {
    // 传入的为车系列表
    if (this.info.code) {
      this.info.list.map((v: any) => {
        this.tableData.map((t: Item) => {
          if (v.code === t.code) {
            t.checked = true;
            this.initChildrenCheckbox(v.modelList, t.modelList);
          }
        });
      });
    } else {
      // 传入的为车型code列表
      this.tableData.map((t: Item) => {
        this.initChildrenCheckboxByCode(this.info.list, t.modelList);
      });
    }
  }
  // 通过code设置子级历史选中
  initChildrenCheckboxByCode(oldList: Model[], newList: Model[]) {
    console.log(oldList);
    oldList.map((v: Model) => {
      newList.map((n: Model) => {
        if (v.code === n.code) {
          this.check(n, 1);
        }
      });
    });
  }
  // 设置子级历史选中
  initChildrenCheckbox(oldList: Model[], newList: Model[]) {
    oldList.map((v: any) => {
      newList.map((n: any) => {
        if (v.code === n.code) {
          this.check(n, 1);
        }
      });
    });
  }
  init() {
    this.selectList = [];
    this.getList(this.initCheckbox);
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.init();
    } else {
      this.curCollapse = [];
    }
  }
}
</script>

<style lang="scss">
.checkbox-box {
  display: inline-block;
  width: auto;
  height: auto;
  position: relative;
  &:before {
    content: "";
    width: 100%;
    height: 48px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: +5;
  }
}
.model-box {
  margin-left: 30px;
}
</style>


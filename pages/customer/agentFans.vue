<template>
  <!-- 经销商-粉丝管理 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'粉丝管理',to:''}]" />
    <div class="fans">
      <div class="left">
        <collapse :fansList.sync="fansLabelList"
                  :title="title"
                  formParent="agentFans"
                  :totalCount.sync="totalCount"
                  :btnVisible="accessIsOpened('PERM:FANS:EDIT')"
                  @reset="needShowAll=true"
                  @deletSubItem="deletSubItem"
                  @showAll="showAll"
                  @search="search">
          <div slot="title"
               class="line"
               v-if="accessIsOpened('PERM:FANS:EDIT')">
            <el-button size="small"
                       type="primary"
                       @click="addTag">新增标签</el-button>
          </div>
        </collapse>
      </div>
      <div class="right">
        <el-admin-table :formData.sync="formData"
                        :apiFn="apiFn"
                        :customQuery="customQuery"
                        @selection-change="selectionChange"
                        :tableAttrs="tableAttrs"
                        ref="tableRef"
                        class="line-table">
          <div slot="line"
               class="line">
            <div v-if="accessIsOpened('PERM:FANS:EDIT')">
              <el-button @click="bindLabel(true)"
                         size="small">打标签</el-button>
            </div>
          </div>
          <div class="btn-group"
               slot="search">
            <div class="search">
              <el-form-item prop="name">
                <el-select v-model="formData.concernStatus"
                           placeholder="是否关注">
                  <el-option v-for="(item, index) in concernStatus"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="formData.nickName"
                          size="small"
                          placeholder="请输入用户昵称"
                          clearable />
              </el-form-item>
            </div>
          </div>
          <div slot="right-btns">
            <el-form-item>
              <span class="txt-time"
                    v-if="lastSyncTime">更新时间：{{lastSyncTime}}</span>
              <el-button @click="syncFans"
                         v-if="!synchingStatus">同步公众号粉丝</el-button>
              <el-button icon="el-icon-loading"
                         disabled="disabled"
                         v-else>同步中</el-button>

            </el-form-item>
          </div>
        </el-admin-table>
      </div>
      <!-- 添加标签组 -->
      <addTagGroup v-if="addTagVisible"
                   placeholder="请输入标签名称"
                   label="标签名称："
                   :title="isTagEdit ? '编辑标签':'新建标签'"
                   :visible.sync="addTagVisible"
                   :submitLoading="submitTagLoading"
                   :subForm="tagSubForm"
                   @save="groupSaveTag" />

      <labelingComponent :fansList.sync="tagfansListInDialog"
                         :selectTagList.sync="selectTagList"
                         :visible.sync="labelingVisible"
                         :addTagLoading="submitTagLoading"
                         :addTagName.sync="addTagName"
                         @addTag="dialogAddTag"
                         @saveTag="dialogSaveTag"
                         v-if="labelingVisible" />
    </div>
  </div>

</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import Collapse from "@/components/tag-collapse/index.vue";
import labelingComponent from "./component/labeling.vue";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import AddTagGroup from "@/components/tag-collapse/addTag.vue";
import dayjs from "dayjs";
import { customerRoleConfig } from "@/const";
import { fansTableColumns } from "./const/agent.config";
import { cloneDeep } from "lodash";
import { storeInfoSetting } from "@/utils/userSetting";
import {
  member_by_dealer_api,
  fans_count_api,
  member_label_delete_api,
  member_label_add_api,
  memberLabelCount,
  wechat_user_sync_api,
  memberLabelBind,
  wechat_user_synching_status_api
} from "@/api";

interface SearchData {
  nickName: string;
  concernStatus: string;
}
interface TableList {
  name: string;
  avatar: string;
  nickName: string;
  label: Array<string>;
  adviserName: string;
  time: number;
}

interface LabelListItem {
  id: number;
  name: string;
  type?: string | number;
  num: number;
  select?: boolean;
}
interface LabelTabItem {
  id?: number;
  name?: string;
  type?: string | number;
}

@Component({
  components: {
    Collapse,
    labelingComponent,
    ElBtnDialog,
    AddTagGroup
  }
})
export default class App extends Vue {
  @Ref() readonly tableRef: any;
  readonly customQuery: any = { role: customerRoleConfig.fans };

  private synchingStatus: boolean = false;
  private lastSyncTime: string = "";
  private apiFn: any = member_by_dealer_api;
  private concernStatus: any = [{ label: "已关注", value: "CONCERN" }, { label: "未关注", value: "NOTCONCERN" }];
  private totalCount: number = 0;
  private addTagVisible: boolean = false;
  private isTagEdit: boolean = false;
  private submitTagLoading: boolean = false;
  private tagSubForm: LabelTabItem = { name: "" };

  private labelingVisible: boolean = false;
  private tagfansListInDialog: Array<LabelListItem> = [];
  private fansLabelList: Array<LabelListItem> = [];
  private addTagName: string = "";

  private selectTagList: Array<number | string> = []; // 打标签里面选中的数组
  private formData: SearchData = { nickName: "", concernStatus: "" };
  private obj2Bind: any[] = [];
  private isBindGroup: boolean = false;
  private needShowAll: boolean = false;
  private readonly tableAttrs = {
    border: true,
    hasSearch: true,
    columns: [
      ...fansTableColumns,
      {
        type: "operation",
        btns: [
          {
            text: "打标签",
            show: (row: any) => this.accessIsOpened("PERM:FANS:EDIT") && row.concernStatus === "CONCERN",
            atClick: (row: any) => this.bindLabel(false, row)
          },
          {
            text: "—",
            show: (row: any) => row.concernStatus !== "CONCERN"
          }
        ]
      }
    ]
  };
  get title() {
    return `全部粉丝（${this.totalCount}）`;
  }

  /**
   * @description 同步粉丝
   */
  private async syncFans() {
    this.synchingStatus = true;
    let organId = storeInfoSetting.getInfo().organId;
    try {
      let data = await wechat_user_sync_api({ organId });
      this.synchingStatus = false;
      this._sucInit();
      this.syncStatus();
    } catch (error) {
      this.synchingStatus = false;
      this.log(error);
    }
  }
  /**
   * @description 获取同步中状态
   */
  private async syncStatus() {
    let organId = storeInfoSetting.getInfo().organId;
    try {
      let {
        data: { lastSyncTime, synchingStatus }
      } = await wechat_user_synching_status_api({ organId });
      this.lastSyncTime = lastSyncTime ? dayjs(lastSyncTime).format("YYYY-MM-DD HH:mm:ss") : "";
      this.synchingStatus = synchingStatus;
      this.synchingStatus
        ? setTimeout(() => {
            this.syncStatus();
          }, 2000)
        : "";
    } catch (error) {
      this.log(error);
    }
  }
  private _sucInit() {
    this.showMsg("公众号粉丝同步成功");
    this.showAll();
    this.memberLabelCount();
    this.tableRef.goSearch();
  }
  /**
   * @description 左边标签
   */
  // 删除某个标签
  private deletSubItem(id: string) {
    this.deleteconfirm(() => {
      this._deleteApi(id);
    });
  }
  // 删除接口
  private async _deleteApi(id: number | string) {
    try {
      await member_label_delete_api(id);
      this.showMsg("删除成功");
      this.memberLabelCount();
      this.tableRef.goSearch();
      if (this.needShowAll) {
        this.showAll();
      }
    } catch (error) {
      this.log(error);
    }
  }
  // 新增标签
  private addTag() {
    this.addTagVisible = true;
    this.tagSubForm = { name: "" };
    this.isTagEdit = false;
  }
  private groupSaveTag(name: string) {
    this.isTagEdit ? this._editTagApi(name) : this._saveTagApi(name);
  }
  private _editTagApi(name: string) {
    console.log(name);
  }
  private async _saveTagApi(name: string) {
    this.submitTagLoading = true;
    try {
      await member_label_add_api(name);
      this.submitTagLoading = false;
      this.addTagVisible = false;
      this.tableRef.goSearch();
      this.memberLabelCount();
      this.addTagName = "";
      this.showMsg("标签新建成功");
    } catch (error) {
      this.submitTagLoading = false;
      this.log(error);
    }
  }

  /**
   * 右边
   */
  dialogAddTag(name: string) {
    this.isTagEdit = false;
    this.groupSaveTag(name);
  }
  /**
   * @default 绑定tag
   */
  bindLabel(isBindGroup: boolean, row?: any): void {
    let memberIds = [];
    this.isBindGroup = isBindGroup;
    if (isBindGroup && this.obj2Bind.length <= 0) {
      this.showMsg("没有选择用户", "warning");
      return;
    }
    memberIds = this.obj2Bind;
    if (!isBindGroup) {
      this.obj2Bind = [row];
      memberIds = [row.memberUserId];
    }
    this.formatTagfansListInDialog();
    this.labelingVisible = true;
  }
  /**
   * @description 格式化dialog的标签配置
   */
  formatTagfansListInDialog() {
    const { obj2Bind, fansLabelList } = this;
    let tags: any = [];
    let selectTag: any = [];
    fansLabelList.forEach((ele: any) => {
      // obj2Bind = 页面点击或勾选的去绑定标签的数组
      /* disabled 这个逻辑没问题，必须保留，已和产品确定不要听测试的。
       * 粉丝列表组选的粉丝，某个特定标签非所有粉丝共有，用户反选点击无法判断其意图是维持原有状态还是全部解绑
       */
      let disabled = obj2Bind.every(obj => {
        return this.isBindGroup && obj.label && obj.label.find((label: string) => label === ele.name);
      });
      let select = obj2Bind.every(obj => {
        return obj.label && obj.label.find((label: string) => label === ele.name);
      });
      if (ele.name !== "无标签") {
        tags.push({
          ...ele,
          disabled,
          select
        });
      }
    });
    tags.forEach((v: any) => {
      v.select ? selectTag.push(v.id) : "";
    });
    this.tagfansListInDialog = tags;
    this.selectTagList = selectTag;
  }

  /**
   * @description 选中左边的标签后查询
   * @param 选中的标签ID
   */
  search(id: string | number) {
    this.customQuery.labelId = id;
    this.tableRef.goSearch();
  }
  /**
   * @description 展示全部
   */
  showAll() {
    try {
      delete this.customQuery.labelId;
      this.tableRef.goSearch();
      this.needShowAll = false;
    } catch (e) {
      this.log(e);
    }
  }

  /**
   * @description 绑定标签
   * @param bindLabelIds 页面上选择的tags->ids
   */
  async dialogSaveTag(bindLabelIds: number[]) {
    let params: any = {
      memberIds: this.obj2Bind.map(e => {
        return e.memberUserId;
      }),
      bindLabelIds,
      unbindLabelIds: []
    };
    // 单点、或者多选点击1个
    if (!this.isBindGroup || this.obj2Bind.length === 0) {
      let originNames: string[] = this.obj2Bind[0].label || []; // 文字
      let unBinds: number[] = [];
      const { tagfansListInDialog } = this; // 原始tagList 包含完整json数组
      // 筛选出id
      let originIds: number[] = [];
      tagfansListInDialog.forEach(tag => {
        originNames.indexOf(tag.name) > -1 && originIds.push(tag.id);
      });
      originIds.forEach(curId => {
        bindLabelIds.indexOf(curId) < 0 && unBinds.push(curId);
      });
      params.unbindLabelIds = unBinds;
    }
    try {
      this.labelingVisible = false;
      this.obj2Bind = [];
      await memberLabelBind(params);
      this.tableRef.clearSelection();
      this.showMsg("操作成功");
      this.memberLabelCount();
      this.tableRef.goSearch();
    } catch (e) {
      this.tableRef.goSearch();
      this.log(e);
    }
  }
  // 多选
  selectionChange(val: any[]) {
    let canNotBind: any[] = [];
    let bind: any[] = [];
    val.forEach(row => {
      if (row.concernStatus !== "CONCERN") {
        canNotBind.push(row);
      } else {
        bind.push(row);
      }
    });
    if (canNotBind.length > 0) {
      this.tableRef.toggleSelection(canNotBind, false);
    }
    this.obj2Bind = bind;
  }

  /**
   * @description 获取标签统计数据
   */
  async memberLabelCount() {
    try {
      const { data } = await memberLabelCount();
      let res: LabelListItem[] = [];
      data.labelList &&
        data.labelList.forEach((ele: LabelListItem) => {
          ele.select = false;
          res.push(ele);
        });
      this.fansLabelList = res;
      this.totalCount = data.count || 0;
      this.formatTagfansListInDialog();
    } catch (e) {
      this.log(e);
    }
  }
  created() {
    this.memberLabelCount();
    this.syncStatus();
  }
}
</script>
<style lang='scss' scoped>
@import "./style/fans-share.scss";
</style>

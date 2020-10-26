<template>
  <section>
    <breadcrumb-group :breadGroup="[{label:'权限组管理',to:''}]" />
    <el-admin-table :tableAttrs="groupAttrs"
                    :hasSearchBtn="false"
                    ref="groupTable"
                    :apiFn="apiFn"
                    :formData.sync="userInfo">
      <template slot="search"
                v-if="this.accessIsOpened('PERM:PERMISSION_GROUP:EDIT')">
        <el-form-item prop="name">
          <el-button size="small"
                     type="primary"
                     @click="AddGroupVisible">新增权限组</el-button>
        </el-form-item>
      </template>
    </el-admin-table>
    <el-btn-dialog title="添加成员"
                   :visible.sync="memberDialog"
                   :dialogAttr="{width:'800px'}"
                   :saveLoading="saveMemberLoading"
                   :saveAutoClose="false"
                   @save="saveMember"
                   v-if="memberDialog">
      <el-admin-table ref="memberTable"
                      :filterOut="getTableData"
                      :tableAttrs="memberAttrs"
                      :pagerAttrs.sync="memberPagerAttrs"
                      :formData.sync="subForm"
                      :customQuery="subFormCustomQuery"
                      :apiFn="memberApiFn">
        <template slot="search">
          <el-form-item prop="name">
            <el-input v-model="subForm.name"
                      placeholder="姓名"
                      clearable
                      size="small" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="subForm.account"
                      placeholder="账户"
                      clearable
                      size="small" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="subForm.phone"
                      placeholder="手机"
                      clearable
                      size="small" />
          </el-form-item>
        </template>
      </el-admin-table>
    </el-btn-dialog>
    <add-group :visible.sync="addVisible"
               :subForm.sync="addSubForm"
               :submitLoading="addGroupLoading"
               label="权限组名称"
               placeholder="请输入权限组名称"
               :title="isEditGroupId !== ''?'编辑权限组':'新增权限组'"
               @save="saveGroup">
    </add-group>
    <el-btn-dialog :visible.sync="groupTreeVisible"
                   title="配置权限"
                   :saveAutoClose="false"
                   :saveLoading="saveGroupSetLoading"
                   @save="saveGroupTree"
                   v-if="groupTreeVisible"
                   :dialogAttr="{width:'400px'}">
      <div v-loading="groupTreeLogin">
        <el-tree :data="groupTreeList"
                 :props="{label:'name'}"
                 :default-checked-keys="groupDefaultKeys"
                 node-key="id"
                 show-checkbox
                 @check-change="checkChange"
                 ref="groupTreeRef">
        </el-tree>
      </div>

    </el-btn-dialog>
  </section>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import AddGroup from "@/components/tag-collapse/addTag.vue";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import {
  access_save_api,
  access_getAcGroups_api,
  access_edit_api,
  access_getGroupUserList_api,
  access_addOrRemoveUser_api,
  access_delete_api,
  access_getAcTree_api,
  access_savePermission_api
} from "@/api";
import { userRoleConfig } from "@/const";
import { roleInfoSetting, storeInfoSetting, filterUser } from "@/utils/userSetting";

interface SubForm {
  name: string;
  account: string;
  phone: string;
}

@Component({
  components: {
    AddGroup,
    ElBtnDialog
  }
})
export default class AccessGroup extends Vue {
  @Ref() readonly groupTable: any;
  @Ref() readonly memberTable: any;
  @Ref() readonly groupTreeRef: any;

  private addGroupLoading: boolean = false;
  private saveGroupSetLoading: boolean = false;
  private groupTreeLoading: boolean = false;
  private saveMemberLoading: boolean = false;
  private apiFn: any = access_getAcGroups_api;
  private memberApiFn: any = access_getGroupUserList_api;
  private getMemberTableData: any = []; // 添加成员表格数据
  private userInfo: any = {};
  private addVisible: boolean = false;
  private isEditGroupId: number | string = "";
  private groupTreeVisible: boolean = false;
  private groupTreeList: any = []; // 树形结构值
  private groupDefaultKeys: Array<number> = []; // 树形结构默认值
  private groupId: number; // 配置权限选中的组id
  private groupTreeLogin: boolean = false; // 配置权限选中的组id
  private checkParent: any = []; // 用于 编辑和查看联动
  private needFullArr: any[] = []; // 用于翻页后 数据填充
  private addSubForm = {
    name: ""
  };
  private groupAttrs = {
    border: true,
    columns: [
      {
        prop: "name",
        col: {
          width: "200px"
        },
        label: "权限组名称"
      },
      {
        prop: "groupUserNames",
        label: "所属成员",
        formatter: (row: any) => row.groupUserNames.join() || "—"
      },
      {
        type: "operation",
        col: {
          width: "220px"
        },
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "编辑",
            atClick: (row: any) => this.editGroupVisible(row),
            show: (row: any) => this.accessIsOpened("PERM:PERMISSION_GROUP:EDIT") && !row.builtin
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "配置权限",
            atClick: (row: any) => this.groupTreeShow(row),
            show: (row: any) => this.accessIsOpened("PERM:PERMISSION_GROUP:EDIT") && !row.builtin
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "添加成员",
            atClick: (row: any) => this.rowAddMembers(row),
            show: (row: any) => this.accessIsOpened("PERM:PERMISSION_GROUP:EDIT")
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "删除",
            atClick: (row: any) => this.deleteGroup(row.id),
            show: (row: any) => this.accessIsOpened("PERM:PERMISSION_GROUP:EDIT") && !row.builtin
          }
        ]
      }
    ]
  };
  private subForm: SubForm = {
    name: "",
    account: "",
    phone: ""
  };
  private subFormCustomQuery = {
    groupId: "",
    channel: ""
  };
  readonly memberPagerAttrs = {
    "page-size": 5,
    "page-sizes": [5, 10, 20]
  };
  readonly memberAttrs: any = {
    border: true,
    columns: [
      {
        prop: "name",
        label: "姓名"
      },
      {
        prop: "account",
        label: "账号"
      },
      {
        prop: "phone",
        label: "手机"
      },
      {
        prop: "position",
        label: "职位",
        formatter: (row: any) => row.position || "空"
      },
      {
        prop: "msg",
        label: "状态",
        render: (h: any, row: any) =>
          h("div", [
            h("span", {
              class: row.addFlag ? "dot dot2" : "dot dot5"
            }),
            h("span", row.addFlag ? "已添加" : "未添加")
          ])
      },

      {
        type: "operation",
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.adminFlag
              };
            },
            show: (row: any) => !row.addFlag,
            text: "添加",
            atClick: (row: any) => this.memberSetGroup(row)
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.adminFlag
              };
            },
            show: (row: any) => row.addFlag,
            text: "移除",
            atClick: (row: any) => this.memberSetGroup(row)
          }
        ]
      }
    ]
  };
  private memberDialog: boolean = false;

  /**
   * @description 配置权限
   */
  private checkChange(currentNode: any, status: any) {
    let { parentId, keywords, type } = currentNode;
    // 列表中所选中的keys-用于等会push
    let _nodes = this.groupTreeRef.getCheckedKeys();
    // 选中编辑-就自动选中查看
    if (parentId && status && type === 1 && !keywords.includes("VIEW")) {
      let editId = this._setSysPlat(parentId, "VIEW");
      editId && _nodes.push(editId);
      if (editId) {
        this.groupTreeRef.setCheckedKeys(_nodes);
      }
    }
    // 如果选中了编辑-查看不能取消
    if (!status && keywords && keywords.includes("VIEW")) {
      this._filterId(this.groupTreeList, parentId);
      let _checkParentItem = this.checkParent.find((m: any) => !m.keywords.includes("VIEW"));
      let editId = _checkParentItem && _checkParentItem.id;
      if (_nodes.includes(editId)) {
        this.showMsg("已选择操作权限，不可单独取消查看", "warning");
        // 如果有编辑权限 -保持不动
        let viewId = this._setSysPlat(parentId, "VIEW");
        viewId && _nodes.push(viewId) && this.groupTreeRef.setCheckedKeys(_nodes);
      }
    }
  }
  private _setSysPlat(parentId: number, type: string): number {
    this._filterId(this.groupTreeList, parentId);
    let _checkParentItem = this.checkParent.find((m: any) => m.keywords && m.keywords.includes(type));
    let editId = _checkParentItem && _checkParentItem.id;
    return editId;
  }
  private _filterId(arr: any, id: number): any {
    arr.forEach((v: any) => {
      if (v.children && v.children.length > 0) {
        if (v.id === id) {
          this.checkParent = v.children;
        } else if (v.id !== id) {
          this._filterId(v.children, id);
        }
      }
    });
  }
  // 打开配置权限
  private groupTreeShow({ id }: any) {
    this.groupTreeVisible = true;
    this.groupId = id;
    this.groupDefaultKeys = [];
    this._groupTreeGetDataApi(id);
  }
  private async _groupTreeGetDataApi(id: number | string) {
    this.groupTreeLogin = true;
    try {
      let { data } = await access_getAcTree_api({ ...this.userInfo, id });
      let _ids: Array<number> = [];
      // 后端给的id不唯一，前端自己处理成了唯一id
      const fn = (data: any, prefix: number | string) => {
        data.forEach((v: any) => {
          if (v.children && v.children.length > 0) {
            v.id = `${prefix}-${v.id}`;
            v.children.forEach((c: any) => {
              c.parentId = v.id;
            });
            fn(v.children, prefix);
          }
        });
      };
      // 为了找到所有的默认key
      data.forEach((g: any) => {
        g.checkedKeywords && g.checkedKeywords.length > 0 && _ids.push(...g.checkedKeywords);
        const prefix = g.id;
        g.id = `0-${prefix}`;
        fn(g.children, prefix);
      });
      // 给树赋值
      this.groupTreeList = data;
      // 通过遍历默认的keys 来筛选默认选中的id
      _ids.forEach((k: any) => {
        this._checkId(this.groupTreeList, k);
      });
      this.groupTreeLogin = false;
    } catch (error) {
      this.log(error);
    }
  }
  // 前端自己通过keys遍历出 默认选中的id
  private _checkId(arr: any, k: string) {
    arr.forEach((v: any) => {
      if (v.keywords === k) {
        this.groupDefaultKeys.push(v.id);
      } else if (v.children && v.children.length > 0) {
        this._checkId(v.children, k);
      }
    });
  }

  // 保存权限组
  private saveGroupTree() {
    // 只需要传给后端最后一层的数据-所以做了下过滤
    let nodes = this.groupTreeRef.getCheckedNodes().filter((e: any) => e.type === 1);
    let ids: any = [];
    nodes.forEach((v: any) => {
      ids.push(v.id);
    });
    this._saveGroupTreeApi(ids);
  }
  private async _saveGroupTreeApi(ids: Array<number>) {
    let userId = storeInfoSetting.getInfo().userId;
    let params = { groupId: this.groupId, permissionIds: ids, userId };
    this.saveGroupSetLoading = true;
    try {
      await access_savePermission_api(params);
      this.showMsg("权限配置成功");
      this.saveGroupSetLoading = false;
      this.groupTreeVisible = false;
      this.groupTable.goSearch();
    } catch (error) {
      this.saveGroupSetLoading = false;
      this.log(error);
    }
  }

  /**
   * @description 成员操作
   */
  // 获取添加成员弹窗表格中的数据
  private getTableData(data: any) {
    // 处理翻页以后数据没有被保存
    data = data.map((item: any) => {
      let obj = this.needFullArr.find((val: any) => val.id === item.id);
      item = obj || item;
      return item;
    });
    this.getMemberTableData = data;
    return data;
  }
  // 保存添加成员
  private async saveMember(isAdd: boolean = true) {
    let _addMember: Array<number | string> = [];
    let _removeMember: Array<number | string> = [];
    this.needFullArr.forEach((m: any) => {
      if (m.hasOwnProperty("isSet") && m.hasOwnProperty("isDefault")) {
        if (m.isDefault === m.addFlag) {
          m.isSet ? _addMember.push(m.id) : _removeMember.push(m.id);
        }
      }
    });
    // 如果数据没有变化不请求接口 直接关闭
    if (_addMember.length <= 0 && _removeMember.length <= 0) {
      this.memberDialog = false;
      return;
    }
    let params = { id: this.subFormCustomQuery.groupId, addUserIds: _addMember, removeUserIds: _removeMember };
    try {
      await access_addOrRemoveUser_api(params);
      this.showMsg("操作成功");
      this.memberDialog = false;
      this.needFullArr = [];
      this.groupTable.goSearch();
    } catch (error) {
      this.log(error);
    }
  }

  // 在表格里面添加成员
  private rowAddMembers(row: any) {
    this.subFormCustomQuery.groupId = row.id;
    this.needFullArr = [];
    this.subForm = {
      name: "",
      account: "",
      phone: ""
    };
    this.memberDialog = true;
  }
  /**
   * @description 将成员添加进权限组
   * @params 是新增还是移除
   */
  private async memberSetGroup(row: any) {
    // 已添加- 是去移除
    if (row.addFlag) {
      this._setRowItem(row, false);
    } else {
      this._setRowItem(row, true);
    }
  }
  private _setRowItem(row: any, val: boolean) {
    row.isSet = val;
    row.addFlag = val;
    if (!row.hasOwnProperty("isDefault")) {
      row.isDefault = row.addFlag;
    }

    if (this.needFullArr.length > 0) {
      let _flag = this.needFullArr.findIndex((item: any) => {
        return row.id === item.id;
      });
      _flag === -1 ? this.needFullArr.push(row) : this.needFullArr.splice(_flag, 1);
    } else {
      this.needFullArr.push(row);
    }
  }

  /**
   * @description 新增编辑 权限组
   */
  private editGroupVisible(row: any) {
    this.isEditGroupId = row.id;
    this.addVisible = true;
    this.addSubForm.name = row.name;
  }
  private AddGroupVisible() {
    this.isEditGroupId = "";
    this.addVisible = true;
    this.addSubForm.name = "";
  }
  private async saveGroup(name: string) {
    this.addGroupLoading = true;
    this.isEditGroupId !== "" ? this._editGroupApi(name) : this._saveGroupApi(name);
  }
  // 新增权限组api
  private async _saveGroupApi(name: string) {
    try {
      await access_save_api({ ...this.userInfo, name });
      this.showMsg("新增成功");
      this.addGroupLoading = false;
      this.groupTable.goSearch();
    } catch (error) {
      this.addGroupLoading = false;
      this.log(error);
    }
  }
  // 编辑权限组api
  private async _editGroupApi(name: string) {
    try {
      await access_edit_api({ ...this.userInfo, name, id: this.isEditGroupId });
      this.showMsg("编辑成功");
      this.addGroupLoading = false;
      this.groupTable.goSearch();
    } catch (error) {
      this.addGroupLoading = false;
      this.log(error);
    }
  }
  // 删除权限组api
  private deleteGroup(id: string | number) {
    this.deleteconfirm(() => {
      this._deleteGroupApi(id);
    });
  }
  private async _deleteGroupApi(id: string | number) {
    try {
      await access_delete_api(id);
      this.showMsg("删除成功");
      this.groupTable.goSearch();
    } catch (error) {
      this.log(error);
    }
  }

  created() {
    let { channelId } = storeInfoSetting.getInfo();
    let channel = filterUser().channel;
    this.userInfo = { channelId, channel };
    this.subFormCustomQuery.channel = channel;
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-input {
    width: 140px;
  }
}
</style>

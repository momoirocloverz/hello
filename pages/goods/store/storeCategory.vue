<template>
  <!-- 商品类目 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'商品类目'}]" />
    <el-row :gutter="20">
      <el-col :span="8">
        <storeClassPanel :infoList.sync="oneInfoList"
                         title="1级类目"
                         :parentId="oneParentId"
                         :hasAdd="true"
                         :hasEdit="true"
                         :hasDelete="true"
                         :queryModelSearchAsync="oneQueryModelSearchAsync"
                         :selectItem="oneHandleSelect"
                         :loading="oneLoading"
                         @addSuc="addSuc"></storeClassPanel>
      </el-col>
      <el-col :span="8">
        <storeClassPanel :infoList.sync="twoInfoList"
                         title="2级类目"
                         :parentId="twoParentId"
                         :levelId="2"
                         :hasAdd="true"
                         :hasEdit="true"
                         :hasDelete="true"
                         :disabled="twoDisabled"
                         :queryModelSearchAsync="twoQueryModelSearchAsync"
                         :selectItem="twoHandleSelect"
                         :loading="twoLoading"
                         :selectOneName="selectOneName"
                         @addSuc="addSuc"></storeClassPanel>
      </el-col>
      <el-col :span="8">
        <storeClassPanel :infoList.sync="threeInfoList"
                         title="3级类目"
                         :parentId="threeParentId"
                         :levelId="3"
                         :hasAdd="true"
                         :hasEdit="true"
                         :hasDelete="true"
                         :disabled="threeDisabled"
                         :selectItem="threeHandleSelect"
                         :queryModelSearchAsync="threeQueryModelSearchAsync"
                         :loading="threeLoading"
                         :selectOneName="selectOneName"
                         :selectTwoName="selectTwoName"
                         @addSuc="addSuc"></storeClassPanel>
      </el-col>
    </el-row>

  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import StoreClassPanelMixin from "./mixins/storeClassPanel.mixin";

export default class StoreCategory extends mixins(StoreClassPanelMixin) { }
</script>
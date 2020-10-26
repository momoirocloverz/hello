<template>
  <div class="not_found">
    <span>page not found</span>
    <div class="btn">
      <router-link :to="{ path: '/' }" class="el-link el-link--primary">
        返回首页
      </router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.not_found {
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.85);
  color: #fff;
  text-align: center;
  padding-top: 15%;
}
span {
  font-size: 20px;
}
.el-link {
  border: 1px solid rgba(0, 0, 0, 0.6);
  background: rgba(136, 136, 136, 0.6);
  border-radius: 20px;
  padding: 10px 30px;
  margin-top: 15px;
  color: #fff;
}
</style>

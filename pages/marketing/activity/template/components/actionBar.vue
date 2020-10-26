<template>
  <div class="actionBar">
    <a href="javascript:void(0)"
       title="放大"
       @click="kitScaleUp()"><i class="el-icon-zoom-in
"></i></a>
    <a href="javascript:void(0)"
       title="缩小"
       @click="kitScaleDown()"><i class="el-icon-zoom-out"></i></a>
    <a href="javascript:void(0)"
       title="还原"
       @click="kitScaleInit()"><i class="el-icon-search"></i></a>
  </div>
</template>

<script>
export default {
  name: 'actionBar',
  props: [],
  methods: {
    kitScaleUp() {
      this.$emit('kitScaleUp')
    },
    kitScaleDown() {
      this.$emit('kitScaleDown')
    },
    kitScaleInit() {
      this.$emit('kitScaleInit')
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.actionBar {
  background: #fff;
  box-shadow: 0 0 10px #ccc;
  border-radius: 5px;
  position: absolute;
  width: 30px;
  display: flex;
  flex-direction: column;
  right: 20px;
  top: 45%;

  a {
    color: #999;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 10px;

    &:active {
      opacity: 0.8;
    }

    &:after {
      content: "";
      width: 20px;
      height: 1px;
      background: #ccc;
      position: absolute;
      left: 5px;
      bottom: 0;
    }

    i {
      font-size: 18px;
    }

    &:last-child {
      &:after {
        content: none;
      }
    }

    &:hover {
      color: #708fd4;
    }
  }
}
</style>

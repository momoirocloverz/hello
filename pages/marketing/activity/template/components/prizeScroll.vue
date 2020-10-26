<template>
  <div class="onPrize_wrapper"
       :style="{background:bgColor}">
    <ul v-if="list.length !== 0"
        :class="`onPrize_list ${animate ? 'anim':''}`">
      <li class="
            prizeInfos"
          v-for="(prizes,idx) in list"
          :key="idx">
        <img :src="prizes.userAvatar" />
        <p class="des"
           :style="{color:color}">{{prizes.userName}}抽中了{{prizes.prizeName}}</p>
      </li>
    </ul>
    <ul v-else
        class="onPrize_list">
      <li class="prizeInfos">
        <p class="des">&nbsp;暂无中奖记录，快来做第一人吧！&nbsp;</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'guide',
  components: {},
  props: ['onPrizeList', 'bgColor', 'color'],
  data() {
    return {
      animate: false,
      list: [{
        userAvatar:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAACpklEQVR4Xu2WMUhbURSGTxppBpFKllICgiRTxKXUoXQJbensIDjpok5uHXTr0K2LWyd1sVAQHFxbqrjUxVIH0SlBHUJwiVopNqJV7oMTjtfz4js+MQn8Ge+7ue/c737nfzcx9Y0uCb8bBBIAo1sBMCHdAjAAYwtSGANjYIyNAIyx8ULGwBgYYyMAY2y8kDEwBsbYCMAYGy9kDIyBMTYCMMbGCxkDY2CMjQCMsfFCxsAYGGMjcN/GvH+1TU878+qyx7UyLW6NUqm6Su9yH6nQO03JxONg7sHfHZr52Rep+IkXPyiXfqPOrV2c0PLOJP2ufAmey3ouLs9obfcTfS9+iPQebdKdMyYKmGy6cA0KF1CsrtDsr7e3Fh0VjFaLD+7Wl3kT7gzGf1E2/ZqG+xfoSSpDG+V5Wtoer58iWzLUN0cDmTGKUzRDYLhspKvHWVKqrtXriHoA92qMvxifLkPQQD1/NkKD+c+USnYF8Hq6XwbtKEHxOho8BitbVRvjNeS8phjDG+54lKr3tjbmw9qsfL12uvtH60Hr8enLjNBAu3n+gbgxDVZTwGjF+Yq7TWqbk+317/xP0IpaC4RtlltLhnpLgPHbw2WL+0UxhufK8NT0l0B9aC1rTFigasA0WP6nVssWzT5uDS1PNFgP3kqaylyE/0yDyGPu7nH+vxYEs3/XaRSmLflVCmsjBsOb9k+L20H+340dnu4Fn3N5QWvURm5d+Vy+J86VwK0T6x7TSPEwOAxFbkjmClvGG3PryE8855KE4MOJCyU2GGvfttP8WMa000attQJMCDGAARhbM8EYGANjbARgjI0XMgbGwBgbARhj44WMgTEwxkYAxth4IWNgDIyxEYAxNl7IGBgDY2wEYIyNFzIGxsAYGwEYY+OFjIExNmOuAM3okPmFqy0JAAAAAElFTkSuQmCC',
        userName: '张三',
        prizeName: '300元现金券'
      },
      {
        userAvatar:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAACpklEQVR4Xu2WMUhbURSGTxppBpFKllICgiRTxKXUoXQJbensIDjpok5uHXTr0K2LWyd1sVAQHFxbqrjUxVIH0SlBHUJwiVopNqJV7oMTjtfz4js+MQn8Ge+7ue/c737nfzcx9Y0uCb8bBBIAo1sBMCHdAjAAYwtSGANjYIyNAIyx8ULGwBgYYyMAY2y8kDEwBsbYCMAYGy9kDIyBMTYCMMbGCxkDY2CMjQCMsfFCxsAYGGMjcN/GvH+1TU878+qyx7UyLW6NUqm6Su9yH6nQO03JxONg7sHfHZr52Rep+IkXPyiXfqPOrV2c0PLOJP2ufAmey3ouLs9obfcTfS9+iPQebdKdMyYKmGy6cA0KF1CsrtDsr7e3Fh0VjFaLD+7Wl3kT7gzGf1E2/ZqG+xfoSSpDG+V5Wtoer58iWzLUN0cDmTGKUzRDYLhspKvHWVKqrtXriHoA92qMvxifLkPQQD1/NkKD+c+USnYF8Hq6XwbtKEHxOho8BitbVRvjNeS8phjDG+54lKr3tjbmw9qsfL12uvtH60Hr8enLjNBAu3n+gbgxDVZTwGjF+Yq7TWqbk+317/xP0IpaC4RtlltLhnpLgPHbw2WL+0UxhufK8NT0l0B9aC1rTFigasA0WP6nVssWzT5uDS1PNFgP3kqaylyE/0yDyGPu7nH+vxYEs3/XaRSmLflVCmsjBsOb9k+L20H+340dnu4Fn3N5QWvURm5d+Vy+J86VwK0T6x7TSPEwOAxFbkjmClvGG3PryE8855KE4MOJCyU2GGvfttP8WMa000attQJMCDGAARhbM8EYGANjbARgjI0XMgbGwBgbARhj44WMgTEwxkYAxth4IWNgDIyxEYAxNl7IGBgDY2wEYIyNFzIGxsAYGwEYY+OFjIExNmOuAM3okPmFqy0JAAAAAElFTkSuQmCC',
        userName: '李四',
        prizeName: '行车记录仪'
      }]
    }
  },
  created() {
    window.clearInterval()
    setInterval(this.onPrizeScroll, 6000)
  },
  watch: {
    onPrizeList(newVal, oldVal) {
      console.log(newVal)
      this.start(newVal)
    }
  },
  methods: {
    start(val) {
      this.list = this.list.concat(val)
    },
    onPrizeScroll() {
      if (this.list.length > 1) {
        this.animate = true // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
        setTimeout(() => { //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
          this.list.push(this.list[0]) // 将数组的第一个元素添加到数组的
          this.list.shift() // 删除数组的第一个元素
          this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, 3000)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.onPrize_wrapper {
  background: rgba(1, 1, 1, 0.2);
  display: inline-block;
  height: 55px;
  padding: 0 7px;
  overflow: hidden;
  border-radius: 54px;
  width: max-content;
  margin: 0 auto;

  .onPrize_list {
    &.anim {
      transition: all 0.5s;
      margin-top: -55px;
    }

    .prizeInfos {
      display: flex;
      align-items: center;
      top: 0px;
      position: relative;
      height: 55px;
      padding-right: 3px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .des {
        font-size: 24px;
        color: #fff;
      }
    }
  }
}
</style>

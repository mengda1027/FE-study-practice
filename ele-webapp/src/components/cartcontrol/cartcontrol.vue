<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease" v-show="food.count>0" @click.stop="decreaseCart" transition="move">
        <span class="icon-remove_circle_outline inner"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="increase icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 小球抛物线动画
        this.$emit('add', event.target)
      },
      decreaseCart (event) {
        if (!event._constructed || this.food.count <= 0) {
          return
        }
        this.food.count--
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0px
    .decrease
      display inline-block
      padding-right 6px
      .inner
        display inline-block
        color rgb(0, 160, 220)
        line-height 24px
        font-size 24px
      &.move-enter-active, &.move-leave-active
        transition all .4s linear
        opacity 1
        transform translate3d(0, 0, 0)
        .inner
          transition all .4s linear
          transform rotate(0)
      &.move-enter, &.move-leave-to
        opacity 0
        transform translate3d(48px, 0, 0)
        .inner
          transform rotate(180deg)
    .count
      display inline-block
      color rgb(147, 153, 159)
      font-size 10px
      vertical-align top
      text-align center
      line-height 24px
    .increase
      display inline-block
      padding-left 6px
      color rgb(0, 160, 220)
      line-height 24px
      font-size 24px
</style>

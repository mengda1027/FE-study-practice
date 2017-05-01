<template>
  <transition name="moveLeft">
    <div class="food" v-show="showFood" ref="foodScroll">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image">
          <i class="icon-arrow_lift icon" @click="back"></i>
        </div>
        <div class="content">
          <h1 class="name">{{food.name}}</h1>
          <div class="extra">
            <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="newPrice"><span class="unit">￥</span>{{food.price}}</span><span class="oldPrice"
                                                                                         v-show="food.oldPrice !== ''"><span
            class="unit">￥</span>{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper" v-show="food.count !== 0">
            <cartcontrol @add="_drop" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="food.count === 0 || !food.count" @click.stop.prevent="addFirst($event)">加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.ratings"></split>
        <div class="rating-wrapper">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="select" @toggle="toggle" :ratings="food.ratings" :only-content="onlyContent" :desc="desc"
                        :select-type="selectType"></ratingselect>
          <div class="rating-list">
            <ul v-show="food.ratings && food.ratings.length !== 0">
              <li class="item" v-for="rating in food.ratings" v-show="needShow(rating.rateType , rating.text)">
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <div class="user">
                  <span class="name">{{rating.username}}</span><img :src="rating.avatar" class="avatar">
                </div>
                <div class="item-content">
                  <i :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></i>
                  <span class="text">{{rating.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-text" v-show="!food.ratings || food.ratings.length === 0">暂无内容</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '@/components/cartcontrol/cartcontrol.vue'
  import split from '@/components/split/split.vue'
  import ratingselect from '@/components/ratingselect/ratingselect.vue'
  import {dateFormat} from '@/common/js/dateFormat.js'

  const ALL = 2

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFood: false,
        // 是否选择全部评价
        selectType: ALL,
        // 是否显示只有评论的评价
        onlyContent: false,
        desc: {
          positive: '推荐',
          negative: '吐槽',
          all: '全部'
        }
      }
    },
    methods: {
      _drop (el) {
        this.$emit('add', el)
      },
      // 控制每条评价是否显示
      needShow (rateType, text) {
        if (this.selectType === ALL) {
          if (this.onlyContent) {
            return text.length !== 0
          } else {
            return true
          }
        }
        if (this.onlyContent && text.length === 0) {
          return false
        }
        return rateType === this.selectType
      },
      // 添加第一份
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        Vue.set(this.food, 'count', 1)
        // 小球抛物线动画
        this.$emit('add', event.target)
      },
      show () {
        this.showFood = true
        // 初始化ratings的"是否选择全部"\"是否只显示有内容的评价"
        this.onlyContent = true
        this.selectType = ALL
        this.$nextTick(() => {
          if (!this.foodScroll) {
            this.foodScroll = new BScroll(this.$refs.foodScroll, {
              click: true
            })
          } else {
            this.foodScroll.refresh()
          }
        })
      },
      back () {
        this.showFood = false
      },
      select (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.foodScroll.refresh()
        })
      },
      toggle (onlyContent) {
        this.onlyContent = onlyContent
        this.$nextTick(() => {
          this.foodScroll.refresh()
        })
      }
    },
    filters: {
      formatDate (time) {
        return dateFormat(new Date(time), 'yyyy-MM-dd HH:mm:ss')
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position fixed
    top 0px
    bottom 48px
    width 100%
    background-color rgb(255, 255, 255)
    overflow hidden
    &.moveLeft-enter-active, &.moveLeft-leave-active
      transition all 0.2s linear
      transform translate3d(0, 0, 0)
    &.moveLeft-enter, &.moveLeft-leave-to
      transform translate3d(100%, 0, 0)
    .food-content
      .img-header
        position relative
        width 100%
        height 0
        padding-bottom 100%
        img
          position absolute
          top 0px
          left 0px
          width 100%
          height 100%
        .icon
          position absolute
          padding 10px
          top 10px
          left 10px
          font-size 20px
          color rgb(255, 255, 255)
      .content
        position relative
        padding 18px
        .name
          font-weight 700
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
          margin-bottom 8px
        .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
          margin-bottom 18px
        .extra > span:first-child
          margin-right 12px
        .price
          font-weight 700
          .unit
            font-size 10px
          .newPrice
            line-height 24px
            font-size 14px
            color rgb(240, 20, 20)
            margin-right 8px
          .oldPrice
            text-decoration line-through
            line-height 24px
            font-size 10px
        .buy
          position absolute
          box-sizing border-box
          bottom 18px
          right 18px
          height 24px
          line-height 12px
          padding 6px 12px
          color rgb(255, 255, 255)
          font-size 10px
          border-radius 12px
          background-color rgb(0, 160, 220)
          &.fade-enter-active, &.fade-leave-active
            transition all 0.2s linear
            opacity 1
          &.fade-enter, &.fade-leave-to
            opacity 0
        .cartcontrol-wrapper
          position absolute
          bottom 18px
          right 18px
      .info
        padding 18px
        .title
          font-size 14px
          line-height 14px
          color rgb(7, 17, 27)
          margin-bottom 6px
        .text
          padding 0px 8px
          line-height 24px
          color rgb(77, 85, 93)
          font-weight 200
          font-size 12px
      .rating-wrapper
        .title
          font-size 14px
          line-height 14px
          color rgb(7, 17, 27)
          margin-top 18px
          margin-left 18px
        .rating-list
          padding 0px 18px
          color rgb(147, 153, 159)
          line-height 12px
          .item
            position relative
            padding-bottom 16px
            margin-top 16px
            height 34px
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              no-border()
            .time
              margin-bottom 6px
              font-size 10px
            .user
              position absolute
              top 0px
              right 0px
              .name
                font-size 10px
                display inline-block
                vertical-align top
              .avatar
                display inline-block
                width 12px
                height 12px
                border-radius 50%
                margin-left 6px
            .item-content
              margin-bottom 16px
              font-size 12px
              .text
                line-height 16px
                color rgb(7, 17, 27)
              i
                margin-right 4px
                &.icon-thumb_up
                  color rgb(0, 160, 220)
          .no-text
            padding 16px 0
            font-size 12px
</style>

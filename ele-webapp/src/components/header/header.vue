<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="supports-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background-blur">
      <img :src="seller.avatar" alt="bg-blur">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="supports" v-if="seller.supports">
              <li v-for="support in seller.supports">
                <span class="icon" :class="classMap[support.type]"></span>
                <span class="text">{{support.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .header
    color: #fff
    font-size: 0
    position relative
    background rgba(7, 17, 27, 0.5)
    overflow: hidden
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0px 8px
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
        .supports
          margin: 10px 0px 2px
          line-height: 12px
          font-size: 10px
          .icon
            display: inline-block
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            vertical-align: top
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
      .supports-count
        position: absolute
        bottom: 18px
        right: 12px
        height: 24px
        line-height: 24px
        background-color: rgba(0, 0, 0, 0.2)
        padding: 0px 8px
        font-size: 10px
        border-radius: 24px
        .icon-keyboard_arrow_right
          margin-left: 2px
          font-size: 10px
          line-height: 24px
    .bulletin-wrapper
      height: 28px
      line-height 28px
      padding: 0px 22px 0px 12px
      position: relative
      background-color: rgba(7, 17, 27, 0.2)
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      .bulletin-icon
        bg-image('bulletin')
        display: inline-block
        width: 22px
        height: 12px
        background-size: 22px 12px
        background-repeat: no-repeat
        vertical-align: top
        position relative
        top 8px
      .bulletin-text
        vertical-align: top
        margin 0px 4px
        font-size 10px
      .icon-keyboard_arrow_right
        font-size: 10px
        position: absolute
        right: 12px
        line-height 28px
    .background-blur
      width 100%
      position absolute
      top 0px
      left 0px
      z-index -1
      overflow hidden
      filter blur(10px)
      img
        width 100%
    .detail
      position fixed
      top 0px
      left 0px
      overflow auto
      width 100%
      height 100%
      z-index 100
      background rgba(7, 17, 27, 0.8)
      backdrop-filter blur(10px)
      &.fade-enter-active, &.fade-leave-active
        transition all 0.5s
        opacity 1
        background rgba(7, 17, 27, 0.8)
      &.fade-enter,&.fade-leave-to
        opacity 0
        background rgba(7, 17, 27, 0)
      .detail-wrapper
        width 100%
        min-height 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          font-size 14px
          text-align center
          .name
            font-weight 700
            font-size 16px
            line-height 16px
          .star-wrapper
            margin-top 16px
            margin-bottom 28px
            height 24px
            line-height 24px
          .title
            display flex
            position relative
            margin 28px auto 24px
            width 80%
            .line
              position relative
              border-bottom 1px solid rgba(255,255,255,0.2)
              flex 1
              top -6px
            .text
              padding 0px 12px
              font-size 14px
              font-weight 700
              line-height 14px
          .supports
            width 80%
            font-size: 12px
            margin 0px auto 28px
            li
              padding 0px 12px
              height 16px
              line-height 16px
              text-align left
              margin-bottom 12px
              &:last-child
                margin-bottom 0px
              .icon
                display: inline-block
                width: 16px
                height: 16px
                margin-right 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                vertical-align: top
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
          .bulletin
            width 80%
            margin 0px auto
            font-size 12px
            .content
              text-align left
              padding 0px 12px
              line-height 24px
      .detail-close
        position relative
        margin -64px auto 0px auto
        height 32px
        width 32px
        .icon-close
          display inline-block
          font-size 32px
          color rgba(255, 255, 255, 0.5)
</style>

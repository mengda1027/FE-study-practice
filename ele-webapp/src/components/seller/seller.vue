<template>
  <div class="seller" v-el:seller-scroll>
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
          </div>
          <span class="rating-count">（{{seller.ratingCount}}）</span>
          <span class="sell-count">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>
              <span class="unit">元</span>
            </div>
          </li>
          <li class="block">
            <h2 class="title">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>
              <span class="unit">元</span>
            </div>
          </li>
          <li class="block">
            <h2 class="title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>
              <span class="unit">分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <h2 class="icon-favorite" :class="{'active':isFavorite}"></h2>
          <div class="text">{{favoriteText}}</div>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="supports" v-if="seller.supports">
          <li v-for="support in seller.supports" class="supportItem">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list>
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120px" height="90px">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <div class="title">商家信息</div>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star.vue'
  import BScroll from 'better-scroll'
  import split from 'components/split/split.vue'
  import {saveToLocal, loadFromLocal} from 'common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split
    },
    data () {
      return {
        isFavorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    watch: {
      // this.seller为异步请求，监测当this.seller请求完毕（发生变化）时被触发
      'seller' () {
        this._initScroll()
        this._initPic()
      }
    },
    // 切换到‘商家’tab页时，创建组件，被触发
    ready () {
      this._initScroll()
      this._initPic()
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    computed: {
      favoriteText () {
        return this.isFavorite ? '已收藏' : '收藏'
      }
    },
    methods: {
      toggleFavorite (event) {
        if (!event._constructed) {
          return
        }
        this.isFavorite = !this.isFavorite
        saveToLocal(this.seller.id, 'favorite', this.isFavorite)
      },
      _initScroll () {
        if (!this.sellerScroll) {
          this.sellerScroll = new BScroll(this.$els.sellerScroll, {
            click: true
          })
        } else {
          this.sellerScroll.refresh()
        }
      },
      _initPic () {
        if (this.seller.pics) {
          let picWidth = 120
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length - margin
          this.$els.picList.style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$els.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position absolute
    top 174px
    bottom 0px
    overflow hidden
    width 100%
    .seller-content
      .overview
        padding 18px
        position relative
        color rgb(7, 17, 27)
        .title
          font-size 14px
          line-height 14px
          margin-bottom 8px
        .desc
          font-size 0px
          padding-bottom 18px
          border-1px(rgba(7, 17, 27, 0.1))
          .star-wrapper
            display inline-block
            height 18px
            line-height 18px
          .rating-count, .sell-count
            font-size 10px
            color rgb(77, 85, 93)
            line-height 18px
            display inline-block
            vertical-align top
          .rating-count
            margin 0px 8px 0px 8px
        .remark
          display flex
          .block
            flex 1
            margin-top 18px
            border-right 1px solid rgba(7, 17, 27, 0.1)
            &:last-child
              border-right none
            .title
              font-size 10px
              line-height 10px
              color rgb(147, 153, 159)
              margin-bottom 4px
              text-align center
            .content
              font-size 0px
              text-align center
              .stress
                font-size 24px
                font-weight 200
                line-height 24px
                display inline-block
                vertical-align bottom
              .unit
                font-size 10px
                font-weight 200
                line-height 14px
                display inline-block
                vertical-align bottom
        .favorite
          width 36px
          position absolute
          top 18px
          right 18px
          text-align center
          .icon-favorite
            font-size 24px
            line-height 24px
            margin-bottom 4px
            color #d4d6d9
            &.active
              color rgb(240, 20, 20)
          .text
            color rgb(77, 85, 93)
            font-size 10px
            line-height 10px
      .bulletin
        padding 18px 18px 0px 18px
        position relative
        color rgb(7, 17, 27)
        .title
          font-size 14px
          line-height 14px
          margin-bottom 8px
        .content-wrapper
          padding 0px 12px 16px
          border-1px(rgba(7, 17, 27, 0.1))
          .content
            color rgb(240, 20, 20)
            font-size 12px
            line-height 24px
            font-weight 200
        .supports
          font-size: 0px
          .supportItem
            padding 16px 12px
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              no-border()
            .icon
              display: inline-block
              width: 16px
              height: 16px
              background-size: 16px 16px
              background-repeat: no-repeat
              vertical-align: top
              margin-right 6px
              &.decrease
                bg-image('decrease_3')
              &.discount
                bg-image('discount_3')
              &.guarantee
                bg-image('guarantee_3')
              &.invoice
                bg-image('invoice_3')
              &.special
                bg-image('special_3')
            .text
              font-size 12px
              line-height 16px

      .pics
        padding 18px
        .title
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
          margin-bottom 12px
        .pic-wrapper
          width 100%
          overflow hidden
          white-space nowrap
        .pic-list
          font-size 0px
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0px
      .info
        padding 18px
        .title
          padding-bottom 12px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
          border-1px(rgba(7, 17, 27, 0.1))
        .info-item
          padding 16px 12px
          line-height 16px
          font-size 12px
          font-weight 200px
          color rgb(7, 17, 27)
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            no-border()

</style>

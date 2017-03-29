<template>
  <div class="ratings" v-el:ratings-scroll>
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rate">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="service-attitude">
            <span class="title">服务态度</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.serviceScore"></star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="food-score">
            <span class="title">商品评分</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.foodScore"></star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :only-content="onlyContent" :desc="desc"
                    :select-type="selectType"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="ratingItem" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" style="height:28px;width:28px">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="comment">{{rating.text}}</p>
              <div class="recommends">
                <i :class="{'icon-thumb_up':(rating.rateType === 0),'icon-thumb_down':(rating.rateType === 1)}"></i>
                <span class="recommend" v-for="recommend in rating.recommend"
                      v-show="rating.recommend && rating.recommend.length>0">{{recommend}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star.vue'
  import ratingselect from 'components/ratingselect/ratingselect.vue'
  import split from 'components/split/split.vue'
  import {dateFormat} from 'common/js/dateFormat.js'
  import BScroll from 'better-scroll'

  const ALL = 2

  let ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        // 是否选择全部评价
        selectType: ALL,
        // 是否显示只有评论的评价
        onlyContent: true,
        desc: {
          positive: '推荐',
          negative: '吐槽',
          all: '全部'
        }
      }
    },
    created () {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
            if (!this.ratingsScroll) {
              this.ratingsScroll = new BScroll(this.$els.ratingsScroll, {
                click: true
              })
            } else {
              this.ratingsScroll.refresh()
            }
          })
        }
      })
    },
    components: {
      star,
      ratingselect,
      split
    },
    filters: {
      formatDate (time) {
        return dateFormat(new Date(time), 'yyyy-MM-dd HH:mm')
      }
    },
    events: {
      'ratingtype.select' (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.ratingsScroll.refresh()
        })
      },
      'content.toggle' (onlyContent) {
        this.onlyContent = onlyContent
        this.$nextTick(() => {
          this.ratingsScroll.refresh()
        })
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratings
    position absolute
    top 174px
    bottom 0px
    overflow hidden
    width 100%
    .overview
      display flex
      padding 18px 0px
      color rgb(7, 17, 27)
      .overview-left
        flex 0 0 137px
        width 137px
        text-align center
        border-right 1px solid rgba(7, 17, 27, 0.1)
        .score
          font-size 24px
          line-height 28px
          color rgb(255, 153, 0)
          margin-bottom 6px
          font-weight 700
        .title
          font-size 12px
          line-height 12px
          margin-bottom 7px
        .rate
          font-size 10px
          margin-bottom 6px
          line-height 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding-left 24px
        font-size 12px
        color rgb(7, 17, 27)
        font-size 0px
        & .title
          display inline-block
          font-size 12px
          vertical-align top
          line-height 18px
          height 18px
        & .star-wrapper
          display inline-block
          .star
            vertical-align top
            height 18px
            line-height 18px
            .starItem
              margin-top 1px
        & .star-wrapper, & .time, & .score
          margin-left 12px
        & .score
          display inline-block
          color rgb(255, 153, 0)
          font-size 12px
          line-height 18px
          height 18px
          vertical-align top
        .service-attitude
          margin-bottom 8px
        .food-score
          margin-bottom 8px
        .deliveryTime
          .time
            display inline-block
            height 18px
            line-height 18px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding: 0px 18px
      .ratingItem
        display flex
        padding 18px 0px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          no-border()
        .avatar
          flex 0 0 40px
          width 40px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          font-size 0px
          color rgb(147, 153, 159)
          .name
            font-size 10px
            line-height 12px
            margin-bottom 4px
            color rgb(7, 17, 27)
          .star-wrapper
            font-size 0px
            & .star
              line-height 12px
              display inline-block
              .starItem
                height 12px
                line-height 12px
                vertical-align top
            .delivery
              font-weight 200
              font-size 10px
              height 12px
              line-height 12px
              vertical-align top
              margin-left 6px
          .comment
            margin 6px 0px 8px
            color rgb(7, 17, 27)
            font-size 12px
            line-height 18px
          .recommends
            font-size 0px
            .recommend
              display inline-block
              font-size 9px
              line-height 16px
              padding 0px 6px
              border 1px solid rgba(7, 17, 27, 0.1)
              background-color rgb(255, 255, 255)
              border-radius 2px
              margin: 0px 0px 4px 8px;
            i
              font-size 12px
              line-height 18px
              &.icon-thumb_up
                color rgb(0, 160, 220)
          .time
            position absolute
            top 0px
            right 0px
            font-size 10px
            line-height 12px
            font-weight 200
            color rgb(147, 153, 159)
</style>

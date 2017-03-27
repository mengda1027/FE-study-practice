<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2,$event)" class="all" :class="{'active':selectType === 2}">{{desc.all}}<span
        class="num">{{ratings.length}}</span></span>
      <span class="positive" :class="{'active':selectType === 0}" @click="select(0,$event)">{{desc.positive}}<span
        class="num">{{positiveRatings.length}}</span></span>
      <span class="negative" @click="select(1,$event)" :class="{'active':selectType === 1}">{{desc.negative}}<span
        class="num">{{negativeRatings.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {

    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: true
      },
      desc: {
        type: Object,
        default () {
          return {
            positive: '满意',
            negative: '吐槽',
            all: '全部'
          }
        }
      }
    },
    methods: {
      select (type, $event) {
        if (!$event._constructed) {
          return
        }
        this.selectType = type
        this.$dispatch('ratingtype.select', type)
      },
      toggleContent () {
        this.onlyContent = !this.onlyContent
        this.$dispatch('content.toggle', this.onlyContent)
      }
    },
    computed: {
      positiveRatings () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negativeRatings () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0px
      margin 0px 18px
      font-size 0px
      border-1px(rgba(7, 17, 27, 0.1))
      .all, .positive, .negative
        display inline-block
        margin-right 8px
        padding 8px 12px
        font-size 12px
        line-height 16px
        height 16px
        border-radius 2px
        color rgb(77, 85, 93)
        vertical-align top
      .all > .num, .positive > .num, .negative > .num
        display inline-block
        line-height 8px
        height 8px
        vertical-align -1px
        font-size 8px
        margin-left 2px
      .all
        background-color rgba(0, 160, 220, 0.2)
        &.active
          color #fff
          background-color rgb(0, 160, 220)
      .positive
        background-color rgba(0, 160, 220, 0.2)
        &.active
          color #fff
          background-color rgb(0, 160, 220)
      .negative
        background-color rgba(77, 85, 93, .2)
        &.active
          color #fff
          background-color rgb(77, 85, 93)
    .switch
      padding 12px 18px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      font-size 0
      color rgb(147, 153, 159)
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        font-size 24px
        line-height 24px
        margin-right 4px
        display inline-block
        vertical-align top
      .text
        font-size 12px
        line-height 24px
        font-size 12px
        display inline-block
        vertical-align top
</style>

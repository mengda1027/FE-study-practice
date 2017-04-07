<template>
  <div class="star" :class="starType">
    <span v-for="starItem in starList" track-by="$index" class="starItem" :class="starItem">
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
  let LENGTH = 5
  let STAR_ON = 'on'
  let STAR_OFF = 'off'
  let STAR_HALF = 'half'

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      starList () {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(STAR_ON)
        }
        if (hasDecimal) {
          result.push(STAR_HALF)
        }
        while (result.length < LENGTH) {
          result.push(STAR_OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .star
    font-size 0
    .starItem
      display: inline-block
      background-repeat no-repeat
      &:last-child
        margin-right 0px
  &.star-24 .starItem
    width: 10px
    height 10px
    margin-right 3px
    background-size 10px 10px
    &.on
      bg-image('star24_on')
    &.off
      bg-image('star24_off')
    &.half
      bg-image('star24_half')
  &.star-36 .starItem
    width: 15px
    height 15px
    margin-right 6px
    background-size 15px 15px
    &.on
      bg-image('star36_on')
    &.off
      bg-image('star36_off')
    &.half
      bg-image('star36_half')
  &.star-48 .starItem
    width: 20px
    height 20px
    margin-right 22px
    background-size 20px 20px
    &.on
      bg-image('star48_on')
    &.off
      bg-image('star48_off')
    &.half
      bg-image('star48_half')
</style>

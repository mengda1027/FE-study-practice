<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount !== 0}"><span class="icon-shopping_cart"></span></div>
          <span class="num" v-show="totalCount !== 0">{{totalCount}}</span>
        </div>
        <div class="price" :class="{'highlight':totalPrice > 0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
      </div>
    </div>
    <div class="balls-container">
      <div transition="drop" class="ball" v-for="ball in balls" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <div class="title">购物车</div>
        <div class="clean" @click="clean">清空</div>
      </div>
      <div class="list-content" v-el:cart-scroll>
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price"><span class="unit">￥</span>{{food.price * food.count}}</div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="list-mask" v-show="listShow" transition="fade" @click="toggleList"></div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  import BScroll from 'better-scroll'

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`需要支付${this.totalPrice}元`)
      },
      clean () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.cartListShowed = !this.cartListShowed
      },
      // 暴露drop方法供父级组件goods调用
      // el为cartcontrol组件中的add按钮
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            // 改变ball的属性，触发动画
            ball.show = true
            // 将在cartcontrol点击的dom元素与ball结合
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      }
    },
    // 配置drop动画
    transitions: {
      drop: {
        // el为挂载transition属性的dom元素
        // beforeEnter定义进入动画前的状态
        beforeEnter (el) {
          let count = this.balls.length
          while (count--) {
            let ball = this.balls[count]
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect()
              // x,y 为将要运动的矢量值(带方向)
              let x = rect.left - 32
              // translate3d中y轴向下为正值
              let y = -(window.innerHeight - rect.top - 22)
              // ?
              el.style.display = ''
              // 可用jQuery?
              el.style.webkitTransform = `translate3d(0,${y}px,0)`
              el.style.transform = `translate3d(0,${y}px,0)`
              let inner = el.getElementsByClassName('inner-hook')[0]
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`
              inner.style.transform = `translate3d(${x}px,0,0)`
            }
          }
        },
        enter (el) {
          // 触发浏览器重绘 作用？
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)'
            el.style.transform = 'translate3d(0,0,0)'
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = 'translate3d(0,0,0)'
            inner.style.transform = 'translate3d(0,0,0)'
          })
        },
        afterEnter (el) {
          let ball = this.dropBalls.shift()
          if (ball) {
            ball.show = false
            el.style.display = 'none'
          }
        }
      }
    },
    data () {
      return {
        balls: [{
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }],
        dropBalls: [],
        cartListShowed: false
      }
    },
    computed: {
      listShow () {
        if (!this.totalCount) {
          this.cartListShowed = false
          return false
        }
        let showed = this.cartListShowed
        if (showed) {
          this.$nextTick(() => {
            if (!this.cartScroll) {
              this.cartScroll = new BScroll(this.$els.cartScroll, {
                // 设置为true则防止阻止原生点击事件
                click: true
              })
            } else {
              this.cartScroll.refresh()
            }
          })
        }
        return showed
      },
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    width 100%
    position: fixed
    bottom: 0px
    z-index 50
    color rgba(255, 255, 255, 0.4)
    height 48px
    .content
      background-color #141d27
      font-size 0
      display flex
      z-index 50
      position relative
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          border-radius 50%
          background-color #141d27
          width 56px
          height 56px
          box-sizing border-box
          z-index 60
          .num
            position absolute
            top 0px
            right 0px
            width 24px
            height 16px
            line-height 16px
            font-size 10px
            color rgb(255, 255, 255)
            background-color rgb(240, 20, 20)
            font-weight 700
            border-radius 16px
            box-shadow 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
            text-align center
          .logo
            width 100%
            height 100%
            background-color #2b343c
            border-radius 50%
            text-align center
            &.highlight
              background-color rgb(0, 160, 220)
              .icon-shopping_cart
                color: rgb(255, 255, 255)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color: #80858a
        .price, .desc
          display inline-block
          vertical-align top
          font-size 16px
          line-height 24px
        .price
          margin 12px 0px 12px
          font-weight 700
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          &.highlight
            color: rgb(255, 255, 255)
        .desc
          font-size 12px
          margin-top 12px
          padding-left 7px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-weight 700
          font-size 12px
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color rgb(255, 255, 255)
    .balls-container
      position fixed
      left 32px
      bottom 22px
      .ball
        z-index 200
        &.drop-transition
          transition all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            display inline-block
            width 16px
            height 16px
            border-radius 50%
            background-color rgb(0, 160, 220)
            transition all 0.5s linear
    .shopcart-list
      position absolute
      top 0px
      left 0px
      color rgb(7, 17, 27)
      z-index -1
      background-color rgb(255, 255, 255)
      width 100%
      &.fold-transition
        transition all 0.5s linear
        transform translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        padding 0px 18px
        .title
          font-size 14px
          float left
        .clean
          font-size 12px
          float right
          color rgb(0, 160, 220)
      .list-content
        max-height 217px
        padding 0px 18px
        overflow hidden
        .food
          position relative
          height 24px
          line-height 24px
          padding 12px 0px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            no-border()
          .name
            font-size 14px
          .price
            position absolute
            right 84px
            top 12px
            font-weight 700
            font-size 14px
            color rgb(240, 20, 20)
            .unit
              font-size 10px
          .cartcontrol-wrapper
            position absolute
            right 0px
            top 12px
  .list-mask
    position fixed
    top 0px
    left 0px
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    &.fade-transition
      transition all 0.5s
      background-color rgba(7, 17, 27, 0.6)
      opacity 1
    &.fade-enter,&.fade-leave
      opacity 0
      background-color rgba(7, 17, 27, 0)
</style>

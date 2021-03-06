<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}"
            @click.stop="selectItem(index,$event)">
          <span class="text"><span class="icon" :class="classMap[item.type]" v-show="item.type>0 "></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsScroll">
      <ul>
        <li v-for="item in goods" class="goods-list good-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item" @click="selectFood(food,$event)">
              <div class="icon">
                <img height="57px" width="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc" v-show="food.description">
                  {{food.description}}
                </p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice"><span class="unit">￥</span>{{food.price}}</span><span class="oldPrice"
                                                                                               v-show="food.oldPrice !== ''"><span
                  class="unit">￥</span>{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="_drop" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :min-price="seller.minPrice" :delivery-price="seller.deliveryPrice"
              :select-foods="selectFoods"></shopcart>
    <food @add="_drop" ref="food" :food="selectedFood"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '@/components/shopcart/shopcart.vue'
  import cartcontrol from '@/components/cartcontrol/cartcontrol.vue'
  import food from '@/components/food/food.vue'

  let ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        heightList: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.heightList.length; i++) {
          let height1 = this.heightList[i]
          let height2 = this.heightList[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      // 计算选中的餐品数量
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created () {
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._intialScroll()
            this._caculateHeight()
          })
        }
      })
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      selectFood (selectedFood, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = selectedFood
        this.$refs.food.show()
      },
      _intialScroll () {
        this.menuScroll = new BScroll(this.$refs.menuScroll, {
          // 设置为true则防止阻止原生点击事件
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsScroll, {click: true, probeType: 3})
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _caculateHeight () {
        let height = 0
        let goodItem = this.$refs.foodsScroll.getElementsByClassName('good-list-hook')
        this.heightList.push(height)
        for (let i = 0; i < goodItem.length; i++) {
          height += goodItem[i].clientHeight
          this.heightList.push(height)
        }
      },
      _drop (target) {
        // 异步执行动画，优化动画效果
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      selectItem (index, event) {
        if (!event._constructed) {
          return
        }
        this.foodsScroll.scrollTo(0, -this.heightList[index], 500)
//        let targets = this.$refs.foodsScroll.getElementsByClassName('good-list-hook')
//        this.foodsScroll.scrollToElement(targets[index], 500)
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    position absolute
    display flex
    width 100%
    top 174px
    bottom 56px
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      background-color #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0px 12px
        &:last-child .text
          no-border()
        &.current
          position relative
          margin-top -1px
          z-index 10
          background-color #fff
          font-weight 700
          .text
            no-border()
        .text
          display table-cell
          vertical-align middle
          width 56px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
          .icon
            display: inline-block
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            vertical-align: top
            margin-right 2px
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
    .foods-wrapper
      flex 1
      .goods-list

        .title
          height 26px
          line-height 26px
          background-color #f3f5f7
          text-indent 14px
          color rgb(147, 153, 159)
          font-size 12px
          border-left 2px solid #d9dde1
        .food-item
          display flex
          margin 18px
          padding-bottom 18px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            no-border()
            margin-bottom 0px
          .icon
            flex: 0 0 57px
            margin-right 10px
          .content
            flex 1
            position relative
            .name
              line-height 14px
              font-size 14px
              color rgb(7, 17, 27)
              margin 2px 0px 8px
            .desc, .extra
              line-height 10px
              font-size 10px
              color rgb(147, 153, 159)
            .desc
              line-height 12px
              margin 8px 0 8px
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
            .cartcontrol-wrapper
              position absolute
              bottom 0px
              right 0px
</style>

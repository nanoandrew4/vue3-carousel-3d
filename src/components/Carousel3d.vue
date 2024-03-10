<template>
  <div
    class="carousel-3d-container"
    :style="{ height: slideHeight + 'px' }"
    @touchstart="handleMousedown"
    @touchend="handleMouseup"
    @touchmove="handleMousemove"
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
    @mousemove="handleMousemove"
  >
    <div
      ref="slider"
      class="carousel-3d-slider"
      :style="{
        width: slideWidth + 'px',
        height: slideHeight + 'px'
      }"
    >
      <slot />
    </div>
    <Controls
      v-if="controlsVisible"
      :next-html="controlsNextHtml"
      :prev-html="controlsPrevHtml"
      :width="controlsWidth"
      :height="controlsHeight"
      :is-prev-possible="isPrevPossible"
      :is-next-possible="isNextPossible"
      @go-prev="goPrev"
      @go-next="goNext"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Controls from '@/components/Controls.vue'

export default defineComponent({
  components: {
    Controls
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    perspective: {
      type: Number,
      default: 35
    },
    display: {
      type: Number,
      default: 5
    },
    loop: {
      type: Boolean,
      default: true
    },
    animationSpeed: {
      type: Number,
      default: 500
    },
    dir: {
      type: String,
      default: 'rtl'
    },
    width: {
      type: Number,
      default: 360
    },
    height: {
      type: Number,
      default: 270
    },
    border: {
      type: Number,
      default: 1
    },
    space: {
      type: [Number, String],
      default: 'auto'
    },
    startIndex: {
      type: Number,
      default: 0
    },
    clickable: {
      type: Boolean,
      default: true
    },
    disable3d: {
      type: Boolean,
      default: false
    },
    minSwipeDistance: {
      type: Number,
      default: 10
    },
    inverseScaling: {
      type: Number,
      default: 300
    },
    controlsVisible: {
      type: Boolean,
      default: false
    },
    controlsPrevHtml: {
      type: String,
      default: '&lsaquo;'
    },
    controlsNextHtml: {
      type: String,
      default: '&rsaquo;'
    },
    controlsWidth: {
      type: Number,
      default: 50
    },
    controlsHeight: {
      type: Number,
      default: 50
    },
    bias: {
      type: String,
      default: 'left'
    },
    onMainSlideClick: {
      type: Function
    },
    oneDirectional: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplayTimeout: {
      type: Number,
      default: 2000
    },
    autoplayHoverPause: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const mutationObserver = new MutationObserver(() => {})
    return {
      viewport: 0,
      currentIndex: 0,
      total: 0,
      dragOffsetX: 0,
      dragStartX: 0,
      dragOffsetY: 0,
      dragStartY: 0,
      mousedown: false,
      zIndex: 998,
      mutationObserver,
      autoplayInterval: 0
    }
  },
  destroyed() {
    this.pauseAutoplay()

    this.$el.removeEventListener('mouseenter', this.pauseAutoplay)
    this.$el.removeEventListener('mouseleave', this.startAutoplay)
  },
  watch: {
    count() {
      this.computeData()
    }
  },
  computed: {
    isLastSlide() {
      return this.currentIndex === this.total - 1
    },
    isFirstSlide() {
      return this.currentIndex === 0
    },
    isNextPossible() {
      return !(!this.loop && this.isLastSlide)
    },
    isPrevPossible() {
      return !(!this.loop && this.isFirstSlide)
    },
    slideWidth(): number {
      const vw = this.viewport
      const sw = this.width + this.border * 2

      return vw < sw && typeof window === 'undefined' ? vw : sw
    },
    slideHeight(): number {
      const sw = this.width + this.border * 2
      const sh = this.height + this.border * 2
      const ar = this.calculateAspectRatio(sw, sh)

      return this.slideWidth / ar
    },
    visible(): number {
      return this.display > this.total ? this.total : this.display
    },
    hasHiddenSlides(): boolean {
      return this.total > this.visible
    },
    leftIndices(): number[] {
      let n = (this.visible - 1) / 2

      n = this.bias.toLowerCase() === 'left' ? Math.ceil(n) : Math.floor(n)

      const indices: number[] = []

      for (let m = 1; m <= n; m++) {
        indices.push(
          this.dir === 'ltr'
            ? (this.currentIndex + m) % this.total
            : (this.currentIndex - m) % this.total
        )
      }

      return indices
    },
    rightIndices(): number[] {
      let n = (this.visible - 1) / 2

      n = this.bias.toLowerCase() === 'right' ? Math.ceil(n) : Math.floor(n)
      const indices: number[] = []

      for (let m = 1; m <= n; m++) {
        indices.push(
          this.dir === 'ltr'
            ? (this.currentIndex - m) % this.total
            : (this.currentIndex + m) % this.total
        )
      }

      return indices
    },
    leftOutIndex(): number {
      let n = (this.visible - 1) / 2

      n = this.bias.toLowerCase() === 'left' ? Math.ceil(n) : Math.floor(n)
      n++

      if (this.dir === 'ltr') {
        return this.total - this.currentIndex - n <= 0
          ? -(this.total - this.currentIndex - n)
          : this.currentIndex + n
      } else {
        return this.currentIndex - n
      }
    },
    rightOutIndex(): number {
      let n = (this.visible - 1) / 2

      n = this.bias.toLowerCase() === 'right' ? Math.ceil(n) : Math.floor(n)
      n++

      if (this.dir === 'ltr') {
        return this.currentIndex - n
      } else {
        return this.total - this.currentIndex - n <= 0
          ? -(this.total - this.currentIndex - n)
          : this.currentIndex + n
      }
    }
  },
  methods: {
    /**
     * Go to next slide
     */
    goNext() {
      if (this.isNextPossible) {
        this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1)
      }
    },
    /**
     * Go to previous slide
     */
    goPrev() {
      if (this.isPrevPossible) {
        this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1)
      }
    },
    /**
     * Go to slide
     */
    goSlide(index: number) {
      this.currentIndex = index < 0 || index > this.total - 1 ? 0 : index

      if (this.isLastSlide) this.$emit('last-slide', this.currentIndex)

      this.$emit('before-slide-change', this.currentIndex)

      setTimeout(() => this.animationEnd(), this.animationSpeed)
    },
    /**
     * Go to slide far slide
     */
    goFar(index: number) {
      let diff = index === this.total - 1 && this.isFirstSlide ? -1 : index - this.currentIndex

      if (this.isLastSlide && index === 0) {
        diff = 1
      }

      const diff2 = diff < 0 ? -diff : diff
      let timeBuff = 0
      let i = 0

      while (i < diff2) {
        i += 1
        const timeout = diff2 === 1 ? 0 : timeBuff

        setTimeout(() => (diff < 0 ? this.goPrev() : this.goNext()), timeout)

        timeBuff += this.animationSpeed / diff2
      }
    },
    /**
     * Trigger actions when animation ends
     */
    animationEnd() {
      this.$emit('after-slide-change', this.currentIndex)
    },
    /**
     * Trigger actions when mouse is released
     */
    handleMouseup() {
      this.mousedown = false
      this.dragOffsetX = 0
      this.dragOffsetY = 0
    },
    /**
     * Trigger actions when mouse is pressed
     */
    handleMousedown(e: any) {
      if (e.touches) e = e.touches[0]
      else e.preventDefault()
      this.mousedown = true
      this.dragStartX = e.clientX
      this.dragStartY = e.clientY
    },
    /**
     * Trigger actions when mouse is pressed and then moved (mouse drag)
     */
    handleMousemove(e: any) {
      if (!this.mousedown) {
        return
      }
      if (e.touches) e = e.touches[0]

      const eventPosX = e.clientX
      const eventPosY = e.clientY
      const deltaX = this.dragStartX - eventPosX
      const deltaY = this.dragStartY - eventPosY

      this.dragOffsetX = deltaX
      this.dragOffsetY = deltaY

      // If the swipe is more significant on the Y axis, do not move the slides because this is a scroll gesture
      if (Math.abs(this.dragOffsetY) > Math.abs(this.dragOffsetX)) {
        return
      }

      if (this.dragOffsetX > this.minSwipeDistance) {
        this.handleMouseup()
        this.goNext()
      } else if (this.dragOffsetX < -this.minSwipeDistance) {
        this.handleMouseup()
        this.goPrev()
      }
    },
    /**
     * A mutation observer is used to detect changes to the containing node
     * in order to keep the magnet container in sync with the height its reference node.
     */
    attachMutationObserver() {
      const MutationObserver = window.MutationObserver

      if (MutationObserver) {
        const config = {
          attributes: true,
          childList: true,
          characterData: true
        }

        this.mutationObserver = new MutationObserver(() => {
          this.$nextTick(() => {
            this.computeData()
          })
        })

        if (this.$el) {
          this.mutationObserver.observe(this.$el, config)
        }
      }
    },

    detachMutationObserver() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect()
      }
    },
    /**
     * Get the number of slides
     */
    getSlideCount(): number {
      let ret = 0;
      const slider = this.$refs.slider as HTMLElement
      if (slider && slider.children)
        ret = slider.children.length;

      return ret
    },
    /**
     * Calculate slide with and keep defined aspect ratio
     */
    calculateAspectRatio(width: number, height: number): number {
      return Math.min(width / height)
    },
    /**
     * Re-compute the number of slides and current slide
     */
    computeData(firstRun?: boolean) {
      this.total = this.getSlideCount()
      if (firstRun || this.currentIndex >= this.total) {
        this.currentIndex = this.startIndex > this.total - 1 ? this.total - 1 : this.startIndex
      }

      this.viewport = this.$el.clientWidth
    },
    setSize() {
      this.$el.style.cssText += 'height:' + this.slideHeight + 'px;'
      this.$el.childNodes[0].style.cssText +=
        'width:' + this.slideWidth + 'px;' + ' height:' + this.slideHeight + 'px;'
    },
    pauseAutoplay() {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval)
    },
    startAutoplay() {
      if (this.autoplay) {
        this.autoplayInterval = setInterval(() => {
          this.dir === 'ltr' ? this.goPrev() : this.goNext()
        }, this.autoplayTimeout)
      }
    }
  },
  mounted() {
    this.computeData(true)
    this.attachMutationObserver()
    window.addEventListener('resize', this.setSize)

    if (this.autoplayHoverPause) {
      this.$el.addEventListener('mouseenter', this.pauseAutoplay)
      this.$el.addEventListener('mouseleave', this.startAutoplay)

      this.startAutoplay()
    }
  },
  beforeUnmount() {
    this.detachMutationObserver()
    window.removeEventListener('resize', this.setSize)
  }
})
</script>

<style scoped>
.carousel-3d-container {
  min-height: 1px;
  width: 100%;
  position: relative;
  z-index: 0;
  overflow: hidden;
  margin: 20px auto;
  box-sizing: border-box;
}

.carousel-3d-slider {
  position: relative;
  margin: 0 auto;
  transform-style: preserve-3d;
  perspective: 1000px;
}
</style>

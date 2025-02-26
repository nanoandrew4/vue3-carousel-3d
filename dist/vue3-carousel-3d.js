import { defineComponent as p, openBlock as d, createElementBlock as c, createElementVNode as l, normalizeClass as u, withModifiers as m, normalizeStyle as h, resolveComponent as b, renderSlot as g, createBlock as I, createCommentVNode as y } from "vue";
const x = p({
  emits: ["goPrev", "goNext"],
  props: {
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 60
    },
    /**
     * Text content of the navigation prev button
     */
    prevHtml: {
      type: String,
      default: "&lsaquo;"
    },
    /**
     * Text content of the navigation next button
     */
    nextHtml: {
      type: String,
      default: "&rsaquo;"
    },
    isPrevPossible: {
      type: Boolean,
      required: !0
    },
    isNextPossible: {
      type: Boolean,
      required: !0
    }
  }
}), f = (t, e) => {
  const i = t.__vccOpts || t;
  for (const [s, r] of e)
    i[s] = r;
  return i;
}, S = { class: "carousel-3d-controls" }, w = ["innerHTML"], M = ["innerHTML"];
function $(t, e, i, s, r, a) {
  return d(), c("div", S, [
    l("a", {
      href: "#",
      class: u(["prev", { disabled: !t.isPrevPossible }]),
      onClick: e[0] || (e[0] = m((o) => t.$emit("goPrev"), ["prevent"])),
      style: h(`width: ${t.width}px; height: ${t.height}px; line-height: ${t.height}px;`),
      "aria-label": "Previous slide"
    }, [
      l("span", { innerHTML: t.prevHtml }, null, 8, w)
    ], 6),
    l("a", {
      href: "#",
      class: u(["next", { disabled: !t.isNextPossible }]),
      onClick: e[1] || (e[1] = m((o) => t.$emit("goNext"), ["prevent"])),
      style: h(`width: ${t.width}px; height: ${t.height}px; line-height: ${t.height}px;`),
      "aria-label": "Next slide"
    }, [
      l("span", { innerHTML: t.nextHtml }, null, 8, M)
    ], 6)
  ]);
}
const N = /* @__PURE__ */ f(x, [["render", $], ["__scopeId", "data-v-717c3828"]]), P = p({
  components: {
    Controls: N
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
      default: !0
    },
    animationSpeed: {
      type: Number,
      default: 500
    },
    dir: {
      type: String,
      default: "rtl"
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
      default: "auto"
    },
    startIndex: {
      type: Number,
      default: 0
    },
    clickable: {
      type: Boolean,
      default: !0
    },
    disable3d: {
      type: Boolean,
      default: !1
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
      default: !1
    },
    controlsPrevHtml: {
      type: String,
      default: "&lsaquo;"
    },
    controlsNextHtml: {
      type: String,
      default: "&rsaquo;"
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
      default: "left"
    },
    onMainSlideClick: {
      type: Function
    },
    oneDirectional: {
      type: Boolean,
      default: !1
    },
    autoplay: {
      type: Boolean,
      default: !1
    },
    autoplayTimeout: {
      type: Number,
      default: 2e3
    },
    autoplayHoverPause: {
      type: Boolean,
      default: !0
    }
  },
  data() {
    return {
      viewport: 0,
      currentIndex: 0,
      total: 0,
      dragOffsetX: 0,
      dragStartX: 0,
      dragOffsetY: 0,
      dragStartY: 0,
      mousedown: !1,
      zIndex: 998,
      mutationObserver: new MutationObserver(() => {
      }),
      autoplayInterval: 0
    };
  },
  unmounted() {
    this.pauseAutoplay(), this.$el.removeEventListener("mouseenter", this.pauseAutoplay), this.$el.removeEventListener("mouseleave", this.startAutoplay);
  },
  watch: {
    count() {
      this.computeData();
    }
  },
  computed: {
    isLastSlide() {
      return this.currentIndex === this.total - 1;
    },
    isFirstSlide() {
      return this.currentIndex === 0;
    },
    isNextPossible() {
      return !(!this.loop && this.isLastSlide);
    },
    isPrevPossible() {
      return !(!this.loop && this.isFirstSlide);
    },
    slideWidth() {
      const t = this.viewport, e = this.width + this.border * 2;
      return t < e && typeof window > "u" ? t : e;
    },
    slideHeight() {
      const t = this.width + this.border * 2, e = this.height + this.border * 2, i = this.calculateAspectRatio(t, e);
      return this.slideWidth / i;
    },
    visible() {
      return this.display > this.total ? this.total : this.display;
    },
    hasHiddenSlides() {
      return this.total > this.visible;
    },
    leftIndices() {
      let t = (this.visible - 1) / 2;
      t = this.bias.toLowerCase() === "left" ? Math.ceil(t) : Math.floor(t);
      const e = [];
      for (let i = 1; i <= t; i++)
        e.push(
          this.dir === "ltr" ? (this.currentIndex + i) % this.total : (this.currentIndex - i) % this.total
        );
      return e;
    },
    rightIndices() {
      let t = (this.visible - 1) / 2;
      t = this.bias.toLowerCase() === "right" ? Math.ceil(t) : Math.floor(t);
      const e = [];
      for (let i = 1; i <= t; i++)
        e.push(
          this.dir === "ltr" ? (this.currentIndex - i) % this.total : (this.currentIndex + i) % this.total
        );
      return e;
    },
    leftOutIndex() {
      let t = (this.visible - 1) / 2;
      return t = this.bias.toLowerCase() === "left" ? Math.ceil(t) : Math.floor(t), t++, this.dir === "ltr" ? this.total - this.currentIndex - t <= 0 ? -(this.total - this.currentIndex - t) : this.currentIndex + t : this.currentIndex - t;
    },
    rightOutIndex() {
      let t = (this.visible - 1) / 2;
      return t = this.bias.toLowerCase() === "right" ? Math.ceil(t) : Math.floor(t), t++, this.dir === "ltr" ? this.currentIndex - t : this.total - this.currentIndex - t <= 0 ? -(this.total - this.currentIndex - t) : this.currentIndex + t;
    }
  },
  methods: {
    /**
     * Go to next slide
     */
    goNext() {
      this.isNextPossible && (this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1));
    },
    /**
     * Go to previous slide
     */
    goPrev() {
      this.isPrevPossible && (this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1));
    },
    /**
     * Go to slide
     */
    goSlide(t) {
      this.currentIndex = t < 0 || t > this.total - 1 ? 0 : t, this.isLastSlide && this.$emit("last-slide", this.currentIndex), this.$emit("before-slide-change", this.currentIndex), setTimeout(() => this.animationEnd(), this.animationSpeed);
    },
    /**
     * Go to slide far slide
     */
    goFar(t) {
      let e = t === this.total - 1 && this.isFirstSlide ? -1 : t - this.currentIndex;
      this.isLastSlide && t === 0 && (e = 1);
      const i = e < 0 ? -e : e;
      let s = 0, r = 0;
      for (; r < i; )
        r += 1, setTimeout(() => e < 0 ? this.goPrev() : this.goNext(), i === 1 ? 0 : s), s += this.animationSpeed / i;
    },
    /**
     * Trigger actions when animation ends
     */
    animationEnd() {
      this.$emit("after-slide-change", this.currentIndex);
    },
    /**
     * Trigger actions when mouse is released
     */
    handleMouseup() {
      this.mousedown = !1, this.dragOffsetX = 0, this.dragOffsetY = 0;
    },
    /**
     * Trigger actions when mouse is pressed
     */
    handleMousedown(t) {
      t.touches ? t = t.touches[0] : t.preventDefault(), this.mousedown = !0, this.dragStartX = t.clientX, this.dragStartY = t.clientY;
    },
    /**
     * Trigger actions when mouse is pressed and then moved (mouse drag)
     */
    handleMousemove(t) {
      if (!this.mousedown)
        return;
      t.touches && (t = t.touches[0]);
      const e = t.clientX, i = t.clientY, s = this.dragStartX - e, r = this.dragStartY - i;
      this.dragOffsetX = s, this.dragOffsetY = r, !(Math.abs(this.dragOffsetY) > Math.abs(this.dragOffsetX)) && (this.dragOffsetX > this.minSwipeDistance ? (this.handleMouseup(), this.goNext()) : this.dragOffsetX < -this.minSwipeDistance && (this.handleMouseup(), this.goPrev()));
    },
    /**
     * A mutation observer is used to detect changes to the containing node
     * in order to keep the magnet container in sync with the height its reference node.
     */
    attachMutationObserver() {
      const t = window.MutationObserver;
      if (t) {
        const e = {
          attributes: !0,
          childList: !0,
          characterData: !0
        };
        this.mutationObserver = new t(() => {
          this.$nextTick(() => {
            this.computeData();
          });
        }), this.$el && this.mutationObserver.observe(this.$el, e);
      }
    },
    detachMutationObserver() {
      this.mutationObserver && this.mutationObserver.disconnect();
    },
    /**
     * Get the number of slides
     */
    getSlideCount() {
      let t = 0;
      const e = this.$refs.slider;
      return e && e.children && (t = e.children.length), t;
    },
    /**
     * Calculate slide with and keep defined aspect ratio
     */
    calculateAspectRatio(t, e) {
      return Math.min(t / e);
    },
    /**
     * Re-compute the number of slides and current slide
     */
    computeData(t) {
      this.total = this.getSlideCount(), (t || this.currentIndex >= this.total) && (this.currentIndex = this.startIndex > this.total - 1 ? this.total - 1 : this.startIndex), this.viewport = this.$el.clientWidth;
    },
    setSize() {
      this.$el.style.cssText += "height:" + this.slideHeight + "px;", this.$el.childNodes[0].style.cssText += "width:" + this.slideWidth + "px; height:" + this.slideHeight + "px;";
    },
    pauseAutoplay() {
      this.autoplayInterval && clearInterval(this.autoplayInterval);
    },
    startAutoplay() {
      this.autoplay && (this.autoplayInterval = setInterval(() => {
        this.dir === "ltr" ? this.goPrev() : this.goNext();
      }, this.autoplayTimeout));
    }
  },
  mounted() {
    this.computeData(!0), this.attachMutationObserver(), window.addEventListener("resize", this.setSize), this.autoplayHoverPause && (this.$el.addEventListener("mouseenter", this.pauseAutoplay), this.$el.addEventListener("mouseleave", this.startAutoplay), this.startAutoplay());
  },
  beforeUnmount() {
    this.detachMutationObserver(), window.removeEventListener("resize", this.setSize);
  }
});
function O(t, e, i, s, r, a) {
  const o = b("Controls");
  return d(), c("div", {
    class: "carousel-3d-container",
    style: h({ height: t.slideHeight + "px" }),
    onTouchstart: e[0] || (e[0] = (...n) => t.handleMousedown && t.handleMousedown(...n)),
    onTouchend: e[1] || (e[1] = (...n) => t.handleMouseup && t.handleMouseup(...n)),
    onTouchmove: e[2] || (e[2] = (...n) => t.handleMousemove && t.handleMousemove(...n)),
    onMousedown: e[3] || (e[3] = (...n) => t.handleMousedown && t.handleMousedown(...n)),
    onMouseup: e[4] || (e[4] = (...n) => t.handleMouseup && t.handleMouseup(...n)),
    onMousemove: e[5] || (e[5] = (...n) => t.handleMousemove && t.handleMousemove(...n))
  }, [
    l("div", {
      ref: "slider",
      class: "carousel-3d-slider",
      style: h({
        width: t.slideWidth + "px",
        height: t.slideHeight + "px"
      })
    }, [
      g(t.$slots, "default", {}, void 0, !0)
    ], 4),
    t.controlsVisible ? (d(), I(o, {
      key: 0,
      "next-html": t.controlsNextHtml,
      "prev-html": t.controlsPrevHtml,
      width: t.controlsWidth,
      height: t.controlsHeight,
      "is-prev-possible": t.isPrevPossible,
      "is-next-possible": t.isNextPossible,
      onGoPrev: t.goPrev,
      onGoNext: t.goNext
    }, null, 8, ["next-html", "prev-html", "width", "height", "is-prev-possible", "is-next-possible", "onGoPrev", "onGoNext"])) : y("", !0)
  ], 36);
}
const C = /* @__PURE__ */ f(P, [["render", O], ["__scopeId", "data-v-7af7631c"]]), H = p({
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      parent: this.$parent,
      styles: void 0,
      zIndex: 999
    };
  },
  computed: {
    isCurrent() {
      return this.index === this.parent.currentIndex;
    },
    leftIndex() {
      return this.parent.oneDirectional && this.getSideIndex(this.parent.leftIndices) > this.parent.currentIndex - 1 ? -1 : this.getSideIndex(this.parent.leftIndices);
    },
    rightIndex() {
      return this.parent.oneDirectional && this.getSideIndex(this.parent.rightIndices) > this.parent.total - this.parent.currentIndex - 2 ? -1 : this.getSideIndex(this.parent.rightIndices);
    },
    slideStyle() {
      let t = this.baseStyle();
      if (!this.isCurrent) {
        const e = this.leftIndex, i = this.rightIndex;
        (i >= 0 || e >= 0) && (t = i >= 0 ? this.calculatePosition(i, !0, this.zIndex) : this.calculatePosition(e, !1, this.zIndex), t = Object.assign(t, { opacity: 1, visibility: "visible" })), this.parent.hasHiddenSlides && (this.matchIndex(this.parent.leftOutIndex) ? t = this.calculatePosition(this.parent.leftIndices.length - 1, !1, this.zIndex) : this.matchIndex(this.parent.rightOutIndex) && (t = this.calculatePosition(this.parent.rightIndices.length - 1, !0, this.zIndex)));
      }
      return t;
    },
    computedClasses() {
      return {
        [`left-${this.leftIndex + 1}`]: this.leftIndex >= 0,
        [`right-${this.rightIndex + 1}`]: this.rightIndex >= 0,
        current: this.isCurrent
      };
    }
  },
  methods: {
    getSideIndex(t) {
      let e = -1;
      return t.forEach((i, s) => {
        this.matchIndex(i) && (e = s);
      }), e;
    },
    matchIndex(t) {
      return t >= 0 ? this.index === t : this.parent.total + t === this.index;
    },
    baseStyle() {
      return {
        "border-width": this.parent.border + "px",
        width: this.parent.slideWidth + "px",
        height: this.parent.slideHeight + "px",
        transition: " transform " + this.parent.animationSpeed + "ms,                opacity " + this.parent.animationSpeed + "ms,                visibility " + this.parent.animationSpeed + "ms"
      };
    },
    calculatePosition(t, e, i) {
      const s = this.baseStyle(), r = this.parent.disable3d ? 0 : parseInt(this.parent.inverseScaling) + (t + 1) * 100, a = this.parent.disable3d ? 0 : parseInt(this.parent.perspective), o = this.parent.space === "auto" ? (t + 1) * (this.parent.width / 1.5) : (t + 1) * this.parent.space, n = e ? "translateX(" + o + "px) translateZ(-" + r + "px) rotateY(-" + a + "deg)" : "translateX(-" + o + "px) translateZ(-" + r + "px) rotateY(" + a + "deg)", v = this.parent.space === "auto" ? 0 : (t + 1) * this.parent.space;
      return Object.assign(s, {
        transform: n,
        top: v,
        zIndex: i - (Math.abs(t) + 1)
      });
    },
    goTo() {
      if (!this.isCurrent)
        this.parent.clickable === !0 && this.parent.goFar(this.index);
      else {
        const { index: t } = this;
        this.parent.onMainSlideClick({ index: t });
      }
    }
  }
});
function L(t, e, i, s, r, a) {
  return d(), c("div", {
    class: u(["carousel-3d-slide", t.computedClasses]),
    style: h(t.slideStyle),
    onClick: e[0] || (e[0] = (o) => t.goTo())
  }, [
    g(t.$slots, "default", {
      index: t.index,
      isCurrent: t.isCurrent,
      leftIndex: t.leftIndex,
      rightIndex: t.rightIndex
    }, void 0, !0)
  ], 6);
}
const T = /* @__PURE__ */ f(H, [["render", L], ["__scopeId", "data-v-f75c401f"]]), X = {
  install(t) {
    t.component("Carousel3d", C), t.component("Slide", T);
  }
};
export {
  C as Carousel3d,
  X as Carousel3dPlugin,
  T as Slide
};

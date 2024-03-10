import type { App, Plugin } from 'vue'
import VCarousel3d from './components/Carousel3d.vue'
import VSlide from './components/Slide.vue'

const Carousel3d: Plugin = {
  install(app: App) {
    app.component('Carousel3d', VCarousel3d)
    app.component('Slide', VSlide)
  }
}

export default Carousel3d

import type { App, Plugin } from 'vue'
import Carousel3d from './components/Carousel3d.vue'
import Slide from './components/Slide.vue'

const Carousel3dPlugin: Plugin = {
  install(app: App) {
    app.component('Carousel3d', Carousel3d)
    app.component('Slide', Slide)
  }
}

export { Carousel3dPlugin, Carousel3d, Slide }

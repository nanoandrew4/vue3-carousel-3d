import Carousel3d from './Carousel3d.vue'
import Slide from '../Slide/Slide.vue'

import { h } from 'vue'

describe('<Carousel3d />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Carousel3d, {
      slots: {
        default: () => [
          h(Slide, {}, h('img', { src: 'https://via.placeholder.com/360x270' }, {})),
          h(Slide, {}, h('img', { src: 'https://via.placeholder.com/360x270' }, {})),
          h(Slide, {}, h('img', { src: 'https://via.placeholder.com/360x270' }, {}))
        ]
      }
    })
  })
})

import Carousel3d from '../../../src/components/Carousel3d.vue'
import Slide from '../../../src/components/Slide.vue'

import { mount } from '@vue/test-utils'

import { getNSlides } from '../utils.mjs'

describe('Slide', () => {
  it('should mount successfully', async () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: [Slide]
      }
    })

    const slideInstance = wrapper.vm.$slots.default()[0]
    expect(slideInstance).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  it('should return style object when 3 slides are added to the slots', () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: [Slide, Slide, Slide]
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a scoped slot', async () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: () => getNSlides(5, true)
      }
    })

    await wrapper.vm.$nextTick() // give the test a sec to render everything and apply parent props to children
    expect(wrapper).toMatchSnapshot()
  })
})

import { mount } from '@vue/test-utils'

import Carousel3d from '../../../src/components/Carousel3d.vue'

import { getNSlides } from '../utils'

describe('Controls', () => {
  let wrapper
  let $controls

  beforeEach(async () => {
    wrapper = mount(Carousel3d, {
      props: {
        controlsVisible: true
      },
      slots: {
        default: () => getNSlides(4, true)
      }
    })
    await wrapper.vm.$nextTick()

    $controls = wrapper.vm.$el.querySelector('.carousel-3d-controls')
  })

  it('should mount successfully', () => {
    expect($controls).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a next button', () => {
    expect(wrapper.vm.$el.querySelector('.next')).toBeDefined()
  })

  it('should render a prev button', () => {
    expect(wrapper.vm.$el.querySelector('.prev')).toBeDefined()
  })

  it('should trigger onNext when next is clicked', () => {
    wrapper.vm.$el.querySelector('.next').click()

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.currentIndex).toBe(1)
      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should trigger onNext when next is clicked', () => {
    wrapper.vm.$el.querySelector('.prev').click()

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.currentIndex).toBe(3)
      expect(wrapper).toMatchSnapshot()
    })
  })

  // TODO: one directional tests
})

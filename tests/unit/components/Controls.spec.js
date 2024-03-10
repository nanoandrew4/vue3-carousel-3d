import { h } from 'vue'
import { mount } from '@vue/test-utils'

import Carousel3d from '../../../src/components/Carousel3d.vue'
import Slide from '../../../src/components/Slide.vue'

describe('Controls', () => {
  let wrapper
  let $controls

  beforeEach(async () => {
    wrapper = mount(Carousel3d, {
      props: {
        controlsVisible: true
      },
      slots: {
        default: () =>
          Array.apply(null, { length: 4 }).map((k, index) =>
            h(
              Slide,
              {
                index: index
              },
              {
                default: (props) =>
                  h({
                    setup() {
                      return () =>
                        h('div', {
                          'data-left-index': props.leftIndex,
                          'data-right-index': props.rightIndex,
                          'data-index': props.index,
                          'data-is-current': props.isCurrent ? 'true' : null
                        })
                    }
                  })
              }
            )
          )
      }
    })
    await wrapper.vm.$nextTick()

    $controls = wrapper.vm.$el.querySelector('.carousel-3d-controls')
  })

  test('should mount successfully', () => {
    expect($controls).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  test('should render a next button', () => {
    expect(wrapper.vm.$el.querySelector('.next')).toBeDefined()
  })

  test('should render a prev button', () => {
    expect(wrapper.vm.$el.querySelector('.prev')).toBeDefined()
  })

  test('should trigger onNext when next is clicked', () => {
    wrapper.vm.$el.querySelector('.next').click()

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.currentIndex).toBe(1)
      expect(wrapper).toMatchSnapshot()
    })
  })

  test('should trigger onNext when next is clicked', () => {
    wrapper.vm.$el.querySelector('.prev').click()

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.currentIndex).toBe(3)
      expect(wrapper).toMatchSnapshot()
    })
  })

  // TODO: one directional tests
})

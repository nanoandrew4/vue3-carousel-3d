const utils = require('../utils')

import Carousel3d from '../../../src/components/Carousel3d/Carousel3d.vue'
import Slide from '../../../src/components/Slide/Slide.vue'

import { h } from 'vue'
import { mount } from '@vue/test-utils'

describe('Slide', () => {
  test('should mount successfully', async () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: [Slide]
      }
    })

    const slideInstance = wrapper.vm.$slots.default()[0]
    expect(slideInstance).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  test('should return style object when 3 slides are added to the slots', () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: [Slide, Slide, Slide]
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a scoped slot', () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: () =>
          Array.apply(null, { length: 5 }).map((k, index) =>
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
    expect(wrapper).toMatchSnapshot()
  })
})

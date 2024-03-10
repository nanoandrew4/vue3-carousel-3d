import { getNSlides } from '../utils.mjs'
import { mount } from '@vue/test-utils'

import Carousel3d from '../../../src/components/Carousel3d.vue'
import Slide from '../../../src/components/Slide.vue'

describe('Carousel3d', () => {
  it('should mount successfully with 0 slides', () => {
    const wrapper = mount(Carousel3d)
    expect(wrapper.vm.total).toBe(0)
    expect(wrapper).toMatchSnapshot()
  })

  it('should register 3 slides when 3 slides are added to the slots', async () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: () => getNSlides(3)
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.total).toBe(3)
    expect(wrapper).toMatchSnapshot()
  })

  it('should show 5 slides when 7 slides are added to the slots', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        display: 5
      },
      slots: {
        default: () => getNSlides(7)
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.visible).toBe(5)
    expect(wrapper).toMatchSnapshot()
  })

  it('should show 2 slides when 2 slides are added to the slots', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        display: 3
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.visible).toBe(2)
    expect(wrapper).toMatchSnapshot()
  })

  it('should show 3 slides when 3 slides are added to the slots and display property is set to 5', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        display: 5
      },
      slots: {
        default: () => getNSlides(3)
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.visible).toBe(3)
    expect(wrapper).toMatchSnapshot()
  })

  it('should increase current index number by 1 when goNext is called', async () => {
    const wrapper = mount(Carousel3d, {
      slots: {
        default: () => getNSlides(3)
      }
    })

    return wrapper.vm.$nextTick().then(() => {
      wrapper.vm.goNext()
      expect(wrapper.vm.currentIndex).toBe(1)

      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should decrease current index number by 1 when goPrev is called', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 1
      },
      slots: {
        default: () => getNSlides(3)
      }
    })

    return wrapper.vm.$nextTick().then(() => {
      wrapper.vm.goPrev()
      expect(wrapper.vm.currentIndex).toBe(0)
      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should be able to go on next slide if start slide index is 0 and there are 2 slides ', () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 0
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    expect(wrapper.vm.isNextPossible).toBe(true)
    expect(wrapper).toMatchSnapshot()
  })

  it('should be able to go on prev slide if start slide index is 0, loop is enabled and there are 2 slides ', () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 0,
        loop: true
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    expect(wrapper.vm.isPrevPossible).toBe(true)
    expect(wrapper).toMatchSnapshot()
  })

  it('should not be able to go on next slide if start slide index is 1, loop is disabled and there are 2 slides ', () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 1,
        loop: false
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    expect(wrapper.vm.isNextPossible).toBe(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('should be able to go on prev slide if start slide index is 0, loop is disabled and there are 2 slides ', () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 0,
        loop: false
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    expect(wrapper.vm.isPrevPossible).toBe(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('check if exact callback function is received for onMainSlideClick ', () => {
    const noop = () => {}

    const wrapper = mount(Carousel3d, {
      props: {
        onMainSlideClick: noop
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    expect(wrapper.vm.onMainSlideClick).toEqual(noop)
    expect(wrapper).toMatchSnapshot()
  })

  it('check if exact callback function is received for onMainSlideClick ', () => {
    const returnTrue = () => {
      return true
    }

    const wrapper = mount(Carousel3d, {
      props: {
        onMainSlideClick: returnTrue
      },
      slots: {
        default: () => getNSlides(2)
      }
    })

    const result = wrapper.vm.onMainSlideClick()
    expect(result).toBe(true)
    expect(wrapper).toMatchSnapshot()
  })

  it('should not change current slide index if computeData called and total number of slides have not change and in of bounds ', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 0,
        loop: false
      },
      slots: {
        default: () => getNSlides(2)
      }
    })
    return wrapper.vm.$nextTick().then(() => {
      wrapper.vm.goNext()
      wrapper.vm.computeData()
      expect(wrapper.vm.$data.currentIndex).toBe(1)

      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should change current slide index if computeData called and current slide index falls out of bounds ', async () => {
    const wrapper = mount(Carousel3d, {
      props: {
        startIndex: 0,
        loop: false
      },
      slots: {
        default: () => getNSlides(3)
      }
    })
    return wrapper.vm.$nextTick().then(async () => {
      // Since we can no longer edit the slots, simulate the index being out of bounds
      wrapper.vm.$data.currentIndex = 5
      wrapper.vm.computeData()
      expect(wrapper.vm.currentIndex).toBe(0)
      expect(wrapper).toMatchSnapshot()
    })
  })
})

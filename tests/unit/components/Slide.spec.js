const utils = require('../utils')

import Carousel3d from '../../../src/components/Carousel3d/Carousel3d.vue';
import Slide from "../../../src/components/Slide/Slide.vue";

import { mount, flushPromises } from "@vue/test-utils";
import {createApp, h} from 'vue'

describe('Slide', () => {
    test('should mount successfully', async () => {
        const slide = mount(Slide)
        const wrapper = mount(Carousel3d, {
            slots: {
                default: [Slide]
            }
        })

        await flushPromises()
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()
        // console.log(slide.html())
        console.log(wrapper.html())

        const slideInstance = wrapper.vm.$slots.default()[0]
        console.log(slideInstance.type)
        expect(slideInstance).toBeDefined()

        return utils.expectToMatchSnapshot(wrapper.vm)

        // const vm = createApp({
        //     render() {
        //         return h(Carousel3d, {}, () => [h(Slide)]);
        //     },
        // })
        // .mount(document.createElement('div'));

        // await flushPromises()

        // console.log(vm)
        // const carouselInstance = vm.$children[0]
        // const slideInstance = vm.$slots.default()[0]
        // expect(slideInstance._isMounted).toBe(true)

        // return utils.expectToMatchSnapshot(vm)
    })

//     it('should unmount successfully', () => {
//         const vm = new Vue({
//             el: document.createElement('div'),
//             render: (h) => h(Carousel3d, {}, [h(Slide)])
//         })
//         const carouselInstance = vm.$children[0]
//         const slideInstance = carouselInstance.$children[0]
//         slideInstance.$destroy()
//         expect(slideInstance._isDestroyed).toBe(true)

//         return utils.expectToMatchSnapshot(vm)
//     })

//     it('should return style object when 3 slides are added to the slots', () => {
//         const vm = new Vue({
//             el: document.createElement('div'),
//             render: (h) => h(Carousel3d, {}, [h(Slide), h(Slide), h(Slide)])
//         })
//         const carouselInstance = vm.$children[0]
//         const slideInstance = carouselInstance.$children[0]
//         const o = slideInstance.calculatePosition(0, true)

//         expect(o.transform).toMatch(/translateX/)
//         expect(o.top).toBe(0)

//         return utils.expectToMatchSnapshot(vm)
//     })

//     it('should render a scoped slot', () => {
//         const vm = new Vue({
//             el: document.createElement('div'),
//             render: (h) => h(Carousel3d, {}, Array.apply(null, { length: 5 }).map((k, index) => h(Slide, {
//                 /* adds the index prop */
//                 props: {
//                     index: index
//                 },
//                 /* add a default scoped slot */
//                 scopedSlots: {
//                     default: props => h('div', {
//                         attrs: {
//                             /* with left and right data attrs */
//                             'data-left-index': props.leftIndex,
//                             'data-right-index': props.rightIndex,
//                             'data-index': props.index,
//                             'data-is-current': props.isCurrent
//                         }
//                     }, index)
//                 }
//             })))
//         })

//         return utils.expectToMatchSnapshot(vm)
//     })
})

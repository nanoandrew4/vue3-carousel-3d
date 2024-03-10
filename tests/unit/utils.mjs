import { h } from 'vue'
import Slide from '../../src/components/Slide.vue'

function getNSlides(n, withChildDiv) {
  let children
  if (withChildDiv) {
    children = {
      default: (props) =>
        h({
          setup() {
            return () => {
              return h('div', {
                'data-left-index': props.leftIndex,
                'data-right-index': props.rightIndex,
                'data-index': props.index,
                'data-is-current': props.isCurrent ? 'true' : null
              })
            }
          }
        })
    }
  }
  return Array.apply(null, { length: n }).map((k, index) =>
    h(
      Slide,
      {
        index: index
      },
      children
    )
  )
}

exports.getNSlides = getNSlides

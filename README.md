# Vue Carousel 3d

[![Latest Stable Version](https://img.shields.io/npm/v/@nanoandrew4/vue3-carousel-3d.svg)](https://www.npmjs.com/package/@nanoandrew4/vue3-carousel-3d)

**[Full documentation and examples](https://wlada.github.io/vue-carousel-3d)**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

``` bash
npm install -S @nanoandrew4/vue3-carousel-3d
```

## Usage

##### Usage (Global)

You may install Vue Carousel 3d globally:

``` js
import '@nanoandrew4/vue3-carousel-3d/dist/style.css'

import { createApp } from 'vue'
import { Carousel3dPlugin } from '@nanoandrew4/vue-carousel-3d'

const app = createApp(App)

app.use(Carousel3dPlugin)
```
This will make **&lt;Carousel3d&gt;** and **&lt;Slide&gt;** available to all components within your Vue app.

##### Usage (Local)

Include the Carousel 3d into your component using import:

``` js
import '@nanoandrew4/vue3-carousel-3d/dist/style.css'
import { Carousel3d, Slide } from '@nanoandrew4/vue-carousel-3d';

export default {
  ...
  components: {
    Carousel3d,
    Slide
  }
  ...
};
```

## HTML Structure

Once the **Carousel3d** and **Slide** components are installed globally or imported, they can be used in templates like below:

``` html
  <Carousel3d>
    <Slide :index="0">
      Slide 1 Content
    </Slide>
    <Slide :index="1">
      Slide 2 Content
    </Slide>
  </Carousel3d>
```

Keep in mind that **index** property on slide component is required property and you will need to pass it for every slide starting from 0

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

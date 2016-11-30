## INF5750 Data store App (Group project - Autumn 2016)
![banner](https://wiki.uio.no/mn/ifi/inf5750/images/8/87/Banner.png)

This repository hosts source code the group project of Open Source Development course (University of Oslo Autumn 2016). The main idea is to provide convenient way to access and modify data from data store module of [DHIS2](https://www.dhis2.org/) system.

## Team members
- [Marius Andresen](https://github.com/kalosar)
- [Zufarzhan Ismanov](https://github.com/zufarzhan)
- [Ilia Ni](https://github.com/neeilya)

## Installation instructions
- Install [npm/node](https://nodejs.org/en/)
- Install [webpack](https://webpack.github.io/) globally `(sudo) npm install -G webpack`
- In the root of the project run `npm install` command
- Run `webpack` command
- Go to build and open index.html file in browser

## Development
- Install webpack-dev-server globally `sudo npm install -G webpack-dev-server`
- Go to project root
- Run `npm run dev`
- Go to http://localhost:8080/build/index.html
- Add http://localhost:8080 URL to DHIS2 CORS white list:
  - Login to https://play.dhis2.org/demo
  - Go to apps -> System Settings -> Access
  - Check if http://localhost:8080 is in the list

## Tools and libraries used
- [VueJs 2.0](https://github.com/vuejs/vue) - MVVM JavaScript library
- [VueMaterial](https://github.com/marcosmoura/vue-material) - material theme for Vue
- [Webpack](https://github.com/webpack/webpack) - module bundler
- [Babel](https://github.com/babel/babel-loader) - ES6 webpack loader
- [Chart.js](https://github.com/chartjs/Chart.js) - chart library
- [Store.js](https://github.com/marcuswestin/store.js/) - localStorage wrapper
- [Sass](https://github.com/sass/sass) - styles preprocessor
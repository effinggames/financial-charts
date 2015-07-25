Express-Template
=================

Template for a standard Express 4 application.

### Usage:

```
git clone https://github.com/robgraeber/express-template.git && cd express-template
(setup env variables)
gulp build
npm start
```

Env variables required:
`NODE_ENV`: Set to 'production' for template caching

Gulp Tasks:
`gulp clean`: Cleans the /public folder and all compiled assets
`gulp default`: Compiles the assets without minifying / compressing
`gulp watch`: Watches the js, css, and image files for changes to recompile
`gulp build`: Compiles, minifies, and compresses the assets for production

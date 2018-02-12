Financial-Chart
=================

Chart for "Stock Asset Allocation vs Annualized 10-Year SPX Return".

Using node, express, highcharts, angular.

Displays data generated from here: https://github.com/effinggames/financial-scraper

### Usage:

```
git clone https://github.com/effinggames/financial-chart.git && cd financial-chart
npm install
(setup env variables)
npm start
```

Env variables:  
`NODE_ENV`: Set to 'production' for template caching  
`DATABASE_URL`: Postgres connection string (required)

Gulp Tasks:  
`gulp clean`: Cleans the /public folder and all compiled assets  
`gulp default`: Compiles the js / css without minifying / compressing  
`gulp watch`: Watches the js, css, and image files for changes to recompile  
`gulp build`: Compiles, minifies, and compresses the assets (for production)  

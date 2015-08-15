'use strict';
const NamedRouter = require('named-router');
const Promise = require('bluebird');
const Knex = require('./DatabaseHelper').knex;
const Regression = require('regression');

const render = (viewName, params) => (req, res) => res.render(viewName, params);

/**
 * Singleton router for all the frontend routes
 */
class AppRouter extends NamedRouter {
    constructor() {
        super();
        this.get('/', 'index', (req, res) => {
            //query for allocation + spx 10 year return data
            const query1 = Knex.raw(`
                SELECT b.date, percentage AS allocation, return_10
                FROM analysis.sp_500_annualized_return a, analysis.stock_asset_allocation b
                WHERE (date_trunc('month', a.date + INTERVAL '1 day') = date_trunc('month', b.date))
                AND b.percentage IS NOT NULL
            `).then(rsp => rsp.rows);

            //correlation query
            const query2 = Knex('analysis.stock_allocation_vs_return_corr')
                .select('return_10');

            //fetch queries
            Promise.join(query1, query2).spread((rows1, rows2) => {
                //format dates
                rows1.forEach(i => i.date = i.date.toISOString().slice(0, 10));

                //calculate linear regression
                const regressionData = rows1.filter(i => !!i.return_10).map(i => [i.allocation, i.return_10]);
                const regressionResults = Regression('linear', regressionData);
                const latestAllocation = rows1[rows1.length - 1].allocation;
                const expectedReturns = regressionResults.equation[0] * latestAllocation + regressionResults.equation[1];

                const data = {
                    chartData: rows1,
                    correlationSquared: Math.pow(rows2[0].return_10, 2),
                    expectedReturns
                };
                res.render('index', { data: data });
            });
        });
    }
}

module.exports = new AppRouter();

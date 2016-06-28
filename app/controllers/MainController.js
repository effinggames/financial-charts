'use strict';
const Knex = require('../DatabaseHelper').knex;
const Promise = require('bluebird');
const Regression = require('regression');

class MainController {
    getHomePage(req, res) {
        //query for allocation + spx 10 year return data
        const query1 = Knex.raw(`
                SELECT b.date, b.percentage, a.return_10
                FROM analysis.sp_500_annualized_return a, usa.stock_asset_allocation b
                WHERE (date_trunc('month', a.date + INTERVAL '1 day') = date_trunc('month', b.date))
                AND b.percentage IS NOT NULL
            `).then(rsp => rsp.rows);

        //correlation query
        const query2 = Knex('analysis.usa_stock_allocation_vs_return_corr')
            .select('return_10');

        //fetch queries
        Promise.all([query1, query2]).spread((rows1, rows2) => {
            //format dates
            rows1.forEach(i => i.date = i.date.toISOString().slice(0, 10));

            //calculate linear regression
            const regressionData = rows1.filter(i => !!i.return_10).map(i => [parseFloat(i.percentage), i.return_10]);
            const regressionResults = Regression('linear', regressionData);
            const latestAllocation = rows1[rows1.length - 1].percentage;
            const expectedReturns = regressionResults.equation[0] * latestAllocation + regressionResults.equation[1];

            res.render('usa-allocation', {
                title: 'Stock Asset Allocation vs SPX 10-Year Return',
                correlationSquared: Math.pow(rows2[0].return_10, 2),
                expectedReturns,
                data: {
                    chartData: rows1
                }
            });
        });
    }

    getEuropeAllocationChart(req, res) {
        //query for allocation + spx 10 year return data
        const query1 = Knex.raw(`
                SELECT b.date, b.percentage, a.return_10
                FROM analysis.eafe_annualized_return a, europe.stock_asset_allocation b
                WHERE (date_trunc('month', a.date + INTERVAL '1 day') = date_trunc('month', b.date))
                AND b.percentage IS NOT NULL
            `).then(rsp => rsp.rows);

        //correlation query
        const query2 = Knex('analysis.europe_stock_allocation_vs_return_corr')
            .select('return_10');

        //fetch queries
        Promise.all([query1, query2]).spread((rows1, rows2) => {
            //format dates
            rows1.forEach(i => i.date = i.date.toISOString().slice(0, 10));

            //calculate linear regression
            const regressionData = rows1.filter(i => !!i.return_10).map(i => [parseFloat(i.percentage), i.return_10]);
            const regressionResults = Regression('linear', regressionData);
            const latestAllocation = rows1[rows1.length - 1].percentage;
            const expectedReturns = regressionResults.equation[0] * latestAllocation + regressionResults.equation[1];

            res.render('europe-allocation', {
                title: 'Stock Asset Allocation vs EAFE 10-Year Return',
                correlationSquared: Math.pow(rows2[0].return_10, 2),
                expectedReturns,
                data: {
                    chartData: rows1
                }
            });
        });
    }
}

module.exports = new MainController();

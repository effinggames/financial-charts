'use strict';
const Knex = require('../DatabaseHelper').knex;
const Promise = require('bluebird');
const Regression = require('regression');
const Moment = require('moment-timezone');

class MainController {
    getHomePage(req, res) {
        //query for allocation + spx 10 year return data
        const query1 = Knex.raw(`
                SELECT b.date, b.percentage::FLOAT, a.return_10
                FROM analysis.sp_500_annualized_return a, usa.stock_asset_allocation b
                WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
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
            const regressionData = rows1.filter(i => !!i.return_10).map(i => [i.percentage, i.return_10]);
            const regressionResults = Regression('linear', regressionData);
            const latestAllocation = rows1[rows1.length - 1].percentage;
            const expectedReturns = regressionResults.equation[0] * latestAllocation + regressionResults.equation[1];

            const lastUpdatedDate = Moment(new Date(rows1[rows1.length - 1].date)).tz('GMT').format('M/D/YYYY');

            res.render('usa-allocation', {
                title: 'Stock Asset Allocation vs SPX 10-Year Return',
                correlationSquared: Math.pow(rows2[0].return_10, 2),
                expectedReturns,
                lastUpdatedDate,
                data: {
                    chartData: rows1
                }
            });
        });
    }

    getEuropeAllocationChart(req, res) {
        //query for allocation + spx 10 year return data
        const query1 = Knex.raw(`
                SELECT b.date, b.percentage::FLOAT, a.return_10
                FROM analysis.eafe_annualized_return a, europe.stock_asset_allocation b
                WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
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
            const regressionData = rows1.filter(i => !!i.return_10).map(i => [i.percentage, i.return_10]);
            const regressionResults = Regression('linear', regressionData);
            const latestAllocation = rows1[rows1.length - 1].percentage;
            const expectedReturns = regressionResults.equation[0] * latestAllocation + regressionResults.equation[1];
            const lastUpdatedDate = Moment(new Date(rows1[rows1.length - 1].date)).tz('GMT').format('M/D/YYYY');

            //gets the latest EAFE value
            const latestEAFEQuery = Knex('europe.eafe_daily')
                .orderBy('date', 'desc')
                .limit(1);

            //gets the EAFE value for last allocation update
            const latestAllocationEAFEQuery = Knex('europe.eafe_daily')
                .orderBy('date', 'desc')
                .whereRaw(`date <= '${Moment(new Date(rows1[rows1.length - 1].date)).tz('GMT').format('YYYY-MM-DD')}'`)
                .limit(1);

            Promise.all([latestEAFEQuery, latestAllocationEAFEQuery]).spread((latestEAFERows, latestAllocationEAFERows) => {
                const latestEAFEValue = parseFloat(latestEAFERows[0].value);
                const latestAllocationEAFEValue = parseFloat(latestAllocationEAFERows[0].value);
                const additionalReturns = Math.pow(latestAllocationEAFEValue / latestEAFEValue, 0.1) - 1;
                const extrapolatedReturns = expectedReturns + additionalReturns;
                const lastExtrapolatedDate = Moment(new Date(latestEAFERows[0].date)).tz('GMT').format('M/D/YYYY');

                res.render('europe-allocation', {
                    title: 'Stock Asset Allocation vs EAFE 10-Year Return',
                    correlationSquared: Math.pow(rows2[0].return_10, 2),
                    expectedReturns,
                    extrapolatedReturns,
                    lastUpdatedDate,
                    lastExtrapolatedDate,
                    data: {
                        chartData: rows1
                    }
                });
            });
        });
    }
}

module.exports = new MainController();

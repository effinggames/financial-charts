'use strict';
const Knex = require('./app/DatabaseHelper').knex;
const Promise = require('bluebird');
const Regression = require('regression');

//Rough script to test active trading based on investor allocation vs holding sp500 directly
class Backtest {
  constructor() {
    const usaAllocationQuery = Knex.raw(
      `
        SELECT b.date, b.percentage::FLOAT, a.return_10
        FROM analysis.sp_500_annualized_return a, usa.stock_asset_allocation b
        WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
      `
    ).then(rsp => rsp.rows);

    const euAllocationQuery = Knex.raw(
      `
        SELECT b.date, b.percentage::FLOAT, a.return_10
        FROM analysis.eafe_annualized_return a, europe.stock_asset_allocation b
        WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
      `
    ).then(rsp => rsp.rows);

    const sp500MonthlyQuery = Knex.raw(`
        SELECT a.date, a.adjusted_close AS value
        FROM usa.sp_500_monthly a, usa.stock_asset_allocation b
        WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
      `);

    const eafeMonthlyQuery = Knex.raw(`
        SELECT a.date, a.value
        FROM europe.eafe_monthly a, europe.stock_asset_allocation b
        WHERE (date_trunc('month', a.date + INTERVAL '1 month') = date_trunc('month', b.date))
      `);

    Promise.all([usaAllocationQuery, euAllocationQuery, sp500MonthlyQuery, eafeMonthlyQuery]).spread(function(
      usaAllocations,
      euAllocations,
      sp500Monthly,
      eafeMonthly
    ) {
      const eafeRegressionData = euAllocations.filter(i => !!i.return_10).map(i => [i.percentage, i.return_10]);
      const eafeRegressionResults = Regression('linear', eafeRegressionData);
      const sp500RegressionData = usaAllocations.filter(i => !!i.return_10).map(i => [i.percentage, i.return_10]);
      const sp500RegressionResults = Regression('linear', sp500RegressionData);

      const usaAllocationsFiltered = usaAllocations.filter(function(item) {
        return item.date.getTime() >= euAllocations[0].date.getTime();
      });

      const sp500MonthlyFiltered = sp500Monthly.rows.filter(function(item) {
        return item.date.getTime() >= euAllocations[0].date.getTime() - 172800000;
      });

      const eafeMonthlyFiltered = eafeMonthly.rows.filter(function(item) {
        return item.date.getTime() >= euAllocations[0].date.getTime() - 172800000;
      });

      const activePortfolio = {
        name: 'active',
        sp500Shares: 0,
        eafeShares: 0
      };
      const eafePortfolio = {
        name: 'eafe',
        sp500Shares: 0,
        eafeShares: 0
      };
      const sp500Portfolio = {
        name: 'sp500',
        sp500Shares: 0,
        eafeShares: 0
      };

      const monthlyDeposit = 1000;
      for (let i = 0; i < euAllocations.length; i++) {
        const euLatestAllocation = euAllocations[i].percentage;
        const usaLatestAllocation = usaAllocationsFiltered[i].percentage;
        const eafeExpectedReturns =
          eafeRegressionResults.equation[0] * euLatestAllocation + eafeRegressionResults.equation[1];
        const sp500ExpectedReturns =
          sp500RegressionResults.equation[0] * usaLatestAllocation + sp500RegressionResults.equation[1];
        const sp500Price = parseFloat(sp500MonthlyFiltered[i].value);
        const eafePrice = parseFloat(eafeMonthlyFiltered[i].value);

        console.log(
          'SP500 vs EAFE expected returns:',
          sp500ExpectedReturns,
          eafeExpectedReturns,
          euAllocations[i].date
        );

        if (sp500ExpectedReturns > eafeExpectedReturns) {
          activePortfolio.sp500Shares += monthlyDeposit / sp500Price;
        } else {
          activePortfolio.eafeShares += monthlyDeposit / eafePrice;
        }

        eafePortfolio.eafeShares += monthlyDeposit / eafePrice;
        sp500Portfolio.sp500Shares += monthlyDeposit / sp500Price;
      }
      const results = [activePortfolio, eafePortfolio, sp500Portfolio].map(function(portfolio) {
        const eafeValue = parseFloat(eafeMonthlyFiltered[eafeMonthlyFiltered.length - 1].value) * portfolio.eafeShares;
        const sp500Value =
          parseFloat(sp500MonthlyFiltered[sp500MonthlyFiltered.length - 1].value) * portfolio.sp500Shares;

        return {
          name: portfolio.name,
          eafeValue,
          sp500Value,
          totalValue: eafeValue + sp500Value
        };
      });
      console.log(results);
    });
  }
}

module.exports = new Backtest();

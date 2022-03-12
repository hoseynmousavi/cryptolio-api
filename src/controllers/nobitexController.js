import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import nobitexConstant from "../constants/nobitexConstant"
import countAllTransfers from "../helpers/countAllTransfers"

function getUserExchangeData({userExchange})
{
    return Promise.all([
        request.get({nobitexUserExchange: userExchange, url: nobitexConstant.getAccounts}),
        request.get({isKucoin: true, url: kucoinConstant.prices}),
        request.get({nobitexUserExchange: userExchange, url: nobitexConstant.depositsAndWithdraws}),
        request.get({url: nobitexConstant.usdtPrice}),
    ])
        .then(([{wallets: accountsArr}, {data: pricesTemp}, {deposits, withdraws}, {stats: {"usdt-rls": {bestSell: usdtPrice}}}]) =>
        {
            const prices = {...pricesTemp, "RLS": 1 / usdtPrice}

            let accounts = {}

            for (let i = 0; i < accountsArr.length; i++)
            {
                const item = accountsArr[i]
                if (+item.balance > 0)
                {
                    const currency = item.currency.toUpperCase()
                    if (accounts[currency])
                    {
                        accounts[currency].balance += +item.balance
                        accounts[currency].available += +item.activeBalance
                    }
                    else
                    {
                        accounts[currency] = {currency, balance: +item.balance, available: +item.activeBalance}
                    }
                }
            }

            Object.values(accounts).forEach(item =>
            {
                if (prices[item.currency])
                {
                    item.balanceInUSDT = item.balance * (+prices[item.currency])
                    item.availableInUSDT = item.available * (+prices[item.currency])
                }
                else
                {
                    item.balanceInUSDT = 0
                    item.availableInUSDT = 0
                }
            })

            accounts = Object.values(accounts).sort((a, b) => b.balanceInUSDT - a.balanceInUSDT)

            return Promise.all([
                countAllTransfers({items: withdraws, field: "amount", usdtPrice}),
                countAllTransfers({items: deposits, field: "amount", usdtPrice}),
            ])
                .then(([withdrawsAmount, depositsAmount]) =>
                {
                    const balance = accounts.reduce((sum, item) => sum + item.balanceInUSDT, 0)
                    const available = accounts.reduce((sum, item) => sum + item.availableInUSDT, 0)
                    const profitOrLoss = balance + withdrawsAmount - depositsAmount
                    const profitOrLossTemp = (balance + withdrawsAmount) / depositsAmount
                    const profitOrLossPercent = profitOrLossTemp <= 1 ? -(1 - profitOrLossTemp) * 100 : (profitOrLossTemp - 1) * 100
                    return ({accounts, available, balance, profitOrLoss, profitOrLossPercent, withdrawsAmount, depositsAmount, withdraws, deposits})
                })
        })
}

const nobitexController = {
    getUserExchangeData,
}

export default nobitexController
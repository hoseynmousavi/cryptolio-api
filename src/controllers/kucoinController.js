import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import countAllTransfers from "../helpers/countAllTransfers"

function getUserExchangeData({userExchange})
{
    return Promise.all([
        request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.getAccounts}),
        request.get({isKucoin: true, url: kucoinConstant.prices}),
        request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.deposits}),
        request.get({kuCoinUserExchange: userExchange, url: kucoinConstant.withdrawals}),
    ])
        .then(([{data: accountsArr}, {data: prices}, {data: {items: deposits}}, {data: {items: withdraws}}]) =>
        {
            let accounts = {}

            for (let i = 0; i < accountsArr.length; i++)
            {
                const item = accountsArr[i]
                if (accounts[item.currency])
                {
                    accounts[item.currency].balance += +item.balance
                    accounts[item.currency].available += +item.available
                }
                else
                {
                    accounts[item.currency] = {currency: item.currency, balance: +item.balance, available: +item.available}
                }
            }

            Object.values(accounts).forEach(item =>
            {
                item.balanceInUSDT = item.balance * (+prices[item.currency])
                item.availableInUSDT = item.available * (+prices[item.currency])
            })

            accounts = Object.values(accounts).sort((a, b) => b.balanceInUSDT - a.balanceInUSDT)

            return Promise.all([
                countAllTransfers({items: withdraws, field: "amount"}),
                countAllTransfers({items: deposits, field: "amount"}),
            ])
                .then(([withdrawsAmount, depositsAmount]) =>
                {
                    const balance = accounts.reduce((sum, item) => sum + item.balanceInUSDT, 0)
                    const available = accounts.reduce((sum, item) => sum + item.availableInUSDT, 0)
                    const profitOrLoss = balance + withdrawsAmount - depositsAmount
                    const profitOrLossTemp = (balance + withdrawsAmount) / depositsAmount
                    const profitOrLossPercent = profitOrLossTemp <= 1 ? (1 - profitOrLossTemp) * 100 : (profitOrLossTemp - 1) * 100
                    return ({accounts, available, balance, profitOrLoss, profitOrLossPercent, withdrawsAmount, depositsAmount, withdraws, deposits})
                })
        })
}

const kucoinController = {
    getUserExchangeData,
}

export default kucoinController
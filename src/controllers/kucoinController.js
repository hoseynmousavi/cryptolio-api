import request from "../request/request"
import kucoinConstant from "../constants/kucoinConstant"
import countAllTransfers from "../helpers/countAllTransfers"
import countSixMonth from "../helpers/countSixMonth"
import orderController from "./orderController"
import userSpotSocket from "../helpers/kucoin/userSpotSocket"

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
                if (+item.balance > 0)
                {
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
            }

            Object.values(accounts).forEach(item =>
            {
                item.balanceInUSDT = item.balance * (+prices[item.currency])
                item.availableInUSDT = item.available * (+prices[item.currency])
            })

            accounts = Object.values(accounts).sort((a, b) => b.balanceInUSDT - a.balanceInUSDT)

            return Promise.all([
                countAllTransfers({items: withdraws}),
                countAllTransfers({items: deposits}),
            ])
                .then(([withdraws, deposits]) =>
                {
                    const withdrawsAmount = withdraws.reduce((sum, item) => sum + item.usdtAmount, 0)
                    const depositsAmount = deposits.reduce((sum, item) => sum + item.usdtAmount, 0)
                    const balance = accounts.reduce((sum, item) => sum + item.balanceInUSDT, 0)
                    const available = accounts.reduce((sum, item) => sum + item.availableInUSDT, 0)
                    const profitOrLoss = balance + withdrawsAmount - depositsAmount
                    const profitOrLossTemp = (balance + withdrawsAmount) / depositsAmount
                    const profitOrLossPercent = profitOrLossTemp <= 1 ? -(1 - profitOrLossTemp) * 100 : (profitOrLossTemp - 1) * 100
                    const diagram = countSixMonth({withdraws, deposits, balance})
                    return ({diagram, accounts, available, balance, profitOrLoss, profitOrLossPercent, withdrawsAmount, depositsAmount, withdraws, deposits})
                })
        })
}

function getSpotAccountOverview({userExchange, currency, type})
{
    return request.get({
        url: kucoinConstant.getAccountOverview({currency, type}),
        isKuCoin: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res => res.data)
}

function createSpotOrder({userExchange, order: {type, clientOid, side, symbol, stop, stopPrice, price, size}})
{
    const isStop = stop && stopPrice
    request.post({
        url: isStop ? kucoinConstant.stopOrder : kucoinConstant.order,
        isKuCoin: true,
        kuCoinUserExchange: userExchange,
        data: {
            remark: "coinjet bot added this",
            ...(stop && stopPrice ? {stop, stopPrice} : {}),
            ...(price ? {price} : {}),
            type, clientOid, side, symbol, size,
        },
    })
        .then(res =>
        {
            console.log(res)
            if (res?.data?.orderId)
            {
                orderController.updateOrder({query: {_id: clientOid}, update: {exchange_order_id: res.data.orderId}})
            }
            else
            {
                orderController.removeOrder({order_id: clientOid})
            }
        })
        .catch(err =>
        {
            console.error({err: err?.response?.data})
            orderController.removeOrder({order_id: clientOid})
        })
}

function startSpotWebsocket()
{
    userSpotSocket.start()
}

function cancelSpotOrder({userExchange, exchange_order_id, isStop})
{
    request.del({
        url: isStop ? kucoinConstant.cancelStopOrder(exchange_order_id) : kucoinConstant.cancelOrder(exchange_order_id),
        isKuCoin: true,
        kuCoinUserExchange: userExchange,
    })
        .then(res =>
        {
            if (res?.data?.cancelledOrderIds?.length)
            {
                orderController.updateOrder({query: {exchange_order_id}, update: {status: "canceled"}})
            }
        })
        .catch(err =>
        {
            console.error({err: err?.response?.data})
        })
}

const kucoinController = {
    getUserExchangeData,
    getSpotAccountOverview,
    createSpotOrder,
    startSpotWebsocket,
    cancelSpotOrder,
}

export default kucoinController
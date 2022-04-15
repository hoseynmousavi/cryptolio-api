import kucoinController from "../../controllers/kucoinController"
import orderController from "../../controllers/orderController"
import getCurrencyFromPair from "../getCurrencyFromPair"
import pairToSpotSymbol from "./pairToSpotSymbol"
import notifController from "../../controllers/notifController"
import notifConstant from "../../constants/notifConstant"

function createSpotEntryOrders({userExchanges, signal})
{
    userExchanges.forEach(userExchange =>
    {
        kucoinController.getSpotAccountOverview({userExchange, currency: getCurrencyFromPair({index: 1, pair: signal.pair}), type: "trade"})
            .then(accounts =>
            {
                const {available} = accounts[0] || {}
                const availableBalance = +available
                if (+availableBalance.toFixed() > 0)
                {
                    const balance = availableBalance * (signal.use_percent / 100) / signal.entry.length
                    signal.entry.forEach((price, index) =>
                    {
                        const size = (balance / price).toFixed(8)
                        const symbol = pairToSpotSymbol({pair: signal.pair})
                        orderController.addOrder({
                            user_exchange_id: userExchange._id,
                            signal_id: signal._id,
                            price,
                            size,
                            symbol,
                            type: "entry",
                            entry_or_tp_index: index,
                            status: "open",
                        })
                            .then(order =>
                            {
                                kucoinController.createSpotOrder({
                                    userExchange,
                                    order: {
                                        type: "limit",
                                        clientOid: order._id,
                                        side: "buy",
                                        symbol: order.symbol,
                                        price: order.price,
                                        size: order.size,
                                    },
                                })
                            })
                    })
                    notifController.saveNotifByUserExchange({
                        userId: userExchange.user_id,
                        userExchangeId: userExchange._id,
                        signalId: signal._id,
                        text: notifConstant.signalFoundAndOrdersCreated({ordersCount: signal.entry.length}),
                    })
                }
                else
                {
                    notifController.saveNotifByUserExchange({
                        userId: userExchange.user_id,
                        userExchangeId: userExchange._id,
                        signalId: signal._id,
                        text: notifConstant.signalFoundButNoBalance,
                    })
                }
            })
    })
}

export default createSpotEntryOrders
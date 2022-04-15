import signalController from "../../controllers/signalController"
import orderController from "../../controllers/orderController"
import kucoinController from "../../controllers/kucoinController"
import notifController from "../../controllers/notifController"
import notifConstant from "../../constants/notifConstant"

function createSpotStopAndTpOrders({entryOrder, userExchange})
{
    signalController.getSignalById({signal_id: entryOrder.signal_id})
        .then(signal =>
        {
            orderController.addOrder({
                user_exchange_id: userExchange._id,
                signal_id: entryOrder.signal_id,
                price: signal.stop,
                size: entryOrder.size,
                symbol: entryOrder.symbol,
                type: "stop",
                entry_fill_index: entryOrder.entry_or_tp_index,
                status: "open",
            })
                .then(order =>
                {
                    kucoinController.createSpotOrder({
                        userExchange,
                        order: {
                            type: "market",
                            clientOid: order._id,
                            side: "sell",
                            symbol: order.symbol,
                            size: order.size,
                            stop: "loss",
                            stopPrice: order.price,
                        },
                    })
                })

            signal.target.forEach((price, index) =>
            {
                const size = entryOrder.size / signal.target.length
                orderController.addOrder({
                    user_exchange_id: userExchange._id,
                    signal_id: entryOrder.signal_id,
                    price,
                    size,
                    symbol: entryOrder.symbol,
                    type: "tp",
                    entry_fill_index: entryOrder.entry_or_tp_index,
                    entry_or_tp_index: index,
                    status: "open",
                })
                    .then(order =>
                    {
                        kucoinController.createSpotOrder({
                            userExchange,
                            order: {
                                type: "market",
                                clientOid: order._id,
                                side: "sell",
                                symbol: order.symbol,
                                size: order.size,
                                stop: "entry",
                                stopPrice: price,
                            },
                        })
                    })
            })

            notifController.saveNotifByUserExchange({
                userId: userExchange.user_id,
                userExchangeId: userExchange._id,
                signalId: signal._id,
                text: notifConstant.entryOrderFilledAndOrdersAdded({tpCount: signal.target.length, entryIndex: entryOrder.entry_or_tp_index + 1}),
            })
        })
}

export default createSpotStopAndTpOrders
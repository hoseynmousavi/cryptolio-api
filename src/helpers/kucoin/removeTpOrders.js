import orderController from "../../controllers/orderController"
import signalController from "../../controllers/signalController"
import kucoinController from "../../controllers/kucoinController"
import notifController from "../../controllers/notifController"
import notifConstant from "../../constants/notifConstant"

function removeTpOrders({stopOrder, userExchange})
{
    signalController.getSignalById({signal_id: stopOrder.signal_id})
        .then(signal =>
        {
            orderController.findOrders({query: {user_id: userExchange.user_id, type: "tp", entry_fill_index: stopOrder.entry_fill_index, signal_id: signal._id}})
                .then(orders =>
                {
                    orders.forEach(order =>
                    {
                        kucoinController.cancelSpotOrder({isStop: true, userExchange, exchange_order_id: order.exchange_order_id})
                    })
                    notifController.saveNotifByUserExchange({
                        userId: userExchange.user_id,
                        userExchangeId: userExchange._id,
                        signalId: signal._id,
                        text: notifConstant.stopSignalAndTpOrdersRemoved
                    })
                })
        })
}

export default removeTpOrders
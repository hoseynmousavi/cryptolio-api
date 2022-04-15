const kucoinConstant = {
    getAccounts: "/api/v1/accounts",
    prices: "/api/v1/prices",
    deposits: "/api/v1/deposits?status=SUCCESS",
    withdrawals: "/api/v1/withdrawals?status=SUCCESS",

    getAccountOverview: ({currency, type}) => `/api/v1/accounts${currency && type ? `?currency=${currency}&type=${type}` : ""}`,
    getPrivateSocket: "/api/v1/bullet-private",
    order: "/api/v1/orders",
    cancelOrder: exchange_order_id => `/api/v1/orders/${exchange_order_id}`,
    stopOrder: "/api/v1/stop-order",
    cancelStopOrder: exchange_order_id => `/api/v1/stop-order/${exchange_order_id}`,
}

export default kucoinConstant
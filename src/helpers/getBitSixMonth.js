import request from "../request/request"

function getBitSixMonth()
{
    const month1Date = new Date().setHours(0, 0, 0, 0)
    const month2Date = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
    const month3Date = new Date(new Date().setDate(new Date().getDate() - 60)).setHours(0, 0, 0, 0)
    const month4Date = new Date(new Date().setDate(new Date().getDate() - 90)).setHours(0, 0, 0, 0)
    const month5Date = new Date(new Date().setDate(new Date().getDate() - 120)).setHours(0, 0, 0, 0)
    const month6Date = new Date(new Date().setDate(new Date().getDate() - 150)).setHours(0, 0, 0, 0)

    return Promise.all([
        request.get({isPrice: true, url: `/price/BTC/${month1Date}`}),
        request.get({isPrice: true, url: `/price/BTC/${month2Date}`}),
        request.get({isPrice: true, url: `/price/BTC/${month3Date}`}),
        request.get({isPrice: true, url: `/price/BTC/${month4Date}`}),
        request.get({isPrice: true, url: `/price/BTC/${month5Date}`}),
        request.get({isPrice: true, url: `/price/BTC/${month6Date}`}),
    ])
        .then(([{price: price1}, {price: price2}, {price: price3}, {price: price4}, {price: price5}, {price: price6}]) =>
        {
            return [price1, price2, price3, price4, price5, price6]
        })
}

export default getBitSixMonth
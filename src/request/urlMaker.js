import data from "../data"

function urlMaker({isKuCoin, isTelegram, isPrice, url, param})
{
    return (isKuCoin ? data.kuCoinBase : isTelegram ? data.telegramApi + data.telegramToken : isPrice ? data.priceBase : data.nobitexBase) + url + (param ? "/" + param : "")
}

export default urlMaker
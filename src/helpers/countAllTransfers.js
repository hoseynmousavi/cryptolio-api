import request from "../request/request"

function countAllTransfers({items, field, usdtPrice})
{
    return new Promise(resolve =>
    {
        let remained = items.length
        let sum = 0
        items.forEach(item =>
        {
            let currency = (item.transaction?.currency || item.currency).toUpperCase()
            let amount = +(item.transaction?.[field] || item[field])
            let createdAt = new Date(item.createdAt || item.transaction.created_at).getTime()

            if (currency === "USDT")
            {
                sum += amount
                remained--

                if (remained === 0) resolve(sum)
            }
            else if (currency === "RLS")
            {
                sum += amount / usdtPrice
                remained--

                if (remained === 0) resolve(sum)
            }
            else
            {
                request.get({isPrice: true, url: `/price/${currency}/${createdAt}`})
                    .then(res =>
                    {
                        const {price} = res || {}
                        if (price)
                        {
                            sum += amount * price
                            remained--
                        }
                        else
                        {
                            console.log("NONE PRICE", currency + " " + createdAt)
                            remained--
                        }

                        if (remained === 0) resolve(sum)
                    })
                    .catch(() =>
                    {
                        console.log("NONE PRICE", currency + " " + createdAt)
                        remained--

                        if (remained === 0) resolve(sum)
                    })
            }
        })
    })
}

export default countAllTransfers
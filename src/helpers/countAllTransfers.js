import request from "../request/request"

function countAllTransfers({items, usdtPrice})
{
    return new Promise(resolve =>
    {
        function checkForResolve()
        {
            if (itemsOutput.length === items.length) resolve(itemsOutput.sort((a, b) =>
            {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }))
        }

        const itemsOutput = []
        if (items.length)
        {
            items.forEach(item =>
            {
                let currency = (item.transaction?.currency || item.currency).toUpperCase()
                let amount = +(item.transaction?.amount || item.amount)
                let createdAt = new Date(item.createdAt || item.transaction.created_at).getTime()

                if (currency === "USDT")
                {
                    itemsOutput.push({currency, amount, createdAt, usdtAmount: amount})
                    checkForResolve()
                }
                else if (currency === "RLS")
                {
                    itemsOutput.push({currency, amount, createdAt, usdtAmount: amount / usdtPrice})
                    checkForResolve()
                }
                else
                {
                    request.get({isPrice: true, url: `/price/${currency}/${createdAt}`})
                        .then(res =>
                        {
                            const {price} = res || {}
                            if (price)
                            {
                                itemsOutput.push({currency, amount, createdAt, usdtAmount: amount * price})
                                checkForResolve()
                            }
                            else
                            {
                                itemsOutput.push({currency, amount, createdAt, usdtAmount: 0})
                                checkForResolve()
                                console.log("NONE PRICE", currency + " " + createdAt)
                            }
                        })
                        .catch(() =>
                        {
                            itemsOutput.push({currency, amount, createdAt, usdtAmount: 0})
                            checkForResolve()
                            console.log("NONE PRICE", currency + " " + createdAt)
                        })
                }
            })
        }
        else checkForResolve()
    })
}

export default countAllTransfers
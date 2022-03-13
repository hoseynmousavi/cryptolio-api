function countSixMonth({withdraws, deposits})
{
    const month1Date = new Date().setHours(0, 0, 0, 0)
    let month1Balance = 0
    const month2Date = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
    let month2Balance = 0
    const month3Date = new Date(new Date().setDate(new Date().getDate() - 60)).setHours(0, 0, 0, 0)
    let month3Balance = 0
    const month4Date = new Date(new Date().setDate(new Date().getDate() - 90)).setHours(0, 0, 0, 0)
    let month4Balance = 0
    const month5Date = new Date(new Date().setDate(new Date().getDate() - 120)).setHours(0, 0, 0, 0)
    let month5Balance = 0
    const month6Date = new Date(new Date().setDate(new Date().getDate() - 150)).setHours(0, 0, 0, 0)
    let month6Balance = 0

    for (let i = deposits.length - 1; i >= 0; i--)
    {
        const item = deposits[i]
        let createdAt = new Date(item.createdAt || item.transaction.created_at).getTime()
        if (createdAt < month6Date) month6Balance += item.usdtAmount
        if (createdAt < month5Date) month5Balance += item.usdtAmount
        if (createdAt < month4Date) month4Balance += item.usdtAmount
        if (createdAt < month3Date) month3Balance += item.usdtAmount
        if (createdAt < month2Date) month2Balance += item.usdtAmount
        if (createdAt < month1Date) month1Balance += item.usdtAmount
        else break
    }

    for (let i = withdraws.length - 1; i >= 0; i--)
    {
        const item = withdraws[i]
        let createdAt = new Date(item.createdAt || item.transaction.created_at).getTime()
        if (createdAt < month6Date) month6Balance -= item.usdtAmount
        if (createdAt < month5Date) month5Balance -= item.usdtAmount
        if (createdAt < month4Date) month4Balance -= item.usdtAmount
        if (createdAt < month3Date) month3Balance -= item.usdtAmount
        if (createdAt < month2Date) month2Balance -= item.usdtAmount
        if (createdAt < month1Date) month1Balance -= item.usdtAmount
        else break
    }

    return ({
        month1Date, month1Balance,
        month2Date, month2Balance,
        month3Date, month3Balance,
        month4Date, month4Balance,
        month5Date, month5Balance,
        month6Date, month6Balance,
    })
}

export default countSixMonth
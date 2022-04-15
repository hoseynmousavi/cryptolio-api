const notifConstant = {
    signalFoundButNoBalance: "سیگنال جدیدی دریافت شد اما به دلیل کمبود موجودی حسابتان، سفارشی ثبت نشد.",
    signalFoundAndOrdersCreated: ({ordersCount}) => `سیگنال اسپات جدیدی دریافت شد و ${ordersCount} اردر گذاشته شد.`,
    entryOrderFilledAndOrdersAdded: ({entryIndex, tpCount}) => `انتری ${entryIndex}م سیگنال fill شد، اردر استاپ و ${tpCount} اردر tp گذاشته شد.`,
    stopSignalAndTpOrdersRemoved: "سیگنال متوقف شد، اردرهای tp پاک شدند.",
    tpFilledAndDone: "آخرین اردر tp فیل شد! اردرها با موفقیت تمام شدند.",
    tpFilledAndStopUpdated: ({tpIndex}) => `اردر ${tpIndex}م tp فیل شد! اردر استاپ آپدیت شد.`,
}

export default notifConstant
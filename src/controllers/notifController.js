import mongoose from "mongoose"
import notifModel from "../models/notifModel"
import checkPermission from "../helpers/checkPermission"

const notifTb = mongoose.model("notification", notifModel)

function saveNotifByUserExchange({userId, userExchangeId, signalId, text})
{
    return new notifTb({user_id: userId, user_exchange_id: userExchangeId, signal_id: signalId, text}).save().then()
}

function getNotifRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            notifTb.find({user_id: _id})
                .then(notifications =>
                {
                    res.send({notifications})
                })
        })
}

const notifController = {
    saveNotifByUserExchange,
    getNotifRes,
}

export default notifController
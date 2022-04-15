import mongoose from "mongoose"
import signalModel from "../models/signalModel"
import createSpotEntryOrders from "../helpers/kucoin/createSpotEntryOrders"
import userExchangeController from "./userExchangeController"
import checkPermission from "../helpers/checkPermission"

const signalTb = mongoose.model("signal", signalModel)

function addSignalRes(req, res)
{
    checkPermission({req, res, minRole: "admin"})
        .then(() =>
        {
            const {signal} = req.body
            if (signal)
            {
                new signalTb(signal).save()
                    .then(addedSignal =>
                    {
                        res.send({message: "OK"})
                        userExchangeController.getUserExchanges({query: {exchange_id: "61b4799ee1699274c1a7e360"}})
                            .then(userExchanges =>
                            {
                                createSpotEntryOrders({userExchanges, signal: addedSignal})
                            })
                    })
                    .catch(err => res.status(400).send({message: err}))
            }
        })
}

function getSignalById({signal_id})
{
    return signalTb.findOne({_id: signal_id})
}

function getSignalsRes(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            signalTb.find()
                .then(signals => res.send({signals}))
        })
}

const signalController = {
    addSignalRes,
    getSignalById,
    getSignalsRes,
}

export default signalController
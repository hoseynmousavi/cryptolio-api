import mongoose from "mongoose"
import userExchangeModel from "../models/userExchangeModel"
import checkPermission from "../helpers/checkPermission"
import resConstant from "../constants/resConstant"
import kucoinController from "./kucoinController"
import nobitexController from "./nobitexController"

const userExchangeTb = mongoose.model("user-exchange", userExchangeModel)

function getUserExchanges({query, projection, options})
{
    return userExchangeTb.find(query, projection, options)
}

function addUserExchanges(userExchange)
{
    return new userExchangeTb(userExchange).save()
}

function removeUserExchanges({query})
{
    return userExchangeTb.deleteOne(query)
}

function getUserExchangesRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            getUserExchanges({query: {user_id: _id}})
                .then(userExchanges => res.send(userExchanges))
        })
}

function addUserExchangesRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            const {exchange_id, name, user_key, user_secret, user_passphrase} = req.body
            if (exchange_id && name && user_key)
            {
                const userExchange = {user_id: _id, exchange_id, name, user_key, user_secret, user_passphrase}
                (
                    exchange_id.toString() === "61b4799ee1699274c1a7e360" ?
                        kucoinController.getUserExchangeData({userExchange})
                        :
                        nobitexController.getUserExchangeData({userExchange}),
                )
                    .then(data =>
                    {
                        addUserExchanges(userExchange)
                            .then(item => res.send({_id: item._id, name: item.name, exchange_id: item.exchange_id, created_date: item.created_date, data}))
                            .catch(err =>
                            {
                                if (err?.keyPattern?.user_id && err?.keyPattern?.name) res.status(400).send({message: resConstant.nameAlreadyExists})
                                else res.status(400).send({message: err})
                            })
                    })
                    .catch((err) =>
                    {
                        console.log(err)
                        res.status(400).send({message: resConstant.incorrectData})
                    })
            }
        })
}

function deleteUserExchangesRes(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            const {userExchangeId} = req.body
            removeUserExchanges({query: {_id: userExchangeId, user_id: _id}})
                .then(() => res.send({message: "OK"}))
                .catch(err => res.status(400).send({message: err}))
        })
}

const userExchangeController = {
    getUserExchanges,
    getUserExchangesRes,
    addUserExchangesRes,
    deleteUserExchangesRes,
}

export default userExchangeController
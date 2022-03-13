import checkPermission from "../helpers/checkPermission"
import exchangeController from "./exchangeController"
import userExchangeController from "./userExchangeController"
import kucoinController from "./kucoinController"
import nobitexController from "./nobitexController"
import resConstant from "../constants/resConstant"

function getData(req, res)
{
    checkPermission({req, res})
        .then(({_id}) =>
        {
            Promise.all([
                exchangeController.getExchanges({}),
                userExchangeController.getUserExchanges({query: {user_id: _id}}),
            ])
                .then(([exchanges, userExchanges]) =>
                {
                    Promise.all(
                        userExchanges.map(userExchange =>
                            userExchange.exchange_id.toString() === "61b4799ee1699274c1a7e360" ?
                                kucoinController.getUserExchangeData({userExchange})
                                :
                                nobitexController.getUserExchangeData({userExchange}),
                        ),
                    )
                        .then(values =>
                        {
                            res.send({
                                exchanges,
                                user_exchanges: userExchanges.map((item, index) => ({_id: item._id, name: item.name, exchange_id: item.exchange_id, created_date: item.created_date, data: values[index]})),
                            })
                        })
                        .catch(() => res.status(400).send({message: resConstant.incorrectData}))
                })
        })
}

const dataController = {
    getData,
}

export default dataController
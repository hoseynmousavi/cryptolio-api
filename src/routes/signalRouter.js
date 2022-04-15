import routeConstant from "../constants/routeConstant"
import signalController from "../controllers/signalController"

function signalRouter(app)
{
    app.route(routeConstant.signal)
        .get(signalController.getSignalsRes)
        .post(signalController.addSignalRes)
}

export default signalRouter
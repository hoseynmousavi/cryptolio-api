import routeConstant from "../constants/routeConstant"
import dataController from "../controllers/dataController"

function dataRouter(app)
{
    app.route(routeConstant.getUserExchangesData)
        .get(dataController.getData)
}

export default dataRouter
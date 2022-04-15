import routeConstant from "../constants/routeConstant"
import notifController from "../controllers/notifController"

function notificationRouter(app)
{
    app.route(routeConstant.notification)
        .get(notifController.getNotifRes)
}

export default notificationRouter
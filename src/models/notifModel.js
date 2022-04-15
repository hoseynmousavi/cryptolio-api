import mongoose from "mongoose"

const schema = mongoose.Schema

const notifModel = new schema({
    user_exchange_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter user_exchange_id!",
    },
    signal_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter signal_id!",
    },
    user_id: {
        index: true,
        type: schema.Types.ObjectId,
        required: "enter user_id!",
    },
    text: {
        type: String,
        required: "enter text!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default notifModel
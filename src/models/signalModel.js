import mongoose from "mongoose"

const schema = mongoose.Schema

const signalModel = new schema({
    message: {
        type: String,
        required: "enter text!",
    },
    user_sender_id: {
        type: schema.Types.ObjectId,
        required: "enter user_sender_id!",
    },
    use_percent: {
        type: Number,
        required: "enter use_percent!",
    },
    title: {
        type: String,
        required: "enter title!",
    },
    pair: {
        type: String,
        required: "enter pair!",
    },
    stop: {
        type: Number,
        required: "enter stop!",
    },
    entry: {
        type: Array,
        required: "enter entry!",
    },
    target: {
        type: Array,
        required: "enter target!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default signalModel
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import data from "./data"
import exchangeRouter from "./routes/exchangeRouter"
import userRouter from "./routes/userRouter"
import userExchangeRouter from "./routes/userExchangeRouter"
import dataRouter from "./routes/dataRouter"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

userExchangeRouter(app)
exchangeRouter(app)
userRouter(app)
dataRouter(app)

app.listen(data.port, () => console.log(`server is Now Running on Port ${data.port}`))
import express from 'express'
import { PrismaSingleton } from './PrismaClient'
import { userRouter } from './router/userRouter'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
export const app = express()

// app.use(dotenv.config)
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/user",userRouter)

// app.use("/api/v1/messages", messageRouter)
// app.use("/api/v1/membership",membershipRouter)
// app.use("/api/v1/channel",channelRouter)
// app.use("/api/v1/origanization",organizationRouter)

// app.listen(3000,()=>{
//     console.log("Listening on port 3000")
// })
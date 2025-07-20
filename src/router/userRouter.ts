import exprees from 'express'
// import { PrismaSingleton } from '../PrismaClient'
import {hash,compare} from 'bcryptjs'
import {prisma} from '../test/__mock__/PrismaClient'
import {sign, verify} from 'jsonwebtoken'

export const userRouter = exprees.Router()

// const prisma  = PrismaSingleton.getInstance()
type ISignup= {
    firstname: string,
    lastname:string,
    password:string,
    email:string
}

userRouter.post("/signup",async (req,res)=>{
    try {
        const {firstname, lastname, password, email}:ISignup = req.body
        if(!firstname||!lastname||!password||!email){
            return res.status(400).json({message:"All fields are required"})
        }
        const hashedPassword = await hash(password,10)
    

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser: ISignup={
            firstname,
            lastname,
            password:hashedPassword,
            email,
        }
        const isCreated = await prisma.user.create({
            data:newUser
        })
        const refreshToken = sign(
            { id: isCreated.id, jti: crypto.randomUUID() },
            "kldfmjkel",
            { expiresIn: '7d' }
        );
        const accessToken = sign(
            { firstname, lastname, email },
            "kknejnjek",
            { expiresIn: '15m' }
        );

        res.cookie('token',refreshToken,{
            httpOnly:true,
            sameSite:'lax',
            maxAge:24*60*60*1000
        })
        console.log(isCreated)
        if(isCreated){
            return res.status(200).json({message:"User created suceessfully", accessToken})
        }else{
            return res.status(500).json({message:"Something went wrong"})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"something went wrong"})
    }
})
userRouter.post("/signin", async(req,res)=>{
    try {
        const {email,password} = req.body
        console.log(email,password)
        if(!email||!password){
            return res.status(400).json({message:"Fields are required"})
        }
        const doesExist = await prisma.user.findUnique({where:{email}})
        console.log("exists",doesExist)
        if(!doesExist){
            return res.status(402).json({message:"User doesnt exists"})
        }
        const isMatched = await compare(password,doesExist.password as string)
        const accessToken = sign({
            firstname:doesExist.firstname,
            lastname: doesExist.lastname,
            email:doesExist.email,
        
        },"kknejnjek",{expiresIn:'15m'})
        if(isMatched){
            return res.status(200).json({message:"Logged in successfull",accessToken})
        }
        return res.status(401).json({message:"wrong creds"})
    } catch (error) {
        return res.status(500).json({message:"Server side error"})
    }

})


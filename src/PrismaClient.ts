import { PrismaClient } from './generated/prisma'

export class PrismaSingleton{

    private static instance:PrismaClient
    constructor(){}
    public static getInstance(){
        if(!PrismaSingleton.instance){
            this.instance= new PrismaClient()
        }
        return PrismaSingleton.instance
    }
    
}

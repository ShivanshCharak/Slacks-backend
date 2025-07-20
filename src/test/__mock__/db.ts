import { Prisma, PrismaClient } from "../../generated/prisma";
import {mockDeep} from 'vitest-mock-extended' 
export const prisma  = mockDeep<PrismaClient>()
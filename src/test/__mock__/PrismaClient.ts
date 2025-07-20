import { PrismaClient } from "../../generated/prisma";
import { mockDeep, DeepMockProxy, mockReset } from "vitest-mock-extended";
import { beforeEach, vi } from "vitest";


beforeEach(()=>{
  mockReset(prisma)
})
export const prisma = mockDeep<PrismaClient>();


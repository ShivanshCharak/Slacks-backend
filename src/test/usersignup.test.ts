import { vi, describe, it, expect, beforeEach } from "vitest";
import { app } from "..";
import { prisma } from "./__mock__/PrismaClient";
import request from "supertest";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import {mockedUserdata,mockedRefreshToken,mockedUserSignUp} from './typesAndfakePool'

vi.mock("../../generated/prisma", () => ({
  prisma,
}));

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(() => "mocked.jwt.token"),
}));
vi.mock('bcryptjs',()=>({
  compare: vi.fn(()=> Promise.resolve(true)),
  hash:vi.fn(()=>Promise.resolve("hashedPassword123"))
}))


describe("User Auth Block", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Signup /post Route", () => {
 
    it("should signup a user and set a cookie", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce(mockedUserdata);
      prisma.refreshToken.create.mockResolvedValue(mockedRefreshToken);

      const res = await request(app)
        .post("/api/v1/user/signup")
        .send(mockedUserSignUp);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockedUserSignUp.email },
      });
      expect(res.status).toBe(200);
      expect(hash).toHaveBeenCalledWith(mockedUserSignUp.password,10)
      expect(sign).toHaveBeenCalledTimes(2);
      const response = res.headers["set-cookie"];
      expect(response).toBeTruthy();
    });
    it("Incomplete Data provided", async () => {
      const incompleteSignUp = {
        firstname: "john",
        lastname: "lennon",
      };
      const res = await request(app)
        .post("/api/v1/user/signup")
        .send(incompleteSignUp);
      expect(res.status).toBe(400);
    });
    it("User already exists", async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        ...mockedUserSignUp,
        id: "signupid",
      });
      const res = await request(app)
        .post("/api/v1/user/signup")
        .send(mockedUserSignUp);
      expect(res.status).toBe(409);
      expect(res.body.message).toEqual("User already exists");
    });
  });

  describe("Signin /post route",()=>{
    beforeEach(()=>{
      vi.clearAllMocks()
    })
    it("User shud able to signin", async()=>{
      prisma.user.findUnique.mockResolvedValue(mockedUserdata)
      const res  = await request(app).post("/api/v1/user/signin").send({
        password: "johnlennon@123",
        email: "johnlennon@gmail.com",
      })
      expect(res.status).toBe(200)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({where:{email:mockedUserdata.email}})
      expect(compare).toHaveBeenCalledWith("johnlennon@123",mockedUserdata.password)
      expect(sign).toBeCalledTimes(1)
    })
  })
  // describe("refresh /post",()=>)

});

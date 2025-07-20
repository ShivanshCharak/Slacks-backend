import { vi, beforeEach, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "..";
import {
  mockedDMChannelInfo,
  mockedDMInfo,
  mockedGroupInfo,
  mockedOragnizationInfo,
  mockedOrganizationChannelInfo,
  mockedUserdata,
} from "./typesAndfakePool";

import { mockedMemberships } from "./typesAndfakePool";
import { prisma } from "./__mock__/PrismaClient";

vi.mock("../test/__mock__/db"); // This imports your db.ts as a mock module

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CHANNEL TESTING STARTED..............\n", () => {
  describe("Post  /create:- Succesfully able to create the channel\n", () => {
    prisma.user.findUnique.mockResolvedValue(mockedUserdata);
    prisma.organization.create.mockResolvedValue(mockedOragnizationInfo);
    prisma.channel.create.mockResolvedValue(mockedDMChannelInfo);
    prisma.membership.createMany.mockResolvedValue({
      count: mockedMemberships.length,
    });

    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    it("Shud successfully create channel for DM", async () => {
      const res = await request(app)
        .post("/api/v1/channel/create")

        .send(mockedDMInfo);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Channel created successfully");
    });
    it("Shud successfully create channel for Organization", async () => {
      const res = await request(app)
        .post("/api/v1/channel/create")

        .send(mockedGroupInfo);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Channel created successfully");
    });
  });

  describe("Throw error if error exists", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("User doesnt exists", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      prisma.user.findUnique.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/v1/channel/create")
        .send({ ...mockedDMChannelInfo, userEmail: "me@gmail.com" });
      expect(res.status).toBe(500);
      expect(res.body.message).toEqual("User doesn't exist");
    });

    it("User to add doesnt exists", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockedUserdata)
        .mockResolvedValueOnce(null);
      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const res = await request(app)
        .post("/api/v1/channel/create")
        .send({ ...mockedDMInfo, emails: ["wrong@gmail.com"] });
      expect(res.status).toBe(500);
      expect(res.body.message).toEqual("User to add doesn't exist");
    });
    it("User doesnt exist from thr mail", async()=>{
         prisma.user.findUnique
        .mockResolvedValueOnce(mockedUserdata)
        .mockResolvedValueOnce(mockedUserdata);

      prisma.organization.create.mockResolvedValue(mockedOragnizationInfo);
      prisma.channel.create.mockResolvedValue(mockedOrganizationChannelInfo);
      prisma.user.findMany.mockResolvedValueOnce([])


      prisma.$transaction.mockImplementation((cb) => cb(prisma));

      const res = await request(app)
        .post("/api/v1/channel/create")
        .send(mockedGroupInfo);

      expect(res.status).toBe(500);

      expect(res.body.message).toBe("One of the member email wrong");
    });
    })
    it("should throw error if membership creation fails", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockedUserdata)
        .mockResolvedValueOnce(mockedUserdata);

      prisma.organization.create.mockResolvedValue(mockedOragnizationInfo);
      prisma.channel.create.mockResolvedValue(mockedOrganizationChannelInfo);
       prisma.user.findMany.mockResolvedValueOnce([mockedUserdata])
      prisma.membership.createMany.mockResolvedValue({ count: 0 }); 

      prisma.$transaction.mockImplementation((cb) => cb(prisma));

      const res = await request(app)
        .post("/api/v1/channel/create")
        .send(mockedGroupInfo);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Membership creation failed");
    });
  });

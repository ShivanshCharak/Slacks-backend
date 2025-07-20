import express from "express";
import { prisma } from "../test/__mock__/PrismaClient";

export const channelRouter = express.Router();

type TChannelInfo = {
  emails: string[];
  type: channelType;
  userEmail: string;
  id: string;
  organizationName?: string;
  //  username:string,
};

enum channelType {
  Organization="Organization",
  DM="DM"
}
channelRouter.post("/create", async (req, res) => {
  const channelInfo: TChannelInfo = req.body;
  if (channelInfo.type !== channelType.Organization && channelInfo.type !== channelType.DM) {
    return res.status(400).json({ message: "Invalid channel type" });
  }

  let error = null;

  try {
    await prisma.$transaction(async (tx) => {
      const isExistingUser = await tx.user.findUnique({
        where: { email: channelInfo.userEmail },
      });


      if (!isExistingUser) {
        error = "User doesn't exist";
        throw new Error(error);
      }

      let organizationName: string = "";

      if (channelInfo.type === channelType.DM) {
        const user = await tx.user.findUnique({
          where: { email: channelInfo.emails[0] },
        });
        if (!user) {
            error = "User to add doesn't exist";
            throw new Error(error);
        }
        organizationName = user.firstname + user.lastname;
    } else {
          organizationName = channelInfo.organizationName as string;
        }
        
        const organizationCreated = await tx.organization.create({
            data: {
                name: organizationName,
                Moderator: isExistingUser.id,
            },
        });
        const channel = await tx.channel.create({
            data: {
          organizationId: organizationCreated.id,
          type: channelInfo.type===channelType.DM?"DM":"Organization", 
        },
    });
    
    const membersInfo = await tx.user.findMany({
        where: {
            email: { in: channelInfo.emails },
        },
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
        },
    });
    console.log(membersInfo)
    if(membersInfo.length===0){
        error="One of the member email wrong"
        throw new Error(error)
    }
    const membershipData = membersInfo.map((val) => ({
        email: val.email,
        firstname: val.firstname,
        lastname: val.lastname,
        userId: val.id,
        channelId: channel.id,
      }));
      console.log(membershipData)
      const membership = await tx.membership.createMany({
        data: membershipData,
      });
      if (membership.count===0) {
        error = "Membership creation failed";
        throw new Error(error);
      }
    });

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ message: "Channel created successfully" });

  } catch (err) {
    return res.status(500).json({ message: error || "Server error" });
  }
});

// channelRouter.delete("/delete")
// channelRouter.put("/updateMembers")

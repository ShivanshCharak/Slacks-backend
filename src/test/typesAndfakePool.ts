import { channelType } from "../generated/prisma";
export const mockedUserdata = {
  firstname: "john",
  lastname: "lennon",
  password: "hashedPassword123",
  email: "johnlennon@gmail.com",
  id: "id-1",
};
export const mockedRefreshToken = {
  id: "id1",
  userId: "userid1",
  expiresAt: new Date(Date.now() * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  isRevoked: false,
  user: mockedUserdata,
};
export const mockedUserSignUp = {
  firstname: "john",
  lastname: "lennon",
  password: "johnlennon@123",
  email: "johnlennon@gmail.com",
};
export const mockedDMInfo ={
    emails:["dummy@gmail.com"],
    type:channelType.DM,
    userEmail:"dummy@gmail.com",
    id:"user123",
}
export const mockedGroupInfo ={
    emails:["dummy@gmail.com","johnlennon@gmail.com"],
    type:channelType.Organization,
    userEmail:"dummy@gmail.com",
    id:"user123",
}
export const mockedOragnizationInfo ={
  id :"organization123",
  name:"Organization",
  Moderator:"me",
  createdAt: new Date(Date.now())
}

export const mockedDMChannelInfo={
    id :"Channel1",
  organizationId:"organization123",
  type:channelType.DM,
}

export const mockedOrganizationChannelInfo={
    id :"Channel2",
  organizationId:"organization123",
  type:channelType.Organization,
}
export const mockedMemberships = [
  {
    email: "johnlennon@gmail.com",
    firstname: "john",
    lastname: "lennon",
    userId: "id-1",
    channelId: "Channel1",
  },
  {
    email: "dummy@gmail.com",
    firstname: "dummy",
    lastname: "user",
    userId: "id-2",
    channelId: "Channel1",
  },
];


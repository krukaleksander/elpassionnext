import type { NextApiRequest, NextApiResponse } from "next";
import AuthFn from "./auth";
import { InterfaceOneUser } from "./types";
const { request } = require("@octokit/request");
export default async function searchUserByName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestWithAuth = await AuthFn();
  const searchString = req.query.login;
  const dataUsers = await requestWithAuth(`GET /users/${searchString}`).then(
    (data: { data: InterfaceOneUser }) => {
      return data.data;
    }
  );
  return res.status(200).json({
    id: dataUsers.id,
    login: dataUsers.login,
    name: dataUsers.name,
    followers: dataUsers.followers,
    following: dataUsers.following,
    location: dataUsers.location,
    avatar: dataUsers.avatar_url,
    type: "user",
  });
}

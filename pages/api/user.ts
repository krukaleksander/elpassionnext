import type { NextApiRequest, NextApiResponse } from "next";
const { createTokenAuth } = require("@octokit/auth-token");
import { ApiKey } from "./apiKey";
const { request } = require("@octokit/request");
let arrayOfReadyClients = [];

export default async function searchUserByName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchString = req.query.login;
  const auth = createTokenAuth(ApiKey);
  const authentication = await auth();

  const requestWithAuth = request.defaults({
    request: {
      hook: auth.hook,
    },
  });
  const dataUsers = await requestWithAuth(`GET /users/${searchString}`).then(
    (data: { data: any }) => {
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
    avantar: dataUsers.avatar_url,
    type: "user",
  });
  //   return res.status(200).json(dataUsers);
}

interface PersonData {
  id: number;
  login: string;
  name: string;
  followers: number;
  following: number;
  location: string;
  avatar: string;
  type: "user";
}

interface RepoData {
  id: number;
  full_name: string;
  description: string;
  stars: number;
  languages: {};
  updated_on: string;
  type: "repo";
}

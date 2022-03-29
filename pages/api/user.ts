import type { NextApiRequest, NextApiResponse } from "next";
const { createTokenAuth } = require("@octokit/auth-token");
require("dotenv").config();
const { request } = require("@octokit/request");
export default async function searchUserByName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchString = req.query.login;
  const auth = createTokenAuth(process.env.API_KEY);
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
    avatar: dataUsers.avatar_url,
    type: "user",
  });
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

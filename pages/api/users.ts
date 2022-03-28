import type { NextApiRequest, NextApiResponse } from "next";
const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await request("GET /users");
  const data = response.data;

  return res.status(200).json(
    data.map((user: any): PersonData => {
      const { login, name, followers, following, location, avatar_url } = user;
      return {
        login,
        name,
        followers,
        following,
        location,
        avatar: avatar_url,
        type: "user",
      };
    })
  );
}

//zapytać o repozytoria, zapytać o userów, posortować i zwrócić
interface PersonData {
  login: string;
  name: string;
  followers: number;
  following: number;
  location: string;
  avatar: string;
  type: "user";
}

interface repoData {}

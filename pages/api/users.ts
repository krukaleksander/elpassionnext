import type { NextApiRequest, NextApiResponse } from "next";
const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const randomResponseUsers = await request("GET /users");
  const randomResponseRepos = await request("GET /repositories");
  const randomUsersData = randomResponseUsers.data;
  const randomReposData = randomResponseRepos.data;
  console.log(randomReposData);

  return res.status(200).json(
    randomUsersData.map((user: any): PersonData => {
      const { id, login, name, followers, following, location, avatar_url } =
        user;
      return {
        id,
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
  language: string;
  updated_on: string;
}

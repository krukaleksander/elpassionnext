import type { NextApiRequest, NextApiResponse } from "next";

const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const randomResponseUsers = await request("GET /users", {});
  const randomResponseRepos = await request("GET /repositories/", {
    repository_id: 42,
  });
  const randomUsersData = randomResponseUsers.data;
  const randomReposData = randomResponseRepos.data;

  const randomReposResult = randomReposData.map(async (repo: any) => {
    const { id, full_name, description, stargazers_url, languages_url } = repo;
    return {
      id,
      full_name,
      description,
      stars: 0,
      languages: { JS: 200 },
      updated_on: "10.03.2022",
      type: "repo",
    };
  });
  console.log(randomReposResult);
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
  languages: {};
  updated_on: string;
  type: "repo";
}

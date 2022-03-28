import type { NextApiRequest, NextApiResponse } from "next";
const { createTokenAuth } = require("@octokit/auth-token");

const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = createTokenAuth("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");
  const authentication = await auth();

  const requestWithAuth = request.defaults({
    request: {
      hook: auth.hook,
    },
  });

  let { data: randomResponseUsers } = await requestWithAuth("GET /users");
  let { data: randomResponseRepos } = await requestWithAuth(
    "GET /repositories"
  );
  const randomUsers = randomResponseUsers.map((user: any): PersonData => {
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
  });

  const getUserDetails = async (user: any) => {
    const { id } = user;
    let { data: randomUserData } = await requestWithAuth(`GET /users/${id}`);
    console.log(randomUserData);
  };

  const randomRepos = randomResponseRepos.map(async (repo: any) => {
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

  return res.status(200).json(randomUsers);
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

import type { NextApiRequest, NextApiResponse } from "next";
const { createTokenAuth } = require("@octokit/auth-token");

const { request } = require("@octokit/request");
let arrayOfReadyClients = [];

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
  const dataUsers = await requestWithAuth("GET /users").then(
    (data: { data: any }) => {
      return data.data;
    }
  );
  const userData = await Promise.all(
    dataUsers.map(async (client: any) => {
      const { login } = client;
      let { data: responseUser } = await requestWithAuth(`GET /users/${login}`);
      return responseUser;
    })
  );

  const dataRepos = await requestWithAuth("GET /repositories").then(
    (data: { data: any }) => {
      return data.data;
    }
  );
  const repoData = await Promise.all(
    dataRepos.map(async (repo: any) => {
      const { id } = repo;
      let { data: responseRepo } = await requestWithAuth(
        `GET /repositories/${id}`
      );
      return responseRepo;
    })
  );
  // na tym etapie mamy userData i repoData
  const userDataMapped = userData.map((user: any) => {
    return {
      id: user.id,
      login: user.login,
      name: user.name,
      followers: user.followers,
      following: user.following,
      location: user.location,
      avantar: user.avatar_url,
      type: "user",
    };
  });
  return res.status(200).json(userDataMapped);
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

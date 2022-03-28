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
  const data = await requestWithAuth("GET /users").then(
    (data: { data: any }) => {
      return data.data;
    }
  );
  const userData = await Promise.all(
    data.map(async (client) => {
      const { login } = client;
      let { data: responseUser } = await requestWithAuth(`GET /users/${login}`);
      return responseUser;
    })
  );
  return res.status(200).json(userData);
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

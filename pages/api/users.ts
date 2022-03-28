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
 

  return res.status(200).json(
    randomResponseUsers.map((user: any): PersonData => {
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

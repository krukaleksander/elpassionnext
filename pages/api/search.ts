import type { NextApiRequest, NextApiResponse } from "next";
const { createTokenAuth } = require("@octokit/auth-token");
require("dotenv").config();
const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchString = req.query.search;
  const auth = createTokenAuth(process.env.API_KEY);
  const authentication = await auth();

  const requestWithAuth = request.defaults({
    request: {
      hook: auth.hook,
    },
  });
  if (searchString.length < 1) {
    const dataUsers = await requestWithAuth("GET /users").then(
      (data: { data: any }) => {
        return data.data;
      }
    );
    const userData = await Promise.all(
      dataUsers.map(async (client: InterfaceUserResponse) => {
        const { login } = client;
        let { data: responseUser } = await requestWithAuth(
          `GET /users/${login}`
        );
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
    const repoDataMapped = repoData.map((user: any) => {
      return {
        id: user.id,
        full_name: user.full_name,
        description: user.description,
        stars: user.stargazers_count,
        languages: user.language,
        updated_on: user.updated_at,
        type: "repo",
      };
    });
    return res.status(200).json(
      [...userDataMapped, ...repoDataMapped].sort(function (a, b) {
        return a.id - b.id;
      })
    );
  } else {
    //here
    const dataUsers = await requestWithAuth("GET /search/users", {
      q: searchString,
    }).then((data: { data: any }) => {
      return data.data["items"];
    });
    let usersToFetch = [];
    if (dataUsers.length > 20) {
      usersToFetch = dataUsers.slice(0, 20);
    } else {
      usersToFetch = dataUsers;
    }
    const userData = await Promise.all(
      usersToFetch.map(async (client: any) => {
        const { login } = client;
        let { data: responseUser } = await requestWithAuth(
          `GET /users/${login}`
        );
        return responseUser;
      })
    );

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

    const dataRepos = await requestWithAuth("GET /search/repositories", {
      q: searchString,
    }).then((data: { data: any }) => {
      return data.data["items"];
    });
    let reposToFetch = [];
    if (dataRepos.length > 20) {
      reposToFetch = dataRepos.slice(0, 20);
    } else {
      reposToFetch = dataRepos;
    }
    const repoData = await Promise.all(
      reposToFetch.map(async (repo: any) => {
        const { id } = repo;
        let { data: responseRepo } = await requestWithAuth(
          `GET /repositories/${id}`
        );
        return responseRepo;
      })
    );
    const repoDataMapped = repoData.map((user: any) => {
      return {
        id: user.id,
        full_name: user.full_name,
        description: user.description,
        stars: user.stargazers_count,
        languages: user.language,
        updated_on: user.updated_at,
        type: "repo",
      };
    });

    return res.status(200).json(
      [...userDataMapped, ...repoDataMapped].sort(function (a, b) {
        return a.id - b.id;
      })
    );
  }
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

interface InterfaceUserResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: UserType;
  site_admin: boolean;
}

enum UserType {
  Organization = "Organization",
  User = "User",
}

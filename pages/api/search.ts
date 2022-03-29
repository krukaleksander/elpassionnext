import type { NextApiRequest, NextApiResponse } from "next";
import {
  InterfaceOneRepository,
  InterfaceOneUser,
  InterfaceRepoResponse,
  InterfaceSearchRepos,
  InterfaceSearchUsers,
  InterfaceUserResponse,
  PersonData,
  RepoData,
} from "./types";
const { createTokenAuth } = require("@octokit/auth-token");
require("dotenv").config();
const { request } = require("@octokit/request");

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchString = req.query.search;
  const auth = createTokenAuth(process.env.API_KEY);
  await auth();
  let totalCount = 0;
  const requestWithAuth = request.defaults({
    request: {
      hook: auth.hook,
    },
  });
  if (searchString.length < 1) {
    const dataUsers = await requestWithAuth("GET /users").then(
      (data: { data: InterfaceUserResponse }) => {
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
      (data: { data: InterfaceRepoResponse }) => {
        return data.data;
      }
    );
    const repoData = await Promise.all(
      dataRepos.map(async (repo: InterfaceRepoResponse) => {
        const { id } = repo;
        let { data: responseRepo } = await requestWithAuth(
          `GET /repositories/${id}`
        );
        return responseRepo;
      })
    );

    const userDataMapped = userData.map(
      (user: InterfaceOneUser): PersonData => {
        return {
          id: user.id,
          login: user.login,
          name: user.name,
          followers: user.followers,
          following: user.following,
          location: user.location,
          avatar: user.avatar_url,
          type: "user",
        };
      }
    );
    const repoDataMapped = repoData.map(
      (user: InterfaceOneRepository): RepoData => {
        return {
          id: user.id,
          full_name: user.full_name,
          description: user.description,
          stars: user.stargazers_count,
          languages: user.language,
          updated_on: user.updated_at.toString(),
          type: "repo",
        };
      }
    );
    return res.status(200).json(
      [...userDataMapped, ...repoDataMapped].sort(function (a, b) {
        return a.id - b.id;
      })
    );
  } else {
    const dataUsers = await requestWithAuth("GET /search/users", {
      q: searchString,
    }).then((data: { data: InterfaceSearchUsers }) => {
      totalCount += data.data["total_count"];
      return data.data["items"];
    });
    let usersToFetch = [];
    if (dataUsers.length > 20) {
      usersToFetch = dataUsers.slice(0, 20);
    } else {
      usersToFetch = dataUsers;
    }
    const userData = await Promise.all(
      usersToFetch.map(async (client: InterfaceUserResponse) => {
        const { login } = client;
        let { data: responseUser } = await requestWithAuth(
          `GET /users/${login}`
        );
        return responseUser;
      })
    );

    const userDataMapped = userData.map(
      (user: InterfaceOneUser): PersonData => {
        return {
          id: user.id,
          login: user.login,
          name: user.name,
          followers: user.followers,
          following: user.following,
          location: user.location,
          avatar: user.avatar_url,
          type: "user",
        };
      }
    );

    const dataRepos = await requestWithAuth("GET /search/repositories", {
      q: searchString,
    }).then((data: { data: InterfaceSearchRepos }) => {
      totalCount += data.data["total_count"];
      return data.data["items"];
    });
    let reposToFetch = [];
    if (dataRepos.length > 20) {
      reposToFetch = dataRepos.slice(0, 20);
    } else {
      reposToFetch = dataRepos;
    }
    const repoData = await Promise.all(
      reposToFetch.map(async (repo: InterfaceOneRepository) => {
        const { id } = repo;
        let { data: responseRepo } = await requestWithAuth(
          `GET /repositories/${id}`
        );
        return responseRepo;
      })
    );
    const repoDataMapped = repoData.map((repo: InterfaceOneRepository) => {
      return {
        id: repo.id,
        full_name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        languages: repo.language,
        updated_on: repo.updated_at,
        type: "repo",
      };
    });

    return res.status(200).json({
      total_count: totalCount,
      items: [...userDataMapped, ...repoDataMapped].sort(function (a, b) {
        return a.id - b.id;
      }),
    });
  }
}

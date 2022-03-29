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
        avatar: user.avatar_url,
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

export interface PersonData {
  id: number;
  login: string;
  name: string;
  followers: number;
  following: number;
  location: string;
  avatar: string;
  type: "user";
}

export interface RepoData {
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

export interface InterfaceRepoResponse {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: ownerRepoResponse;
  html_url: string;
  description: null | string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
}

export interface ownerRepoResponse {
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
  type: Type;
  site_admin: boolean;
}

export enum Type {
  Organization = "Organization",
  User = "User",
}

interface InterfaceOneUser {
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
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: null;
  hireable: boolean;
  bio: string;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

export interface InterfaceOneRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: Date;
  updated_at: Date;
  pushed_at: Date;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: License;
  allow_forking: boolean;
  is_template: boolean;
  topics: any[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  temp_clone_token: null;
  network_count: number;
  subscribers_count: number;
}

export interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface Owner {
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
  type: string;
  site_admin: boolean;
}

export interface InterfaceSearchUsers {
  total_count: number;
  incomplete_results: boolean;
  items: ItemSearchUser[];
}

export interface ItemSearchUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  site_admin: boolean;
}

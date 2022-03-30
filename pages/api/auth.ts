export default async function AuthFn() {
  const { createTokenAuth } = require("@octokit/auth-token");
  require("dotenv").config();
  const { request } = require("@octokit/request");
  const auth = createTokenAuth(process.env.API_KEY);
  await auth();
  return request.defaults({
    request: {
      hook: auth.hook,
    },
  });
}

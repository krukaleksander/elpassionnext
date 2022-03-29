import {
  Avatar,
  getListSubheaderUtilityClass,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchAppBar from "../../components/search-app-bar";
import { PersonData } from "../api/search";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const getUser = async (login: string): Promise<PersonData> => {
  return await (await fetch(`/api/user?login=${login}`)).json();
};
const fakeGetUser = async (login: string): Promise<PersonData> =>
  Promise.resolve({
    id: 1,
    login: "BugajewskaM",
    name: "Monika Bugajewska",
    followers: 11,
    following: 111,
    location: "Warsaw",
    avatar:
      "https://scontent-waw1-1.xx.fbcdn.net/v/t1.6435-1/131129765_3807487972641425_1761231963487389868_n.jpg?stp=dst-jpg_p100x100&_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_ohc=DJv8bka-QIMAX_qSWv1&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent-waw1-1.xx&oh=00_AT-uAb9AOUbkbU3I3esi6C3rUzSlnU7vRkNV3Mv0n_wVUQ&oe=6265EF72",
    type: "user",
  });
function Login() {
  const router = useRouter();
  const { login } = router.query;
  const [user, setUser] = useState<PersonData | null>(null);
  useEffect(() => {
    const loginString = login as string;
    if (!loginString) {
      return;
    }
    getUser(loginString).then((result) => setUser(result));
  }, [login]);
  return (
    <>
      <SearchAppBar onSubmit={(text) => router.push(`/?query=${text}`)} />

      {!!user && (
          <Grid
            container
            direction="column"
            alignItems="center"
            gap={2}
            justifyItems="center"
            sx={{margin: 2}}
          >
            <Grid item>
              <Avatar
                alt={user.login}
                src={user.avatar}
                sx={{ height: 128, width: 128 }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h3">{user.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">@{user.login}</Typography>
            </Grid>
            <Grid item sx={{display: 'flex', gap: '16px'}}>
              <Typography variant="subtitle1" sx={{display: 'flex'}}><PeopleAltOutlinedIcon/>{user.followers} Followers </Typography>
              <Typography variant="subtitle1">{user.following} Following</Typography>
            </Grid>
          </Grid>
      )}
    </>
  );
}
export default Login;

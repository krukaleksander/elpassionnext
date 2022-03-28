import React, { useEffect } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SourceIcon from "@mui/icons-material/Source";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import { flexbox } from "@mui/system";
import SearchAppBar from "../components/search-app-bar";
import { useRouter } from "next/router";
import { RepoData, PersonData } from "./api/search";
import { ListItemButton, ListItemIcon } from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);
type PersonOrRepoData = PersonData | RepoData;
const getData = async (query: string): Promise<PersonOrRepoData[]> =>
  await (
    await fetch(`http://localhost:3000/api/search?search=${query}`)
  ).json();
const getFakeData = async (query: string): Promise<PersonOrRepoData[]> => {
  return Promise.resolve([
    {
      id: 1,
      login: "BugajewskaM",
      name: "Monika Bugajewska",
      followers: 11,
      following: 111,
      location: "Warsaw",
      avatar:
        "https://scontent-waw1-1.xx.fbcdn.net/v/t1.6435-1/131129765_3807487972641425_1761231963487389868_n.jpg?stp=dst-jpg_p100x100&_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_ohc=DJv8bka-QIMAX_qSWv1&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent-waw1-1.xx&oh=00_AT-uAb9AOUbkbU3I3esi6C3rUzSlnU7vRkNV3Mv0n_wVUQ&oe=6265EF72",
      type: "user",
    },
    {
      id: 1,
      full_name: "To nie repo",
      description: "Serio xD",
      stars: 123,
      languages: {},
      updated_on: "2022-01-01",
      type: "repo",
    },
  ]);
};
function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [error, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const classes = useStyles();
  const [search, setSearch] = React.useState("");
  // w tablicy mam albo PersonData albp RepoData - union
  const [result, setResult] = React.useState<PersonOrRepoData[]>([]);

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };
  useEffect(() => setSearch(query as string), [query]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    setResult([]);
    getData(search)
      .then((result) => setResult(result))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <SearchAppBar value={search} onChange={handleSearch} />
      <Container maxWidth="sm" style={{ marginTop: "16px" }}>
        <List
          sx={{ width: "100%", margin: "auto", bgcolor: "background.paper" }}
        >
          {!!result &&
            result.map((item) => (
              <>
                {item.type === "user" && (
                  <ListItem alignItems="flex-start">
                    <ListItemButton
                      onClick={() => router.push(`/users/${item.login}`)}
                    >
                      <ListItemAvatar>
                        <Avatar alt={item.login} src={item.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={item.login}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
                {item.type === "repo" && (
                  <ListItem alignItems="flex-start" sx={{ margin: "0 16px" }}>
                    <ListItemAvatar>
                      <Avatar>
                        <SourceIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.full_name}
                      secondary={
                        <>
                          <div>{item.description}</div>
                          <div style={{display: "flex", alignItems: "center"}}>
                            <StarOutlineIcon/> {item.stars} Updated on{" "}
                            {item.updated_on}
                          </div>
                        </>
                      }
                    />
                  </ListItem>
                )}
                <Divider />
              </>
            ))}
        </List>
      </Container>
    </>
  );
}
export default Search;

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
  await (await fetch(`http://localhost:3000/api/search?search=${query}`)).json();
function Search() {
  const router = useRouter();
  const [error, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const classes = useStyles();
  const [search, setSearch] = React.useState("");
  // w tablicy mam albo PersonData albp RepoData - union
  const [result, setResult] = React.useState<PersonOrRepoData[]>([]);

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

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
      <SearchAppBar value={search} onChange={handleSearch}/>
      <Container maxWidth="sm" style={{ marginTop: "16px" }}>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {!!result && result.map((item) => (
            <>
              { item.type === 'user' && <ListItem alignItems="flex-start">
                <ListItemButton onClick={()=>router.push(`/users/${item.login}`)}>
                <ListItemAvatar>
                  <Avatar alt={item.login} src={item.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.login}
                />
                </ListItemButton>
              </ListItem>
              }
              { item.type === 'repo' && <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar><SourceIcon/></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.full_name}
                  secondary={item.description}
                />
              </ListItem>
              }
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      </Container>
    </>
  );
}
export default Search;

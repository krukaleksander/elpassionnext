import React, { useEffect } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import searchUser from "./api/users";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
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
const getData = async (query: string) =>
  await (await fetch(`http://localhost:3000/api/users?query=${query}`)).json();
function Search() {
  const router = useRouter();
  const [error, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const classes = useStyles();
  const [search, setSearch] = React.useState("");
  const [result, setResult] = React.useState(null);

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    setResult(null);
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
          {!!result && result.map((user) => (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="{user.login}" src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary="Brunch this weekend?"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {user.login}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      </Container>
    </>
  );
}
export default Search;

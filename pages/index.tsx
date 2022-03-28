
import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import searchUser from './api/users';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': { 
        margin: theme.spacing(1),
        width: '25ch',
    },
  },
  }),
);

function Search(){
  const [error, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const classes = useStyles();
  const [search, setSearch] =React.useState([
    {
    "id":1,
    "login":"mojombo",
    "avatar":"https://avatars.githubusercontent.com/u/1?v=4",
    "type":"user"
  },
    {
      "id":2,
      "login":"defunkt"
      ,"avatar":"https://avatars.githubusercontent.com/u/2?v=4",
      "type":"user"
    },
      {
        "id":3,
      "login":"pjhyett"
      ,"avatar":"https://avatars.githubusercontent.com/u/3?v=4",
      "type":"user"
    }]);
  
  // const handleSearch = (event: any) => {
  //   setSearch(event.target.value);
// };

// useEffect(() => {
//   setLoading(true);
//   setError(false);
//   setSearch(null);
  
//     .then((result) => 
//     .catch(() => setError(true))
//     .finally(() => setLoading(false));
// }, [search]);


return(
  
  <><form className={classes.root} noValidate autoComplete="off">

    <TextField
      id="standard-secondarysearch"
      label="search"
      color="secondary"
      // onChange={handleSearch} 
      />
  </form><List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      { search.map((ktos)=>(
      <><ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="{ktos.login}" src={ktos.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={<React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {ktos.login}
              </Typography>

            </React.Fragment>} />
        </ListItem><Divider variant="inset" component="li" /></>

      ))}
      ;
    </List></>

);

}
export default Search;
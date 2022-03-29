import { List, Divider } from "@mui/material";
import { PersonData, RepoData } from "../pages/api/search";
import GithubRepoItem from "./github-repo-item";
import GithubUserItem from "./github-user-item";

type PersonOrRepoData = PersonData | RepoData;

interface GithubListProps {
    personOrRepoList:PersonOrRepoData[]
}


export default function GithubList( {personOrRepoList}: GithubListProps){
    return <List
          sx={{ width: "100%", margin: "auto", bgcolor: "background.paper" }}
        >
          
          {!!personOrRepoList &&
            personOrRepoList.map((item) => (
              <>
                {item.type === "user" && <GithubUserItem item={item}/>}
                {item.type === "repo" && <GithubRepoItem item={item}/>}
                 
                <Divider />
              </>
            ))}
        </List>
     }
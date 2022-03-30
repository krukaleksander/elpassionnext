import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import SourceIcon from "@mui/icons-material/Source";
import { RepoData } from "../pages/api/types";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

interface ItemProps {
  item: RepoData;
}

export default function GithubRepoItem({ item }: ItemProps) {
  return (
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <StarOutlineIcon /> {item.stars} Updated on{" "}
              {item.updated_on.slice(0, 10)}
            </div>
          </>
        }
      />
    </ListItem>
  );
}

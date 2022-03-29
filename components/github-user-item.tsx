import { ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { PersonData } from "../pages/api/types";

interface ItemProps {
  item: PersonData;
}

export default function GithubUserItem({ item }: ItemProps) {
  const router = useRouter();
  return <ListItem alignItems="flex-start">
    <ListItemButton onClick={() => router.push(`/users/${item.login}`)}>
      <ListItemAvatar>
        <Avatar alt={item.login} src={item.avatar} />
      </ListItemAvatar>
      <ListItemText primary={item.name} secondary={item.login} />
    </ListItemButton>
  </ListItem>;
}

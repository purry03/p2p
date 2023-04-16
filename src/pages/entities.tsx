import { createStyles, rem, ScrollArea, Table } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface EntitiesProps {
  id: string;
  ip: number;
  port: number;
  last_flood: string;
}

function getTimeAgo(epochTime) {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const elapsedSeconds = now - epochTime; // Elapsed time in seconds

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds.toFixed(0)} seconds ago`; // Display seconds ago
  } else {
    const elapsedMinutes = Math.floor(elapsedSeconds / 60); // Elapsed time in minutes
    return `${elapsedMinutes.toFixed(0)} minutes ago`; // Display minutes ago
  }
}

export function Entities() {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [listData, setListData] = useState<EntitiesProps[]>([]);

  useEffect(() => {
    setInterval(() => {
      let newListData = [];
      axios
        .get("http://localhost:9001/api2")
        .then(function (response) {
          newListData = [];
          let apiData = response.data;
          for (const peer of apiData.peers) {
            let temp = {
              id: peer.id !== null ? peer.id : uuidv4(),
              ip: peer.host,
              port: peer.port,
              last_updated: getTimeAgo(peer.time),
            };
            newListData.push(temp);
          }

          setListData(newListData);
        })
        .catch((err) => console.log(err.message));
    }, 1000);
  }, []);

  const rows = listData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.ip}</td>
      <td>{row.port}</td>
      <td>{row.last_flood}</td>
    </tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Port</th>
            <th>Last Flood</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
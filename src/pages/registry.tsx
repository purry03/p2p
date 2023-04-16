import {
    Group,
    Table,
    Progress,
    Anchor,
    Text,
    ScrollArea,
    createStyles,
    rem,
  } from "@mantine/core";
import axios from "axios";
  import { useEffect, useState } from "react";
  
  const useStyles = createStyles((theme) => ({
    progressBar: {
      "&:not(:first-of-type)": {
        borderLeft: `${rem(3)} solid ${
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
        }`,
      },
    },
  }));
  
  interface RegistryProps {
      hash: string;
      alias: string;
      size: string;
      real_size: number;
      mode: string;
      speed: string;
      progress: number;
  }

  function getReadableFileSizeString(fileSizeInBytes: number) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes /= 1024;
      i++;
    } while (fileSizeInBytes > 1024);
  
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }
  
  function formatSpeed(speedInBytesPerSecond: number) {
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    let speed = speedInBytesPerSecond;
    let unitIndex = 0;
    
    while (speed >= 1024 && unitIndex < units.length - 1) {
      speed /= 1024;
      unitIndex++;
    }
    
    return speed.toFixed(2) + ' ' + units[unitIndex];
  }
  
  export function Registry() {
    const { classes, theme } = useStyles();
    const [listData, setListData] = useState<RegistryProps[]>([]);

    useEffect(()=>{
      setInterval(()=>{
        let newListData = [];
        axios.get('http://localhost:9001/api')
        .then(function (response) {
          newListData = []
          let apiData = response.data;
          for(const peer of apiData.peers){
            let temp = {
              hash: torrent.hash.substring(0,8),
              alias: torrent.name,
              real_size: torrent.size,
              size: getReadableFileSizeString(torrent.size),
              author: torrent.state === 'pausedUP'? 'completed' : torrent.state,
              speed: formatSpeed(torrent.dlspeed),
              progress : torrent.size - torrent.amount_left,
            }
            newListData.push(temp);
          }
      
          setListData(newListData);
      }).catch(err => console.log(err.message));
     
      },1000)
     
    },[])
  
    const rows = listData!.map((row) => {
      const progressPercentage = (row.progress / row.real_size) * 100;
  
      return (
        <tr key={row.alias}>
          <td>{row.hash}</td>
          <td>
            <Anchor component="button" fz="sm">
              {row.alias}
            </Anchor>
          </td>
          <td>{row.mode}</td>
          <td>
            {" "}
            <Anchor component="button" fz="sm">
              {" "}
              {row.size}{" "}
            </Anchor>
          </td>
          <td>{row.speed}</td>
          <td>
            <Group position="apart">
              <Text fz="xs" c="teal" weight={700}>
                {progressPercentage.toFixed(0)}%
              </Text>
            </Group>
            <Progress
              classNames={{ bar: classes.progressBar }}
              sections={[
                {
                  value: progressPercentage,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.teal[9]
                      : theme.colors.teal[6],
                },
              ]}
            />
          </td>
        </tr>
      );
    });
  
    return (
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
          <thead>
            <tr>
              <th>Hash</th>
              <th>Alias</th>
              <th>Digital Footprint</th>
              <th>Operational Mode</th>
              <th>Download Speed</th>
              <th>Data Acquisition Progress</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }
  
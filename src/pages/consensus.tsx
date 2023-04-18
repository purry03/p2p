import { createStyles, rem, ScrollArea, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({
    timeout: 1500, // Set the default timeout to 5000ms (5 seconds)
  });

const useStyles = createStyles((theme) => ({
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',
    
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
          }`,
        },
      },
    
      scrolled: {
        boxShadow: theme.shadows.sm,
      },
}));

export function TableScrollArea({ data }: any) {
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
  
    const rows = data.map((row: any) => (
      <tr key={row.file}>
        <td>{row.collection}</td>
        <td>{row.file}</td>
        <td>{row.peer_count}</td>
      </tr>
    ));
  
    return (
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Collection Name</th>
              <th>File Name</th>
              <th>Replication Factor</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }

  export function TableScrollArea2({ data }: any) {
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
  
    const rows = data.map((row: any) => (
      <tr key={row.peer + row.fileName}>
        <td>{row.peer}</td>
        <td>{row.collection}</td>
        <td>{row.fileName}</td>
        <td>{row.hasFile?'Yes':'No'}</td>
      </tr>
    ));
  
    return (
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Peer</th>  
              <th>Collection Name</th>
              <th>File Name</th>
              <th>Replicated</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }


export function Consensus() {
  const [listData, setListData] = useState<any[]>([]);
  const [listData2, setListData2] = useState<any[]>([]);


  useEffect(() => {
    updateData();
      let cron = setInterval(()=>{
       updateData();
      },1000)
      return () => {
        clearInterval(cron);
      }
  }, []);

  function updateData(){
    let newListData = [];
      api
        .get("http://localhost:9001/api2")
        .then(function (response) {
          newListData = [];
          let apiData = response.data;
          for (const coll in apiData.c_stats) {
            let filesObj = apiData.c_stats[coll];
            for(const file in filesObj){
                let temp = {
                    collection: coll,
                    file: file,
                    peer_count: filesObj[file]
                  };
                  newListData.push(temp);
            }
          }

          setListData(newListData);

          const newListData2= [];

          for(const peer of apiData.stats){
            const hostname = peer.host + ":" + peer.port;
            for(const coll in peer.stat){
                const collData = peer.stat[coll];
                for(const file of collData){
                    let temp = {
                        peer: hostname,
                        collection: coll,
                        fileName: file[0],
                        hasFile: file[1]
                    }
                    newListData2.push(temp);
                }
            }
          }

          setListData2(newListData2);

        })
        .catch((err) => {

        });
  }

  return (
    <>
    <Title size={25}>Collection Data Statistics</Title>
    <br />
    <TableScrollArea data={listData}></TableScrollArea>
    <br />
    <Title size={25}>Cross-Peer File Repository</Title>
    <br />
    <TableScrollArea2 data={listData2}></TableScrollArea2>
    </>
  );
}

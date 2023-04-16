import { createStyles, rem, ScrollArea, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

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
              <th>Peer Count</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }

export function Consensus() {
  const [listData, setListData] = useState<any[]>([]);

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
      axios
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
        })
        .catch((err) => {

        });
  }

  return (
    <>
    <Title size={25}>Collection Data Statistics</Title>
    <br />
    <TableScrollArea data={listData}></TableScrollArea>
    </>
  );
}

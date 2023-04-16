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
  
    const rows = data.map((row) => (
      <tr key={row.file}>
        <td>{row.collection}</td>
        <td>{row.file}</td>
      </tr>
    ));
  
    return (
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Collection Name</th>
              <th>File Name</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    );
  }

export function Platform() {
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
          for (const coll in apiData.targets) {
            let temp = {
              collection: coll,
              file: apiData.targets[coll][0],
            };
            newListData.push(temp);
          }

          setListData(newListData);
        })
        .catch((err) => console.log(err.message));
  }

  return (
    <>
    <Title>Node Status</Title>
    <br />
    <Text>Current Hostname: <strong>192.168.0.1:9000</strong></Text>
    <br />
    <br />
    <br />
    <br />
    <Title size={25}>Target Resources</Title>
    <br />
    <TableScrollArea data={listData}></TableScrollArea>
    </>
  );
}

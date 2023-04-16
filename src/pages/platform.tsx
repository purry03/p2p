import { createStyles, rem, ScrollArea, Table, Text, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({
  timeout: 500, // Set the default timeout to 5000ms (5 seconds)
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
  const [hostname, setHostname] = useState('');
  const [onlineStatus, setOnlineStatus] = useState(false);


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
          for (const coll in apiData.targets) {
            let temp = {
              collection: coll,
              file: apiData.targets[coll][0],
            };
            newListData.push(temp);
          }

          setListData(newListData);
          setHostname(`${apiData.host}:${apiData.port}`);
          setOnlineStatus(true);
        })
        .catch((err) => {
            setOnlineStatus(false);
        });
  }

  return (
    <>
    <Title>Node Status <span className="text-blue">[{onlineStatus===true?'ONLINE':'OFFLINE'}]</span></Title>
    <br />
    <Text>Current Hostname: <strong>{onlineStatus === true ? hostname : 'N/A'}</strong></Text>
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

import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

import axios from 'axios';
import { useEffect, useState } from 'react';
const api = axios.create({
    timeout: 1500, // Set the default timeout to 5000ms (5 seconds)
  });
  
const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface StatsGridIconsProps {
  data: { title: string; value: string; diff: number }[];
}

// const cardData = [
//     {
//         title: "CPU Usage",
//         value: "90",
//     },
//     {
//         title: "RAM Usage",
//         value: "90",
//     }, 
//     {
//         title: "Known Peers",
//         value: "90",
//     }, {
//         title: "Targets",
//         value: "90",
//     }, {
//         title: "Downloaded Files",
//         value: "90",
//     },
// {
//         title: "Network Usage",
//         value: "90",
//     }, {
//         title: "Upload Speed",
//         value: "90",
//     }, {
//         title: "Download Queue Length",
//         value: "90",
//     }, {
//         title: "Online Status",
//         value: "90",
//     }
// ]

const apiMapping = [
    {
        key: "CPU_percent",
        title: "CPU Usage",
        postfix: "%",
    },
    {
        key: "RAM_used",
        title: "RAM Usage",
        postfix: "GB"
    }
]

export function Analytics() {
  const { classes } = useStyles();
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
      api
        .get("http://localhost:9001/api2")
        .then(function (response) {
          let apiData = response.data;
          
          const newListData: any[] = [];

          for(const mapping of apiMapping){
            newListData.push({
                title: mapping.title,
                value: `${apiData[mapping.key]} ${mapping.postfix}`
            });
          }
                                                                                                                                                
          setListData(newListData);
        })
        .catch((err) => {
            console.log(err.message);
        });
  }


  const stats = listData.map((stat) => {

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {stats}
      </SimpleGrid>
      <hr style={{
            height: '1px',
            margin: '20px 0'
        }}/>
    </div>
  );
}
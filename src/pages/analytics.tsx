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

export function Analytics() {
  const { classes } = useStyles();
  const [listData, setListData] = useState<any[]>([]);

  useEffect(() => {
    updateData();
    let cron = setInterval(() => {
      updateData();
    }, 1000)
    return () => {
      clearInterval(cron);
    }
  }, []);

  async function updateData() {

    const newListData: any[] = [];

    try {

      const api1 = (await api.get('http://localhost:9001/api')).data;
      const api2 = (await api.get('http://localhost:9001/api2')).data;



      for (const mapping of apiMapping) {
        newListData.push({
          title: mapping.title,
          value: `${api2[mapping.key]} ${mapping.postfix}`
        });
      }

      newListData.push({
        title: "Known Peers",
        value: api2['peers'].length
      })

      newListData.push({
        title: "Target Files",
        value: Object.entries(api2['targets']).length
      });

      let downloadedFileCount = 0;

      for (const file of api1.torrents) {
        if (file.amount_left === 0) {
          downloadedFileCount += 1
        }
      }

      newListData.push({
        title: "Downloaded Files",
        value: downloadedFileCount
      });


      let totalDownloadSpeed = 0;
      let totalUploadSpeed = 0;

      for (const file of api1.torrents) {
        totalUploadSpeed += file.upspeed;
        totalDownloadSpeed += file.dlspeed;
      }

      newListData.push({
        title: "Download Speed",
        value: formatSpeed(totalDownloadSpeed)
      });

      newListData.push({
        title: "Upload Speed",
        value: formatSpeed(totalUploadSpeed)
      });

      newListData.push({
        title: "Online Status",
        value: 'Online'
      })

    }
    catch (err) {
      for (const mapping of apiMapping) {
        newListData.push({
          title: mapping.title,
          value: '-'
        });
      }

      newListData.push({
        title: "Known Peers",
        value: '-'
      })

      newListData.push({
        title: "Target Files",
        value: '-'
      });

      newListData.push({
        title: "Downloaded Files",
        value: '-'
      });

      newListData.push({
        title: "Download Speed",
        value: '-'
      });

      newListData.push({
        title: "Upload Speed",
        value: '-'
      });

      newListData.push({
        title: "Online Status",
        value: 'Offline'
      })
    }

    setListData(newListData)

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
      }} />
    </div>
  );
}
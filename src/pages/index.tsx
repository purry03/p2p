import { useEffect, useState } from 'react';
import { createStyles, Navbar, Group, Code, getStylesRef, Table, Progress, Anchor, Text, ScrollArea, rem, Title} from '@mantine/core';
import {
  IconDashboard,
  IconList,
  IconNetwork,
  IconAdjustmentsAlt,
  IconAperture,
  IconSwitchHorizontal
} from '@tabler/icons-react';
import axios from 'axios'

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
      }`,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

interface TableReviewsProps {
  data: {
    hash: string,
    title: string;
    author: string;
    year: number;
    speed: string,
    reviews: { positive: number; negative: number };
  }[];
}

export function TableReviews({ data }: TableReviewsProps) {
  const { classes, theme } = useStyles();

  const rows = data.map((row) => {
    const totalReviews = row.reviews.negative + row.reviews.positive;
    const positiveReviews = (row.reviews.positive / totalReviews) * 100;
    const negativeReviews = (row.reviews.negative / totalReviews) * 100;

    return (
      <tr key={row.title}>
        <td>
         
            {row.hash}
        </td>
        <td>
        <Anchor component="button" fz="sm">
{row.title}
</Anchor>
</td>
        <td>
            {row.year}
        </td>
        <td>        <Anchor component="button" fz="sm">     {row.author} </Anchor>
</td>
<td>
            {row.speed}
          </td>
        <td>
          
          <Group position="apart">
            <Text fz="xs" c="teal" weight={700}>
              {positiveReviews.toFixed(0)}%
            </Text>
          </Group>
          <Progress
            classNames={{ bar: classes.progressBar }}
            sections={[
              {
                value: positiveReviews,
                color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
              }
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



const data = [
  { link: '', label: 'Analytics Center', icon: IconDashboard },
  { link: '', label: 'Swarm-Based File Registry', icon: IconList },
  { link: '', label: 'Connected Entities', icon: IconNetwork },
  { link: '', label: 'Platform', icon: IconAdjustmentsAlt },
  { link: '', label: 'Consensus-Based Data Network', icon: IconAperture },
];

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


export default function Home() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Billing');
  const [listData, setListData] = useState([]);

  useEffect(()=>{
    setInterval(()=>{
      let newListData = [];
      axios.get('http://localhost:9001/api')
      .then(function (response) {
        newListData = []
        let apiData = response.data;
        for(const d of apiData.torrents){
          // data: {
          //   title: string;
          //   author: string;
          //   year: number;
          //   reviews: { positive: number; negative: number };
          // }[];
          let temp = {
            hash: d.hash.substring(0,8),
            title: d.name,
            year: getReadableFileSizeString(d.size),
            author: d.state === 'pausedUP'? 'completed' : d.state,
            speed: formatSpeed(d.dlspeed),
            reviews:{
              positive: d.size - d.amount_left,
              negative: d.amount_left
            }
          }
          newListData.push(temp);
        }
    
        setListData(newListData);
    })
   
    },1000)
   
  },[])

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div className='container'> 
      <style  jsx>{`
        .container{
          height: 100vh;
          width: 100%;
          display:flex;
        }

        .navbar {
          height: 100vh;
        }

        .main{
          padding: 100px;
          width: 100%;
        }
      `}
      </style>
    <Navbar width={{ sm: 300 }} p="md" className='navbar'>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <h3>Data Fortress</h3>
          <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
        </Group>
        {links}
      </Navbar.Section>
    </Navbar>
    <div className='main'>
      <Title size={35}>Swarm-Based File Registry</Title>
      <br></br>
      <TableReviews data={listData} />
    </div>
    </div>
  );
}

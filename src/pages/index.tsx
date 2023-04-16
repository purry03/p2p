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
import { Registry } from './registry';

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


interface TableScrollAreaProps {
  data: { name: string; email: string; company: string }[];
}

export function TableScrollArea({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => (
    <tr key={row.name}>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.company}</td>
    </tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
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
  const [tab,setTab] = useState('');
   
  useEffect(()=>{
    setInterval(()=>{
      let newListData = [];
      axios.get('http://localhost:9001/api')
      .then(function (response) {
        newListData = []
        let apiData = response.data;
        for(const torrent of apiData.torrents){
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

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        setTab(item.label)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  let tabToRender = null;

  switch(tab){
    case 'Swarm-Based File Registry':
      tabToRender = 
      <>
      <Title size={35}>Swarm-Based File Registry</Title>
      <br/>
      <Registry data={listData} />
      </>
      break;
    case 'Connected Entities':
      tabToRender = 
      <>
      <Title size={35}>Connected Entities</Title>
      <br/>
      <TableScrollArea data={[]} />
      </>
  }


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
     {tabToRender}
    </div>
    </div>
  );
}

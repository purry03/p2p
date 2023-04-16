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
import { Entities } from './entities';
import { Platform } from './platform';

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




const data = [
  { link: '', label: 'Analytics Center', icon: IconDashboard },
  { link: '', label: 'Swarm-Based File Registry', icon: IconList },
  { link: '', label: 'Connected Entities', icon: IconNetwork },
  { link: '', label: 'Platform', icon: IconAdjustmentsAlt },
  { link: '', label: 'Consensus-Based Data Network', icon: IconAperture },
];



export default function Home() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Billing');
  const [tab,setTab] = useState('');
   
 

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
      <Registry/>
      </>
      break;
    case 'Connected Entities':
      tabToRender = 
      <>
      <Title size={35}>Connected Entities</Title>
      <br/>
      <Entities/>
      </>
      break;
    case 'Platform':
        tabToRender = 
        <>
        <Platform />
        </>
        break;
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

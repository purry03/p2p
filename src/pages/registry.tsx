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
    data: {
      hash: string;
      alias: string;
      size: string;
      real_size: number;
      mode: string;
      speed: string;
      progress: number;
    }[];
  }
  
  export function Registry({ data }: RegistryProps) {
    const { classes, theme } = useStyles();
  
    const rows = data.map((row) => {
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
  
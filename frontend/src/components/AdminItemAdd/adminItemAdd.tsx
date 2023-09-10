import {
  Table,
  ScrollArea,
  createStyles,
  rem,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuthContextAdmin } from "../../hooks/useAuthContextAdmin";
import { IconEdit, IconTrash } from "@tabler/icons-react";
const useStyles = createStyles((theme) => ({
  tableHeader: {
    backgroundColor: theme.colors.gray[2], // Change this color as per your preference
  },

  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
  header: {
    position: "sticky",
    zIndex: 100,
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
const AdminItemAdd = () => {
  const [scrolled, setScrolled] = useState(false);
  const { classes, cx } = useStyles();
  const { admin }: any = useAuthContextAdmin();

  //   currency formater
  // format number to SL rupee
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  // feth all the items data
  const {
    data = [],
    error,
    isLoading,
  } = useQuery(["Items"], () =>
    axios
      .get("http://localhost:3001/items", {
        headers: {
          Authorization: `Bearer ${admin.accessToken}`,
        },
      })
      .then((res) => res.data)
  );

  console.log(data);

  const rows =
    data.length > 0
      ? data.map((item: any) => (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{rupee.format(item.sellingPrice)}</td>
            <td>{rupee.format(item.ActualPrice)}</td>
            <td>{item.Quantity}</td>
            <td>
              {
                <Group>
                  <ActionIcon>
                    <IconEdit color="teal" />
                  </ActionIcon>
                  <ActionIcon>
                    <IconTrash color="red" />
                  </ActionIcon>
                </Group>
              }
            </td>
          </tr>
        ))
      : null;

  return (
    <ScrollArea
      w={"100mw"}
      h={600}
      scrollbarSize={"sm"}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table
        highlightOnHover
        horizontalSpacing={30}
        verticalSpacing="lg"
        w={"100mw"}
        sx={{ tableLayout: "fixed" }}
      >
        <thead
          className={cx(classes.header, classes.tableHeader, {
            [classes.scrolled]: scrolled,
          })}
        >
          <tr>
            <th>Title</th>
            <th style={{overflow : "auto"}}>description</th>
            <th>selling price</th>
            <th>Actual price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows !== null ? (
            rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )
          ) : null}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default AdminItemAdd;

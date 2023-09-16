import {
  ScrollArea,
  Table,
  Text,
  rem,
  createStyles,
  Group,
  TextInput,
  Button,
  Modal,
  NumberInput,
  Textarea,
  FileInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuthContextAdmin } from "../../hooks/useAuthContextAdmin";
import {
  IconCheck,
  IconClipboardData,
  IconPlus,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

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

const ManageHumanModel = () => {
  const [scrolled, setScrolled] = useState(false);
  const { classes, cx } = useStyles();
  const { admin }: any = useAuthContextAdmin();
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // feth all the items data
  const {
    data = [],
    error,
    isLoading,
    refetch,
  } = useQuery(["Items"], () =>
    axios
      .get("http://localhost:3001/human/", {
        headers: {
          Authorization: `Bearer ${admin.accessToken}`,
        },
      })
      .then((res) => res.data)
  );

  //   generate rows
  const rows =
    data.length > 0
      ? data.map((model: any) => (
          <tr>
            <td>{model.name}</td>
            <td>{model.shoulder}</td>
            <td>{model.chestWidth}</td>
            <td>{model.height}</td>
            <td>{model.bust}</td>
            <td>{model.weist}</td>
            <td>{model.hip}</td>
          </tr>
        ))
      : null;

  const addHumanForm = useForm({
    initialValues: {
      name: "",
      chestWidth: "",
      height: "",
      bust: "",
      weist: "",
      hip: "",
    },
  });

  const handleSubmit = (values: any) => {
    console.log(values);
    // loading notification
    showNotification({
      id: "add-item",
      title: "Record is adding....",
      message: "We are trying to adding record",
      autoClose: 1500,
      loading: true,
    });

    // request to add item endpoint
    axios
      .post("http://localhost:3001/human/add", values, {
        headers: { Authorization: `bearer ${admin.accessToken}` },
      })
      .then((res) => {
        // refetch the updated data
        refetch();

        // show success notification
        updateNotification({
          id: "add-item",
          title: "Record was uploaded",
          message: "your record was added successfully",
          autoClose: 1500,
          color: "teal",
          icon: <IconCheck />,
        });

        // close the modal
        setOpened(false);

        // reset the form
        addHumanForm.reset();
      })
      .catch((error) => {
        console.log(error);
        updateNotification({
          id: "add-item",
          title: "Record was not uploaded",
          message: error.response.data.error,
          autoClose: 1500,
          color: "red",
          icon: <IconX />,
        });
      });
  };
  return (
    <>
      {/* add modal */}
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Text align="center" weight={500}>
          Add Item
        </Text>
        <form
          onSubmit={addHumanForm.onSubmit((values) =>
            console.log(values, file)
          )}
        >
          <TextInput
            label="name"
            mb={10}
            required
            {...addHumanForm.getInputProps("name")}
          />
          <NumberInput
            label="chestWidth"
            mb={10}
            required
            {...addHumanForm.getInputProps("chestWidth")}
          />
          <NumberInput
            type="number"
            label={"bust"}
            mb={10}
            required
            {...addHumanForm.getInputProps("bust")}
          />
          <NumberInput
            type="number"
            label={"height"}
            mb={10}
            required
            {...addHumanForm.getInputProps("height")}
          />
          <NumberInput
            label={"hip"}
            mb={10}
            required
            {...addHumanForm.getInputProps("hip")}
          />
          <NumberInput
            label={"weist"}
            mb={10}
            required
            {...addHumanForm.getInputProps("weist")}
          />
          <FileInput
            label="Model file"
            placeholder="model glb"
            accept=".glb"
            required
            onChange={(e) => setFile(e)}
            icon={<IconUpload size={rem(14)} />}
          />
          <Button fullWidth type="submit" mt={10}>
            Add Model
          </Button>
        </form>
      </Modal>
      <Group>
        <TextInput
          placeholder="Search by any field"
          mt={50}
          mb={50}
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          // value={search}
          // onChange={handleSearchChange}
          w={"70%"}
        />
        <Button leftIcon={<IconPlus />} onClick={() => setOpened(true)}>
          Add Item
        </Button>
        <Button leftIcon={<IconClipboardData />} color="red">
          Generate Document
        </Button>
      </Group>
      <ScrollArea
        w={"100mw"}
        h={500}
        scrollbarSize={"sm"}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing={50}
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
              <th>Name</th>
              <th>Shoulder</th>
              <th>Chest Width</th>
              <th>Height</th>
              <th>Bust</th>
              <th>Weist</th>
              <th>Hip</th>
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
    </>
  );
};

export default ManageHumanModel;

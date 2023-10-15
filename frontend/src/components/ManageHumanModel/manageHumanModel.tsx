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
  ActionIcon,
  FileInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuthContextAdmin } from "../../hooks/useAuthContextAdmin";
import {
  IconCheck,
  IconClipboardData,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HumanPDF from "../humanModelPDF/humanModelPDF";

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
  const [editOpened,setEditOpened] = useState(false);

  const navigate = useNavigate();

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
  
  // delete Model
  const deleteModel = (_id: string) => {
    showNotification({
      id: "Model-delete",
      title: "Model is deleting",
      message: "We are trying to delete Model",
      autoClose: 1500,
      loading: true,
    });

    // delete Model
    axios
      .delete(`http://localhost:3001/human/delete/${_id}`, {
        headers: { Authorization: `bearer ${admin.accessToken}` },
      })
      .then((res) => {
        // show success notification
        updateNotification({
          id: "Model-delete",
          title: "Record was deleted",
          message: "your record was deleted successfully",
          autoClose: 1500,
          color: "teal",
          icon: <IconCheck />,
        });

        // refetch the updated data
        refetch();
      })
      .catch((error) => {
        updateNotification({
          id: "Model-delete",
          title: "Model was not deleted",
          message: error.response.data.error,
          autoClose: 1500,
          color: "red",
          icon: <IconX />,
        });
      });
  };
  
  //   generate rows
  const rows =
    data.length > 0
      ? data.map((model: any) => (
          <tr>
            <td>{model.name}</td>
            <td>{model.chestWidth}</td>
            <td>{model.height}</td>
            <td>{model.bust}</td>
            <td>{model.weist}</td>
            <td>{model.hip}</td>
            <td>
              {
                <Group spacing={"xs"}>
                  <ActionIcon color="blue" component="a" href={`/view/human/${model.fileName}`} target="_blank">
                    <IconEye size={25}/>
                  </ActionIcon>
                  <ActionIcon color="teal">
                    <IconEdit
                    size={25}
                      
                      onClick={() => {
                        editHumanModelForm.setValues({
                          _id: model._id,
                          name: model.name,
                          chestWidth: model.chestWidth,
                          height: model.height,
                          bust: model.bust,
                          weist: model.weist,
                          hip : model.hip,
                          existFile : model.fileName
                        });

                        // opened edit modal
                        setEditOpened(true);
                      }}
                    />
                  </ActionIcon>
                  <ActionIcon color="red">
                    <IconTrash
                      size={25}
                      onClick={() => deleteModel(model._id)}
                    />
                  </ActionIcon>
                </Group>
              }
            </td>
          </tr>
        ))
      : null;

  console.log(data);

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
    console.log({ ...values, file });
    // loading notification
    showNotification({
      id: "add-item",
      title: "Record is adding....",
      message: "We are trying to adding record",
      autoClose: 1500,
      loading: true,
    });

    // Create a FormData object
    const formData = new FormData();

    // Append text data to the FormData object
    formData.append("bust", values.bust);
    formData.append("chestWidth", values.chestWidth);
    formData.append("height", values.height);
    formData.append("hip", values.hip);
    formData.append("name", values.name);
    formData.append("weist", values.weist);

    // Append the file to the FormData object
    formData.append("file", file!!);

    // request to add item endpoint
    axios
      .post("http://localhost:3001/human/add", formData, {
        headers: {
          Authorization: `bearer ${admin.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
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

  const handleEdit = (values: any) => {
    console.log({ ...values, file });
    // loading notification
    showNotification({
      id: "Edit-item",
      title: "Record is Editing....",
      message: "We are trying to Editing record",
      autoClose: 1500,
      loading: true,
    });

    // Create a FormData object
    const formData = new FormData();

    // Append text data to the FormData object
    formData.append("_id",values._id);
    formData.append("bust", values.bust);
    formData.append("chestWidth", values.chestWidth);
    formData.append("height", values.height);
    formData.append("hip", values.hip);
    formData.append("name", values.name);
    formData.append("weist", values.weist);
    formData.append("existFile",values.existFile);
    // Append the file to the FormData object
    formData.append("file", file!!);

    // request to Edit item endpoint
    axios
      .put("http://localhost:3001/human/edit", formData, {
        headers: {
          Authorization: `bearer ${admin.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // refetch the updated data
        refetch();

        // show success notification
        updateNotification({
          id: "Edit-item",
          title: "Record was uploaded",
          message: "your record was Edited successfully",
          autoClose: 1500,
          color: "teal",
          icon: <IconCheck />,
        });

        // close the modal
        setEditOpened(false);

        // reset the form
        editHumanModelForm.reset();
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

  const editHumanModelForm = useForm({
    initialValues: {
      _id  : "",
      name: "",
      chestWidth: "",
      height: "",
      bust: "",
      weist: "",
      hip: "",
      existFile : ""
    },
  })

  return (
    <>
         {/* Edit modal */}
         <Modal opened={editOpened} onClose={() => setEditOpened(false)}>
        <Text align="center" weight={500}>
          Edit Human Model
        </Text>
        <form
          onSubmit={editHumanModelForm.onSubmit((values) => handleEdit(values))}
        >
          <TextInput
            label="Name"
            mb={10}
            required
            {...editHumanModelForm.getInputProps("name")}
          />
          <NumberInput
            label="Chest Width"
            mb={10}
            required
            {...editHumanModelForm.getInputProps("chestWidth")}
          />
          <NumberInput
            type="number"
            label={"Bust"}
            mb={10}
            required
            {...editHumanModelForm.getInputProps("bust")}
          />
          <NumberInput
            type="number"
            label={"Height"}
            mb={10}
            required
            {...editHumanModelForm.getInputProps("height")}
          />
          <NumberInput
            label={"Hip"}
            mb={10}
            required
            {...editHumanModelForm.getInputProps("hip")}
          />
          <NumberInput
            label={"Weist"}
            mb={10}
            required
            {...editHumanModelForm.getInputProps("weist")}
          />
          <FileInput
            label="Model File"
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
      {/* add modal */}
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Text align="center" weight={500}>
          Add Human Model
        </Text>
        <form
          onSubmit={addHumanForm.onSubmit((values) => handleSubmit(values))}
        >
          <TextInput
            label="Name"
            mb={10}
            required
            {...addHumanForm.getInputProps("name")}
          />
          <NumberInput
            label="Chest Width"
            mb={10}
            required
            {...addHumanForm.getInputProps("chestWidth")}
          />
          <NumberInput
            type="number"
            label={"Bust"}
            mb={10}
            required
            {...addHumanForm.getInputProps("bust")}
          />
          <NumberInput
            type="number"
            label={"Height"}
            mb={10}
            required
            {...addHumanForm.getInputProps("height")}
          />
          <NumberInput
            label={"Hip"}
            mb={10}
            required
            {...addHumanForm.getInputProps("hip")}
          />
          <NumberInput
            label={"Weist"}
            mb={10}
            required
            {...addHumanForm.getInputProps("weist")}
          />
          <FileInput
            label="Model File"
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
          Add Model
        </Button>
        <PDFDownloadLink
              document={<HumanPDF data={data} />}
              fileName={`HumanModelReport - ${new Date().toLocaleDateString('en-CA')}`}
            >
        <Button leftIcon={<IconClipboardData />} color="red">
          Generate Document
        </Button></PDFDownloadLink>
      </Group>
      <ScrollArea
        w={"100mw"}
        h={"80vh"}
        scrollbarSize={"sm"}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing={40}
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
              <th>Chest Width</th>
              <th>Height</th>
              <th>Bust</th>
              <th>Weist</th>
              <th>Hip</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default ManageHumanModel;

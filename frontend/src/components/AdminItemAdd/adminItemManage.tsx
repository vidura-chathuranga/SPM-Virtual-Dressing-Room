import {
  Table,
  ScrollArea,
  createStyles,
  rem,
  Text,
  Group,
  ActionIcon,
  TextInput,
  Button,
  Modal,
  NumberInput,
  Textarea,
  SimpleGrid,
  Center,
  Image,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuthContextAdmin } from "../../hooks/useAuthContextAdmin";
import {
  IconCheck,
  IconClipboardData,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ItemPDF from "../ItemPDFTemplate/ItemPDF";

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

  // modal controller
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  // files state
  const [files, setFiles] = useState<FileWithPath[]>([]);
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
    refetch,
  } = useQuery(["Items"], () =>
    axios
      .get("http://localhost:3001/items", {
        headers: {
          Authorization: `Bearer ${admin.accessToken}`,
        },
      })
      .then((res) => res.data)
  );
    
  // search any field
  const[search,setSearch] = useState('');

  // delete item
  const deleteItem = (_id: string) => {
    showNotification({
      id: "item-delete",
      title: "Item is deleting",
      message: "We are trying to delete item",
      autoClose: 1500,
      loading: true,
    });

    // delete item
    axios
      .delete(`http://localhost:3001/items/delete/${_id}`, {
        headers: { Authorization: `bearer ${admin.accessToken}` },
      })
      .then((res) => {
        // show success notification
        updateNotification({
          id: "item-delete",
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
          id: "item-delete",
          title: "Item was not deleted",
          message: error.response.data.error,
          autoClose: 1500,
          color: "red",
          icon: <IconX />,
        });
      });
  };

  // edit form
  const editItemForm = useForm({
    initialValues: {
      _id: "",
      title: "",
      description: "",
      sellingPrice: 0,
      actualPrice: 0,
      quantity: 0,
    },
  });

  // edit funciton
  const editItem = (values: {
    _id: string;
    title: string;
    description: string;
    sellingPrice: Number;
    actualPrice: Number;
    quantity: Number;
  }) => {
    // loading notification
    showNotification({
      id: "update-item",
      title: "Record is udating....",
      message: "We are trying to update record",
      autoClose: 1500,
      loading: true,
    });

    axios
      .put("http://localhost:3001/items/update", values, {
        headers: { Authorization: `bearer ${admin.accessToken}` },
      })
      .then((res) => {
        // loading notification
        updateNotification({
          id: "update-item",
          title: "Record was updated",
          message: "Record was successfully updated",
          autoClose: 1500,
          color: "teal",
          icon: <IconCheck />,
        });

        refetch();

        // close edit modal
        setEditOpened(false);

        // clear modal details
        editItemForm.reset();
      })
      .catch((error) => {
        updateNotification({
          id: "update-item",
          title: "Record was not uploaded",
          message: error.response.data.error,
          autoClose: 1500,
          color: "red",
          icon: <IconX />,
        });
      });
  };

  // generate rows
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
                    <IconEdit
                      color="teal"
                      onClick={() => {
                        editItemForm.setValues({
                          _id: item._id,
                          title: item.title,
                          description: item.description,
                          sellingPrice: item.sellingPrice,
                          actualPrice: item.ActualPrice,
                          quantity: item.Quantity,
                        });

                        // opened edit modal
                        setEditOpened(true);
                      }}
                    />
                  </ActionIcon>
                  <ActionIcon>
                    <IconTrash
                      color="red"
                      onClick={() => deleteItem(item._id)}
                    />
                  </ActionIcon>
                </Group>
              }
            </td>
          </tr>
        ))
      : null;

  // item forms
  const addItemForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      title: "",
      description: "",
      sellingPrice: 0,
      actualPrice: 0,
      quantity: 0,
    },
  });

  const handleSubmit = async(values: {
    title: string;
    description: string;
    sellingPrice: Number;
    actualPrice: Number;
    quantity: Number;
  }) => {
    // loading notification
    showNotification({
      id: "add-item",
      title: "Record is adding....",
      message: "We are trying to adding record",
      autoClose: 1500,
      loading: true,
    });

    // create image URL array
    const imageUrls = [];

    for(let i=0; i< files.length; i++){
      imageUrls.push(await convertBase64(i))
    }

    // request to add item endpoint
    axios
      .post("http://localhost:3001/items/add", {...values,imageUrls}, {
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
        addItemForm.reset();
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

  // image preview
  const imagePreview = files.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);

    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  const convertBase64 = (index : any) =>{
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(files[index]);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = () => {
        reject(fileReader.error);
      };
    });
  }
  return (
    <>
      {/* edit modal */}
      <Modal opened={editOpened} onClose={() => setEditOpened(false)}>
        <Text align="center" weight={500}>
          Edit Item
        </Text>
        <form onSubmit={editItemForm.onSubmit((values) => editItem(values))}>
          <TextInput
            label="Title"
            mb={10}
            required
            {...editItemForm.getInputProps("title")}
          />
          <Textarea
            label="Description"
            mb={10}
            required
            maxRows={5}
            {...editItemForm.getInputProps("description")}
          />
          <TextInput
            type="number"
            label={"Selling price"}
            mb={10}
            required
            {...editItemForm.getInputProps("sellingPrice")}
          />
          <TextInput
            type="number"
            label={"Actual price"}
            mb={10}
            required
            {...editItemForm.getInputProps("actualPrice")}
          />
          <TextInput
            label={"Quantity"}
            mb={10}
            type="number"
            required
            {...editItemForm.getInputProps("quantity")}
          />
          <Button fullWidth type="submit">
            Edit Item
          </Button>
        </form>
      </Modal>

      {/* add modal */}
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Text align="center" weight={500}>
          Add Item
        </Text>
        <form onSubmit={addItemForm.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Title"
            mb={10}
            required
            {...addItemForm.getInputProps("title")}
          />
          <Textarea
            label="Description"
            mb={10}
            required
            maxRows={5}
            {...addItemForm.getInputProps("description")}
          />
          <TextInput
            type="number"
            label={"Selling price"}
            mb={10}
            required
            {...addItemForm.getInputProps("sellingPrice")}
          />
          <TextInput
            type="number"
            label={"Actual price"}
            mb={10}
            required
            {...addItemForm.getInputProps("actualPrice")}
          />
          <TextInput
            label={"Quantity"}
            mb={10}
            type="number"
            required
            {...addItemForm.getInputProps("quantity")}
          />
          {/* insert images */}
          <Dropzone accept={IMAGE_MIME_TYPE} multiple onDrop={setFiles} mb={20} aria-required>
            <Text align="center">Drop product images here</Text>
          </Dropzone>

          <SimpleGrid
            cols={3}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            mt={imagePreview.length > 0 ? "xl" : 0}
            mb={imagePreview.length > 0 ? "xl" : 0}
          >{imagePreview}</SimpleGrid>

          <Button fullWidth type="submit" disabled={files.length === 0}>
            Add Item
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
          onChange={(e) => setSearch(e.target.value)}
          w={"70%"}
        />
        <Button leftIcon={<IconPlus />} onClick={() => setOpened(true)}>
          Add Item
        </Button>
        <PDFDownloadLink
              document={<ItemPDF data={data} />}
              fileName={`ItemDetails - ${new Date().toLocaleDateString('en-CA')}`}
            >
        <Button leftIcon={<IconClipboardData />} color="red">
          Generate Report
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
              <th>Title</th>
              <th style={{ overflow: "auto" }}>description</th>
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
    </>
  );
};

export default AdminItemAdd;

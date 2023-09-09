import {
  Anchor,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconGardenCart, IconMailFilled, IconPhone } from "@tabler/icons-react";
import { useSignUp } from "../../hooks/useSignUp";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const UserRegister = () => {
  const { signUp, isLoading } = useSignUp();

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    shippingAddress: string;
    password: string;
  }) => {
    // use SignUp function to register user
    const error = await signUp(
      values.firstName,
      values.lastName,
      values.email,
      values.mobileNumber,
      values.shippingAddress,
      values.password
    );
    
    // if there is an error while registering
    if (error) {
      showNotification({
        title: "Register failed",
        message: error,
        color: "red",
        icon: <IconX />,
        autoClose: 2500,
        radius: "xl",
        withBorder: true,
        withCloseButton: false,
      });
    }
  };
  const registerForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      shippingAddress: "",
    },
    validate: {
      email: (value) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "invalid email",
      mobileNumber: (values) =>
        values.length != 10 ? "Invalid phone number" : null,
      password: (values) =>
        values.length < 8 ? "Password should have at least 8 characters" : null,
    },
  });
  return (
    <Card withBorder radius={"lg"} w={"500px"} mx={"auto"} shadow="xl">
      <Card.Section withBorder p={10}>
        <Text size={20} weight={500} ta={"center"}>
          Welcome
        </Text>
      </Card.Section>
      <Card.Section p={30}>
        <form onSubmit={registerForm.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            <Group grow>
              <TextInput
                required
                label="first name"
                placeholder="David"
                {...registerForm.getInputProps("firstName")}
              />
              <TextInput
                required
                label="last name"
                placeholder="Manel"
                {...registerForm.getInputProps("lastName")}
              />
            </Group>
            {/* email input */}
            <TextInput
              label={"Email"}
              required
              withAsterisk
              icon={<IconMailFilled size={20} />}
              placeholder="devid@email.com"
              {...registerForm.getInputProps("email")}
            />

            <TextInput
              type="number"
              placeholder="071-XXXXXX"
              icon={<IconPhone size={20} />}
              label={"phone number"}
              {...registerForm.getInputProps("mobileNumber")}
              required
            />

            <TextInput
              placeholder="No,12,Malabe,Kaduwela"
              label={"shipping address"}
              icon={<IconGardenCart size={20} />}
              {...registerForm.getInputProps("shippingAddress")}
            />
            {/* password input */}
            <PasswordInput
              label={"password"}
              required
              withAsterisk
              {...registerForm.getInputProps("password")}
            />

            {/* login button */}
            <Button
              fullWidth
              loading={isLoading}
              loaderPosition="center"
              type="submit"
            >
              Register
            </Button>
          </Stack>
        </form>
      </Card.Section>
      <Card.Section withBorder p={10}>
        <Text color="dimmed" ta={"center"} size={10}>
          Already have an account?
          <Anchor href="/login" color="blue" ml={5}>
            Login
          </Anchor>
        </Text>
      </Card.Section>
    </Card>
  );
};

export default UserRegister;

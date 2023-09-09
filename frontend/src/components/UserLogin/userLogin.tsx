import {
  Anchor,
  Button,
  Card,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignIn } from "../../hooks/useSignIn";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const UserLogin = () => {
  const { signIn, isLoading } = useSignIn();

  // handle the form
  const loginForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "invalid email",
    },
  });

  // handle Submit
  const handleSubmit = async (values: { email: string; password: string }) => {
    const error = await signIn(values.email, values.password);

    // if error happens when login this error message will be appeared
    if (error) {
      showNotification({
        title: "Login failed",
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

  return (
    <Card withBorder radius={"lg"} w={"500px"} mx={"auto"} shadow="xl">
      <Card.Section withBorder p={20}>
        <Text size={20} weight={500} ta={"center"}>
          Welcome back
        </Text>
      </Card.Section>
      <Card.Section p={30}>
        <form onSubmit={loginForm.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            {/* email input */}
            <TextInput
              label={"Email"}
              required
              withAsterisk
              placeholder="devid@email.com"
              {...loginForm.getInputProps("email")}
            />

            {/* password input */}
            <PasswordInput
              label={"password"}
              required
              withAsterisk
              {...loginForm.getInputProps("password")}
            />

            {/* login button */}
            <Button
              fullWidth
              loading={isLoading}
              loaderPosition="center"
              type="submit"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Card.Section>
      <Card.Section withBorder p={10}>
        <Text color="dimmed" ta={"center"} size={10}>
          Don't have an account?
          <Anchor href="/register" color="blue" ml={5}>
            Register
          </Anchor>
        </Text>
      </Card.Section>
    </Card>
  );
};

export default UserLogin;

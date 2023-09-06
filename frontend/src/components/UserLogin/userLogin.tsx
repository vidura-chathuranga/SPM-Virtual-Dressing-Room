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

const UserLogin = () => {
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

  return (
    <Card withBorder radius={"lg"} w={"500px"} mx={"auto"}>
      <Card.Section withBorder p={20}>
        <Text size={20} weight={500} ta={"center"}>
          Welcome back
        </Text>
      </Card.Section>
      <Card.Section p={30}>
        <form onSubmit={loginForm.onSubmit((values) => console.log(values))}>
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
            <Button fullWidth>Login</Button>

          </Stack>
        </form>
      </Card.Section>
      <Card.Section withBorder p={10}>
        <Text color="dimmed" ta={"center"} size={10}>
          Don't have an account?
          <Anchor href="/user/register" color="blue" ml={5}>
            Register
          </Anchor>
        </Text>
      </Card.Section>
    </Card>
  );
};

export default UserLogin;

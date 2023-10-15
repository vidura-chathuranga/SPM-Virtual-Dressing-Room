import {
  Card,
  Stack,
  Group,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Box,
  Center,
  Progress,
  Flex,
} from "@mantine/core";
import {
  IconMailFilled,
  IconPhone,
  IconGardenCart,
  IconCheck,
  IconTriangle,
  IconX,
} from "@tabler/icons-react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import userService from "../../services/userService";
import { showNotification, updateNotification } from "@mantine/notifications";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const UserProfile: React.FC = () => {
  const { user }: any = useAuthContext();

  const { isLoading: isUserLoading } = useQuery(
    ["User"],
    () => userService.getUserById(user._id, user.accessToken),
    {
      onSuccess: (data) => {
        editForm.setValues({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          shippingAddress: data.shippingAddress,
        });
      },
    }
  );

  //update profile mutation
  const updateProfileMutation = useMutation(
    (values: any) => userService.updateUser(user._id, user.accessToken, values),
    {
      onMutate: () => {
        showNotification({
          id: "updating-profile",
          title: "Updating Profile",
          message: "Please wait...",
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (data) => {
        editForm.setValues({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          shippingAddress: data.shippingAddress,
        });

        //update local storage
        const newUser: any = {
          ...user,
          firstName: data.firstName,
          email: data.email,
        };

        localStorage.setItem("user", JSON.stringify(newUser));

        updateNotification({
          id: "updating-profile",
          title: "Profile Updated",
          message: "Your profile has been updated successfully",
          color: "teal",
          icon: <IconCheck size="1rem" />,
          autoClose: 2500,
          withCloseButton: true,
        });
      },
      onError: () => {
        updateNotification({
          id: "updating-profile",
          title: "Profile Update Failed",
          message: "Something went wrong",
          color: "red",
          icon: <IconTriangle size="1rem" />,
          autoClose: 2500,
          withCloseButton: true,
        });
      },
    }
  );

  //user password mutation
  const userPasswordMutation = useMutation(
    (values: any) =>
      userService.changePassword(
        user._id,
        user.accessToken,
        values.currentPassword,
        values.password
      ),
    {
      onMutate: () => {
        showNotification({
          id: "updating-password",
          title: "Updating Password",
          message: "Please wait...",
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: () => {
        userPasswordForm.reset();
        updateNotification({
          id: "updating-password",
          title: "Password Updated",
          message: "Your password has been updated successfully",
          color: "teal",
          icon: <IconCheck size="1rem" />,
          autoClose: 2500,
          withCloseButton: true,
        });
      },
      onError: () => {
        updateNotification({
          id: "updating-password",
          title: "Password Update Failed",
          message: "Invalid credentials. Please try again.",
          color: "red",
          icon: <IconTriangle size="1rem" />,
          autoClose: 2500,
          withCloseButton: true,
        });
      },
    }
  );

  // handle the form
  const handleUpdateProfileSubmit = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  const handleUserPasswordSubmit = (values: any) => {
    userPasswordMutation.mutate(values);
  };

  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: user.firstName,
      lastName: "",
      email: user.email,
      mobileNumber: "",
      shippingAddress: "",
    },
    validate: {
      email: (value) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "invalid email",
      mobileNumber: (values) =>
        values.length !== 10 ? "Invalid phone number" : null,
    },
  });

  const userPasswordForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        /[0-9]/.test(value) &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[$&+,:;=?@#|'<>.^*()%!-]/.test(value) &&
        value.length > 7
          ? null
          : "Password must be at least 8 characters long and include at least one number, one lowercase letter, one uppercase letter and one special symbol",
      confirmPassword: (value, { password }) =>
        value === password ? null : "Passwords do not match",
    },
  });

  const strength = getStrength(userPasswordForm.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(userPasswordForm.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          userPasswordForm.values.password.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  return (
    <Flex align="start" gap={20} mt={20} w={"80%"} m={"auto"}>
      <Card withBorder radius={"lg"} w={"500px"} mx={"auto"} shadow="xl">
        <Card.Section withBorder p={10}>
          <Text size={20} weight={500} ta={"center"}>
            Edit Profile
          </Text>
        </Card.Section>
        <Card.Section p={30}>
          <form
            onSubmit={editForm.onSubmit((values) => {
              handleUpdateProfileSubmit(values);
            })}
          >
            <Stack>
              <Group grow>
                <TextInput
                  required
                  label="First Name"
                  placeholder="David"
                  {...editForm.getInputProps("firstName")}
                />
                <TextInput
                  required
                  label="Last Name"
                  placeholder="Manel"
                  {...editForm.getInputProps("lastName")}
                />
              </Group>

              <TextInput
                label={"Email"}
                required
                withAsterisk
                icon={<IconMailFilled size={20} />}
                placeholder="devid@email.com"
                {...editForm.getInputProps("email")}
              />

              <TextInput
                type="number"
                placeholder="071-XXXXXX"
                icon={<IconPhone size={20} />}
                label={"Phone Number"}
                {...editForm.getInputProps("mobileNumber")}
                required
              />

              <TextInput
                placeholder="No,12,Malabe,Kaduwela"
                label={"Shipping Address"}
                icon={<IconGardenCart size={20} />}
                {...editForm.getInputProps("shippingAddress")}
              />

              <Button
                fullWidth
                loading={isUserLoading}
                loaderPosition="center"
                type="submit"
              >
                Save
              </Button>
            </Stack>
          </form>
        </Card.Section>
      </Card>
      <Card withBorder radius={"lg"} w={"500px"} mx={"auto"} shadow="xl">
        <Card.Section withBorder p={10}>
          <Text size={20} weight={500} ta={"center"}>
            Change Password
          </Text>
        </Card.Section>
        <Card.Section p={30}>
          <form
            onSubmit={userPasswordForm.onSubmit((values) => {
              handleUserPasswordSubmit(values);
            })}
          >
            <PasswordInput
              placeholder="Your current password"
              label="Current Password"
              {...userPasswordForm.getInputProps("currentPassword")}
            />
            <PasswordInput
              placeholder="Your New password"
              label="New Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
              {...userPasswordForm.getInputProps("password")}
            />
            <PasswordInput
              placeholder="Confirm your password"
              label="Confirm Password"
              {...userPasswordForm.getInputProps("confirmPassword")}
            />
            <Group spacing={5} grow mt="xs" mb="md">
              {bars}
            </Group>
            <PasswordRequirement
              label="Has at least 8 characters"
              meets={userPasswordForm.values.password.length > 7}
            />
            {checks}
            <Button sx={{ marginTop: "10px", width: "100%" }} type="submit">
              Change Password
            </Button>
          </form>
        </Card.Section>
      </Card>
    </Flex>
  );
};

export default UserProfile;

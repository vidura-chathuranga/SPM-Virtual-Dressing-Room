import { useState } from "react";
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  rem,
  Avatar,
} from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconCirclePlus,
  IconBrandCashapp,
  IconWoman
} from "@tabler/icons-react";
import { useAuthContextAdmin } from "../../../hooks/useAuthContextAdmin";
import { useLogoutAdmin } from "../../../hooks/useLogoutAdmin";
import { useNavigate } from "react-router-dom";
// import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },
  },

  active: {
    opacity: 1,
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.15
      ),
    },
  },
}));

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  {
    icon: IconCirclePlus,
    label: "Add Items",
    link: "/admin/dashboard/addItem",
  },
  {
    icon: IconBrandCashapp,
    label: "Finance",
    link: "/admin/dashboard/finance",
  },
  {
    icon: IconWoman,
    label: "Manage Human Models",
    link: "/admin/dashboard/managehuman",
  },
  { icon: IconCalendarStats, label: "Releases", link: "/admin/dashboard/" },
  { icon: IconUser, label: "Account", link: "/admin/dashboard/" },
  { icon: IconFingerprint, label: "Security", link: "/admin/dashboard/" },
  { icon: IconSettings, label: "Settings", link: "/admin/dashboard/" },
];

const AdminSideNavBar = ({ link_id }: any) => {
  const [active, setActive] = useState(link_id);
  const { admin }: any = useAuthContextAdmin();
  const { logout } = useLogoutAdmin();
  const navigate = useNavigate();

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        navigate(link.link);
      }}
    />
  ));

  return (
    <Navbar
      height={"100%"}
      width={{ base: 80 }}
      p="md"
      sx={(theme) => ({
        backgroundColor: theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background,
      })}
    >
      <Center>{/* <MantineLogo type="mark" inverted size={30} /> */}</Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <Avatar size={"sm"} radius={"100%"} color="cyan" ml={10}>
            {admin.name[0]}
          </Avatar>
          <NavbarLink icon={IconLogout} label="Logout" onClick={logout} />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default AdminSideNavBar;

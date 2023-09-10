import AdminLoginForm from "../components/adminLogin/adminLoginForm";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const AdminLogin = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.background}>
      <div>
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default AdminLogin;

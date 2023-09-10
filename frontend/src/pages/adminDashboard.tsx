import AdminSideNavBar from "../components/AdminDashboard/SideNavBar/AdminSideNavBar";
import AdminItemAdd from "../components/AdminItemAdd/adminItemAdd";
import { Grid } from "@mantine/core";

const AdminDashboard = () => {
  return (
    <Grid gutter={0}>
      <Grid.Col span="content">
        <AdminSideNavBar />
      </Grid.Col>
      <Grid.Col span={11} ml={20}>
        <center>
          <AdminItemAdd />
        </center>
      </Grid.Col>
    </Grid>
  );
};

export default AdminDashboard;

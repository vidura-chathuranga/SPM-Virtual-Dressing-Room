import AdminSideNavBar from "../components/AdminDashboard/SideNavBar/AdminSideNavBar";
import AdminItemAdd from "../components/AdminItemAdd/adminItemManage";
import { Grid } from "@mantine/core";

const AdminDashboard = () => {
  return (
    <Grid gutter={0}>
      <Grid.Col span="content">
        <AdminSideNavBar link_id={0}/>
      </Grid.Col>
      <Grid.Col span={11} ml={20}>
        <AdminItemAdd />
      </Grid.Col>
    </Grid>
  );
};

export default AdminDashboard;

import { Grid } from "@mantine/core";
import AdminSideNavBar from "../components/AdminDashboard/SideNavBar/AdminSideNavBar";
import Finance from "../components/AdminFinance/Finance";

const AdminFinance = () => {
  return (
    <Grid gutter={0}>
      <Grid.Col span="content">
        <AdminSideNavBar link_id={1} />
      </Grid.Col>
      <Grid.Col span={11} ml={20}>
        <Finance />
      </Grid.Col>
    </Grid>
  );
};

export default AdminFinance;

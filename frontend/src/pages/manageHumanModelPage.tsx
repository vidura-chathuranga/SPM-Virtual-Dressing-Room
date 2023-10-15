import { Grid } from "@mantine/core";
import AdminSideNavBar from "../components/AdminDashboard/SideNavBar/AdminSideNavBar";
import ManageHumanModel from "../components/ManageHumanModel/manageHumanModel";

const ManageHumanModelPage = () => {
  return (
    <Grid gutter={0}>
      <Grid.Col span="content">
        <AdminSideNavBar link_id={2}/>
      </Grid.Col>
      <Grid.Col span={11} ml={20}>
        <ManageHumanModel/>
      </Grid.Col>
    </Grid>
  );
};

export default ManageHumanModelPage;

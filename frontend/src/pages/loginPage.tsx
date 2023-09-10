import UserLogin from "../components/UserLogin/userLogin";
import { createStyles} from '@mantine/core';

const useStyles = createStyles((theme) =>({
    background : {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }
  }));
const LoginPage = () => {

    const {classes} = useStyles();

  return (
    <div className={classes.background}>
      <div>
        <UserLogin />
      </div>
    </div>
  );
};

export default LoginPage;

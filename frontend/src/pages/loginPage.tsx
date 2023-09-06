import UserLogin from "../components/UserLogin/userLogin";
// import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from "@mantine/carousel";
import { createStyles} from '@mantine/core';

const useStyles = createStyles((theme) =>({
    background : {
      height : "100vh",
    //   backgroundImage : `url(${backgroundImage})`,
      backgroundRepeat : "no-repeat",
      backgroundPosition : "center",
      backgroundSize : "cover" ,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor : "lightgrey" 
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

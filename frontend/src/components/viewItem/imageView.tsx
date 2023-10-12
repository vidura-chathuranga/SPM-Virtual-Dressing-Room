import {
  Card,
  Image,
  LoadingOverlay,
  SimpleGrid,
  createStyles,
  getStylesRef,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";

const useStyles = createStyles((theme) => ({
  largeImage: {
    width: 600,
    marginBottom: 30,
    transition: "transform 500ms ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },

  card: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom : 10
  },
  smallImage: {
    cursor: "pointer",
    transition: "transform 500ms ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },
}));
const ImageView = ({ images, isLoading }: any) => {
  const { classes } = useStyles();

  // large preview image manage
  const [image, setImage] = useState(null);

  const imagePreviews = Array.isArray(images)
    ? images.map((image, index) => (
        <div key={index} className={classes.smallImage}>
          <Image
            src={image}
            radius={5}
            style={{ transition: "transform 500ms ease" }}
            onClick={() => {
              setImage(image);
            }}
          />
        </div>
      ))
    : null;

  // Use useEffect to set the image state after data is received
  useEffect(() => {
    if (!isLoading && Array.isArray(images) && images.length > 0) {
      setImage(images[0]);
    }
  }, [isLoading, images]);

  return (
    <Card withBorder className={classes.card} radius={"md"}>
      <LoadingOverlay visible={!images ? true : false} overlayBlur={2} />
      <SimpleGrid p={30}>
        {images ? (
          <>
            <div>
              <Image src={image} radius={10} />
            </div>
            <Card.Section withBorder p={10} bg={"#f3efef"}>
              <div>
                <SimpleGrid cols={images.length}>{imagePreviews}</SimpleGrid>
              </div>
            </Card.Section>
          </>
        ) : null}
      </SimpleGrid>
    </Card>
  );
};

export default ImageView;

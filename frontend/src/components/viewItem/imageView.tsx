import { Image, SimpleGrid, createStyles } from "@mantine/core";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
  },
  largeImage: {
    width: 600,
    marginBottom: 30,
  },
  gridRow: {
    height: 200,
  },
}));
const ImageView = ({ images }: any) => {
  const imageRef = useRef(null);
  const { classes } = useStyles();

  const imagePreviews = Array.isArray(images)
    ? images.map((image, index) => (
        <div key={index}>
          <Image src={image} />
        </div>
      ))
    : null;
  return (
    <SimpleGrid>
      {images ? (
        <>
          <div className={classes.largeImage}>
            <Image src={images[0]} />
          </div>
          <div>
            <SimpleGrid cols={images.length} className={classes.gridRow}>
              {imagePreviews}
            </SimpleGrid>
          </div>
        </>
      ) : null}
    </SimpleGrid>
  );
};

export default ImageView;

import { Rating, SimpleGrid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  getStylesRef,
  rem,
  createStyles,
} from "@mantine/core";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
  price: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  carousel: {
    "&:hover": {
      [`& .${getStylesRef("carouselControls")}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef("carouselControls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: "width 250ms ease",

    "&[data-active]": {
      width: rem(16),
    },
  },
}));

const ItemShowCase = () => {
  const { user }: any = useAuthContext();
  const { classes } = useStyles();
  const autoplays: any = useRef();
  autoplays.current = [];

  const fetchItems = () => {
    return axios.get("http://localhost:3001/items/", {
      headers: { Authorization: `bearer ${user.accessToken}` },
    });
  };
  const {
    data = [],
    isLoading,
    error,
  } = useQuery(["Items"], () => fetchItems().then((response) => response.data));

  //   generate ref array
  data.forEach((item: any, index: any) => {
    autoplays.current.push(Autoplay({ delay: (index + 1) * 1000 }));
  });

  // format number to SL rupee
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });
  
//   generate item cards
  const items = data.map((item: any, index: any) => (
    <div key={item._id}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        component="a"      
        href="#"
      >
        <Card.Section>
          <Carousel
            loop
            withIndicators
            withControls = {false}
            plugins={[autoplays.current[index]]}
            onMouseEnter={autoplays.current[index].stop}
            onMouseLeave={autoplays.current[index].reset}
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
            }}
          >
            {item.images.map((image: any) => (
              <Carousel.Slide key={image}>
                <Image src={image} height={220} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Card.Section>
        <Rating value={item.rating} fractions={2} readOnly size="xs" mt={10}/>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{item.title}</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {item.description}
        </Text>

        <Group mt={10} position="apart">
          <Text weight={500} color="blue" size={22}>{rupee.format(item.sellingPrice)}</Text>
        </Group>
      </Card>
    </div>
  ));

  return (
    <SimpleGrid cols={3} spacing={"xl"} px={120} py={40}>
      {items}
    </SimpleGrid>
  );
};

export default ItemShowCase;

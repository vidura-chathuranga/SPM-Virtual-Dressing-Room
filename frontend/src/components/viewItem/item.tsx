import {
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useState } from "react";

const Item = ({ itemData }: any) => {
  const { ActualPrice, Quantity, rating, sellingPrice, title, description } =
    itemData;

  const [activeSize, setActiveSize] = useState(-1);

  // handle select size click
  const handleClick = (position: any) => {
    if (position === activeSize) {
      setActiveSize(-1);
    } else {
      setActiveSize(position);
    }
  };
  return (
    <Paper withBorder mr={30} mt={10} p={30}>
      <Title order={2}>{title}</Title>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>
      <Text mt={10} color="dimmed">
        {description}
      </Text>

      <Divider my="sm" mt={40} mb={10}/>
      {/* SELECT SIZE */}
      <Group spacing={"xl"} mb={20} mt={20}>
        <Text weight={"bold"}>Size</Text>
        <Button
          variant={activeSize === 0 ? "filled" : "default"}
          color="dark"
          onClick={() => handleClick(0)}
        >
          S
        </Button>
        <Button
          variant={activeSize === 1 ? "filled" : "default"}
          color="dark"
          onClick={() => handleClick(1)}
        >
          M
        </Button>
        <Button
          variant={activeSize === 2 ? "filled" : "default"}
          color="dark"
          onClick={() => handleClick(2)}
        >
          XL
        </Button>
        <Button
          variant={activeSize === 3 ? "filled" : "default"}
          color="dark"
          onClick={() => handleClick(3)}
        >
          XXL
        </Button>
      </Group>

      {/* Add to cart */}
      <Group spacing={"xl"} mb={30} mt={30}>
        <NumberInput min={0} max={Quantity} hideControls />
        <Button leftIcon={<IconShoppingCartPlus />} color="red">
          ADD TO CART
        </Button>
      </Group>
    </Paper>
  );
};

export default Item;

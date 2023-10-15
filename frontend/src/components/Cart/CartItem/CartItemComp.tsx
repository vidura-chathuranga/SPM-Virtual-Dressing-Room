import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Image,
  NumberInput,
  Text,
} from "@mantine/core";
import { CartContext, CartItem } from "../../../contexts/CartContext";
import { useContext } from "react";
import { IconTrash } from "@tabler/icons-react";

interface CartItemProps {
  item: CartItem;
}

const CartItemComp: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useContext(CartContext);

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  return (
    <Box>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb={10}>
        <Flex gap={10} justify={"space-between"}>
          <Image src={item.image} height={100} width={100} />
          <Box>
            <Text>{item.name}</Text>
            <Text weight={500} color="blue" size={22}>
              {rupee.format(item.price)}
            </Text>
            <NumberInput
              defaultValue={item.quantity}
              placeholder="Quantity"
              onChange={(value) => {
                updateQuantity(item.id, +value);
              }}
            />
          </Box>
          <ActionIcon
            variant="outline"
            color="red"
            size="lg"
            onClick={() => {
              removeFromCart(item.id);
            }}
            mt={10}
          >
            <IconTrash color="red" />
          </ActionIcon>
        </Flex>
      </Card>
    </Box>
  );
};

export default CartItemComp;

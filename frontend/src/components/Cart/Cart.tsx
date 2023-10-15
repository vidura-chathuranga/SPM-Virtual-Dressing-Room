import { Box, Button, Flex, Text } from "@mantine/core";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import CartItemComp from "./CartItem";

const Cart: React.FC = () => {
  const { cart } = useContext(CartContext);

  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"space-between"}
      h={"90vh"}
    >
      <Box>
        {cart.length === 0 && (
          <Text weight={600} size={"md"} mt={50} mb={50}>
            Cart is empty. Add some items to cart.
          </Text>
        )}
        {cart.map((item) => (
          <CartItemComp key={item.id} item={item} />
        ))}
      </Box>
      <Button fullWidth>Checkout</Button>
    </Flex>
  );
};

export default Cart;

import { Box, Button, Flex, Text } from "@mantine/core";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import CartItemComp from "./CartItem";
import { useNavigate } from "react-router";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

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
      <Flex w={"100%"} direction={"column"} align={"center"}>
        <Box>
          <Text weight={600} size={"md"}>
            Total Price: Rs.{getTotalPrice()}
          </Text>
        </Box>
        <Button
          onClick={() => {
            navigate("/checkout");
          }}
          fullWidth
        >
          Checkout
        </Button>
      </Flex>
    </Flex>
  );
};

export default Cart;

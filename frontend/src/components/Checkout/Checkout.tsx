import { Flex, Box, Button, Text, Modal, Title } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import CartItemComp from "../Cart/CartItem";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import braintree from "braintree-web";
import { decrypt } from "../PaymentInfo/PaymentInfo";
import { useAuthContext } from "../../hooks/useAuthContext";
import userService from "../../services/userService";
import PinField from "react-pin-field";
import cn from "classnames";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user }: any = useAuthContext();
  const [enterPinOpened, setEnterPinOpened] = useState(false);
  const [pinCompleted, setPinCompleted] = useState(false);
  const [info, setInfo] = useState("");

  const pinRef = useRef<HTMLInputElement[]>([]);

  const pinForm = useForm({
    initialValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (user) {
      userService
        .getPaymentInfoByUserId(user._id, user.accessToken)
        .then((res) => {
          setInfo(res.data.info);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const processPayment = async (pin: string) => {
    showNotification({
      id: "loading-payment-info",
      loading: true,
      title: "Wait a moment",
      message: "We are loading your payment info",
      autoClose: false,
      withCloseButton: false,
    });
    const decryptedCardInfo = decrypt(info, pin);
    if (!decryptedCardInfo) {
      updateNotification({
        id: "loading-payment-info",
        color: "red",
        title: "Error",
        message: "Wrong pin, please try again",
        icon: <IconAlertTriangle size={16} />,
        autoClose: 3000,
      });
      pinRef.current.forEach((input) => (input.value = ""));
      pinRef.current[0].focus();
      setPinCompleted(false);
      return false;
    } else {
      const cardInfo = JSON.parse(decryptedCardInfo);
      const decryptedPan = decrypt(cardInfo.encryptedPan, pin);
      const decryptedCvv = decrypt(cardInfo.encryptedCvv, pin);
      cardInfo.encryptedPan = decryptedPan;
      cardInfo.encryptedCvv = decryptedCvv;

      let clientToken;

      await userService
        .getPaymentTokenByUserId(user._id, user.accessToken)
        .then((res) => {
          clientToken = res.data.clientToken;
        })
        .catch((err) => {
          updateNotification({
            id: "loading-payment-info",
            color: "red",
            title: "Error",
            message: "Something went wrong",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
          return false;
        });

      if (!clientToken) {
        updateNotification({
          id: "loading-payment-info",
          color: "red",
          title: "Error",
          message: "Something went wrong, token is not found",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 3000,
        });
        return false;
      }

      var data = {
        creditCard: {
          number: cardInfo.encryptedPan,
          cvv: cardInfo.encryptedCvv,
          expirationDate: cardInfo.expirationDate,
          billingAddress: {
            postalCode: "12345",
          },
          options: {
            validate: false,
          },
        },
      };

      braintree.client.create(
        {
          authorization: clientToken,
        },
        async function (clientErr, clientInstance) {
          if (clientErr) {
            updateNotification({
              id: "loading-payment-info",
              color: "red",
              title: "Error",
              message: "Something went wrong, client error",
              icon: <IconAlertTriangle size={16} />,
              autoClose: 3000,
            });
            return false;
          }

          await clientInstance.request(
            {
              endpoint: "payment_methods/credit_cards",
              method: "post",
              data: data,
            },
            async function (requestErr: any, response: any) {
              if (requestErr) {
                updateNotification({
                  id: "loading-payment-info",
                  color: "red",
                  title: "Error",
                  message: "Something went wrong, request error",
                  icon: <IconAlertTriangle size={16} />,
                  autoClose: 3000,
                });
                return false;
              }

              const nonce = response.creditCards[0].nonce;

              const items = cart.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                };
              });

              const order = {
                user: user._id,
                items: items,
                total: getTotalPrice(),
              };

              await userService
                .processPayment(order, nonce, user.accessToken)
                .then((res) => {
                  updateNotification({
                    id: "loading-payment-info",
                    color: "teal",
                    title: "Success",
                    message: "Payment is successful",
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                  });
                })
                .catch((err) => {
                  updateNotification({
                    id: "loading-payment-info",
                    color: "red",
                    title: "Error",
                    message: "Something went wrong, payment error",
                    icon: <IconAlertTriangle size={16} />,
                    autoClose: 3000,
                  });
                  return false;
                });
            }
          );
        }
      );
      setPinCompleted(false);
      pinRef.current.forEach((input) => (input.value = ""));
      return true;
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <>
      <Modal
        opened={enterPinOpened}
        onClose={() => {
          pinForm.reset();
          setEnterPinOpened(false);
          setPinCompleted(false);
        }}
        size={500}
        zIndex={3000}
        withCloseButton={false}
      >
        <form
          onSubmit={pinForm.onSubmit(async (values) => {
            if (await processPayment(values.pin)) {
              setEnterPinOpened(false);
            }
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Title order={2} mb={20}>
              Enter Pin
            </Title>
            <Box>
              <PinField
                className={cn("pin-field", { complete: pinCompleted })}
                length={6}
                onChange={(value: string) => {
                  value.length !== 6 && setPinCompleted(false);
                }}
                onComplete={(value: string) => {
                  pinForm.setFieldValue("pin", value);
                  setPinCompleted(true);
                }}
                autoComplete="one-time-password"
                validate="0123456789"
                inputMode="numeric"
                type="password"
                autoFocus
                ref={pinRef}
              />
            </Box>
            <Button
              type="submit"
              color="teal"
              mt={10}
              size="md"
              disabled={!pinCompleted}
            >
              Pay Now
            </Button>
          </Box>
        </form>
      </Modal>
      <Flex
        direction={"column"}
        align={"center"}
        justify={"space-between"}
        h={"90vh"}
        w={400}
        m={"auto"}
        mt={20}
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
          <Button fullWidth mt={20} onClick={() => setEnterPinOpened(true)}>
            Pay Now
          </Button>
          <Button
            fullWidth
            mt={20}
            onClick={() => {
              navigate("/");
            }}
            color={"red"}
          >
            Cancel
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Checkout;

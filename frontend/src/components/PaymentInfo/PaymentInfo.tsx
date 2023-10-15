import CryptoJS from "crypto-js";
import Payment from "payment";
import { useEffect, useRef, useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  Box,
  Button,
  Text,
  Title,
  Image,
  Modal,
  createStyles,
  TextInput,
} from "@mantine/core";
import DATASECURITYIMAGE from "../../assets/data-security.png";
import CREDITCARDSIMAGE from "../../assets/CreditCard.png";
import { useForm } from "@mantine/form";
import PinField from "react-pin-field";
import cn from "classnames";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import "./PaymentInfo.css";
import { openConfirmModal } from "@mantine/modals";
import { AddCardInfo, CardInfo, UpdateCardInfo } from "../../models/payment";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import userService from "../../services/userService";
import { useAuthContext } from "../../hooks/useAuthContext";
const CreditCardInput = require("@anvilco/react-credit-card-input");

const keySize = 192;
const iterations = 10000;

export const encrypt = (data: any, ikey: any) => {
  const salt = CryptoJS.lib.WordArray.random(256 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(ikey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const encrypted = CryptoJS.TripleDES.encrypt(
    CryptoJS.enc.Utf8.parse(data),
    key,
    {
      iv: iv,
    }
  );

  return salt.toString() + iv.toString() + encrypted.toString();
};

export const decrypt = (data: any, ikey: any) => {
  const salt = CryptoJS.enc.Hex.parse(data.substr(0, 64));
  const iv = CryptoJS.enc.Hex.parse(data.substr(64, 32));
  const encrypted = data.substring(96);

  const key = CryptoJS.PBKDF2(ikey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  try {
    const decrypted = CryptoJS.TripleDES.decrypt(encrypted, key, {
      iv: iv,
    });

    if (decrypted.toString() === "") {
      return false;
    }

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return false;
  }
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: 24,
    margin: "50px auto",
    width: "90%",
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: "column-reverse",
      padding: 24,
    },
  },

  image: {
    maxWidth: "40%",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  body: {
    paddingRight: 24 * 4,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: 0,
      marginTop: 24,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: "flex",
    marginTop: 24,
  },
}));

const PaymentInfo: React.FC = () => {
  const [info, setInfo] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [infoDecrypted, setInfoDecrypted] = useState<CardInfo>({
    cardType: "",
    cardholderName: "",
    expirationDate: "",
    panLastFour: "",
    encryptedPan: "",
    encryptedCvv: "",
  });
  const { classes } = useStyles();
  const [createPinOpened, setCreatePinOpened] = useState(false);
  const [enterPinOpened, setEnterPinOpened] = useState(false);
  const [pinCompleted, setPinCompleted] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [updateCard, setUpdateCard] = useState(false);
  const [askForPinToAddCard, setAskForPinToAddCard] = useState(false);
  const [task, setTask] = useState("");
  const pinRef = useRef<HTMLInputElement[]>([]);
  const { user }: any = useAuthContext();

  const [addCardInfo, setAddCardInfo] = useState<AddCardInfo>({
    cvc: "",
    expiry: "",
    focus: "number",
    name: "",
    number: "",
  });

  const [updateCardInfo, setUpdateCardInfo] = useState<UpdateCardInfo>({
    cvc: "",
    expiry: "",
    focus: "number",
    name: "",
    number: "",
    type: "",
  });

  const handleCVCChange = (e: any) => {
    setAddCardInfo({
      ...addCardInfo,
      focus: "cvc",
      cvc: e.target.value,
    });
  };

  const handleCardNumberChange = (e: any) => {
    setAddCardInfo({
      ...addCardInfo,
      focus: "number",
      number: e.target.value,
    });
  };

  const handleCardNameChange = (e: any) => {
    setAddCardInfo({
      ...addCardInfo,
      focus: "name",
      name: e.target.value,
    });
  };

  const handleCardExpiryChange = (e: any) => {
    setAddCardInfo({
      ...addCardInfo,
      focus: "expiry",
      expiry: e.target.value,
    });
  };

  const handleCVCUpdate = (e: any) => {
    setUpdateCardInfo({
      ...updateCardInfo,
      focus: "cvc",
      cvc: e.target.value,
    });
  };

  const handleCardNumberUpdate = (e: any) => {
    setUpdateCardInfo({
      ...updateCardInfo,
      focus: "number",
      number: e.target.value,
    });
  };

  const handleCardNameUpdate = (e: any) => {
    setUpdateCardInfo({
      ...updateCardInfo,
      focus: "name",
      name: e.target.value,
    });
  };

  const handleCardExpiryUpdate = (e: any) => {
    setUpdateCardInfo({
      ...updateCardInfo,
      focus: "expiry",
      expiry: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-payment-info-data",
        loading: true,
        title: "Wait a moment",
        message: "We are loading your payment info",
        autoClose: false,
        withCloseButton: false,
      });
      await userService
        .getPaymentInfoByUserId(user._id, user.accessToken)
        .then((res) => {
          setInfo(res.data.info);
          updateNotification({
            id: "loding-payment-info-data",
            color: "teal",
            title: "Payment Info Loaded",
            message: "Your payment info has been loaded",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
        })
        .catch((err) => {
          updateNotification({
            id: "loding-payment-info-data",
            color: "red",
            title: "Error",
            message: "Something went wrong - " + err.message,
            icon: <IconAlertTriangle size={16} />,
            autoClose: 5000,
          });
        });
    };
    fetchData();
  }, []);

  const newPinForm = useForm({
    initialValues: {
      pin: "",
    },
  });

  const handleAddCard = (pin: string) => {
    const encryptedCardNumber = encrypt(addCardInfo.number, pin);
    const encryptedCVC = encrypt(addCardInfo.cvc, pin);
    const cardInfo: CardInfo = {
      cardType: Payment.fns.cardType(addCardInfo.number),
      cardholderName: addCardInfo.name,
      expirationDate: addCardInfo.expiry,
      panLastFour: addCardInfo.number.slice(-4),
      encryptedPan: encryptedCardNumber,
      encryptedCvv: encryptedCVC,
    };
    const cardInfoString = JSON.stringify(cardInfo);
    const encryptedCardInfo = encrypt(cardInfoString, pin);
    userService
      .updatePaymentInfo(user._id, user.accessToken, encryptedCardInfo)
      .then((res) => {
        setInfo(res.data.info);
        setInfoDecrypted(cardInfo);
        setIsDecrypted(true);
        setAddCardInfo({
          cvc: "",
          expiry: "",
          focus: "number",
          name: "",
          number: "",
        });
        setAddCard(false);
        updateNotification({
          id: "updating-card",
          color: "teal",
          title: "Card Updated",
          message: "Your card has been updated",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      })
      .catch((err) => {
        updateNotification({
          id: "updating-card",
          color: "red",
          title: "Error",
          message: "Something went wrong - " + err.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const handleUpdateCard = (pin: string) => {
    const encryptedCardNumber = encrypt(updateCardInfo.number, pin);
    const encryptedCVC = encrypt(updateCardInfo.cvc, pin);
    const cardInfo: CardInfo = {
      cardType: Payment.fns.cardType(updateCardInfo.number),
      cardholderName: updateCardInfo.name,
      expirationDate: updateCardInfo.expiry,
      panLastFour: updateCardInfo.number.slice(-4),
      encryptedPan: encryptedCardNumber,
      encryptedCvv: encryptedCVC,
    };
    const cardInfoString = JSON.stringify(cardInfo);
    const encryptedCardInfo = encrypt(cardInfoString, pin);
    userService
      .updatePaymentInfo(user._id, user.accessToken, encryptedCardInfo)
      .then((res) => {
        setInfo(res.data.info);
        setInfoDecrypted(cardInfo);
        setIsDecrypted(true);
        setUpdateCardInfo({
          cvc: "",
          expiry: "",
          focus: "number",
          name: "",
          number: "",
          type: "",
        });
        setUpdateCard(false);
        updateNotification({
          id: "adding-card",
          color: "teal",
          title: "Card Added",
          message: "Your card has been added",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      })
      .catch((err) => {
        updateNotification({
          id: "adding-card",
          color: "red",
          title: "Error",
          message: "Something went wrong - " + err.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const handleCreatePin = async (values: { pin: string }) => {
    const emptyCardInfo: CardInfo = {
      cardType: "",
      cardholderName: "",
      expirationDate: "",
      panLastFour: "",
      encryptedPan: "",
      encryptedCvv: "",
    };
    const cardInfoString = JSON.stringify(emptyCardInfo);
    const encryptedCardInfo = encrypt(cardInfoString, values.pin);
    await userService
      .updatePaymentInfo(user._id, user.accessToken, encryptedCardInfo)
      .then((res) => {
        setInfoDecrypted(emptyCardInfo);
        setIsDecrypted(true);
        updateNotification({
          id: "creating-pin",
          color: "teal",
          title: "Pin Created",
          message: "Your pin has been created",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setInfo(res.data.info);
        newPinForm.reset();
        setCreatePinOpened(false);
        setPinCompleted(false);
      })
      .catch((err) => {
        newPinForm.reset();
        setCreatePinOpened(false);
        setPinCompleted(false);
        updateNotification({
          id: "creating-pin",
          color: "red",
          title: "Error",
          message: "Something went wrong - " + err.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const handleDeleteCard = async (values: { pin: string }) => {
    const emptyCardInfo: CardInfo = {
      cardType: "",
      cardholderName: "",
      expirationDate: "",
      panLastFour: "",
      encryptedPan: "",
      encryptedCvv: "",
    };
    const cardInfoString = JSON.stringify(emptyCardInfo);
    const encryptedCardInfo = encrypt(cardInfoString, values.pin);
    await userService
      .updatePaymentInfo(user._id, user.accessToken, encryptedCardInfo)
      .then((res) => {
        setInfoDecrypted(emptyCardInfo);
        setIsDecrypted(true);
        updateNotification({
          id: "deleting-card",
          color: "teal",
          title: "Card Deleted",
          message: "Your card has been deleted",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setInfo(res.data.info);
        newPinForm.reset();
        setCreatePinOpened(false);
        setPinCompleted(false);
      })
      .catch((err) => {
        newPinForm.reset();
        setCreatePinOpened(false);
        setPinCompleted(false);
        updateNotification({
          id: "creating-pin",
          color: "red",
          title: "Error",
          message: "Something went wrong - " + err.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const handleDecrypt = (pin: string) => {
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
      setInfoDecrypted(cardInfo);
      setIsDecrypted(true);
      setPinCompleted(false);
      pinRef.current.forEach((input) => (input.value = ""));
      updateNotification({
        id: "loading-payment-info",
        color: "teal",
        title: "Payment Info Loaded",
        message: "Your payment info has been loaded",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      return true;
    }
  };

  //Open delete modal
  const openDeleteModal = () =>
    openConfirmModal({
      title: "Delete this card?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this card? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete Card", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The card was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        setTask("delete");
        setEnterPinOpened(true);
      },
    });

  return (
    <>
      <Modal
        opened={createPinOpened}
        onClose={() => {
          newPinForm.reset();
          setCreatePinOpened(false);
          setPinCompleted(false);
        }}
        size={500}
        zIndex={3000}
        withCloseButton={false}
      >
        <form
          onSubmit={newPinForm.onSubmit((values) => {
            handleCreatePin(values);
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
              Create Pin
            </Title>
            <Box>
              <PinField
                className={cn("pin-field", { complete: pinCompleted })}
                length={6}
                onChange={(value: string) => {
                  value.length !== 6 && setPinCompleted(false);
                }}
                onComplete={(value: string) => {
                  newPinForm.setFieldValue("pin", value);
                  setPinCompleted(true);
                }}
                autoComplete="one-time-password"
                validate="0123456789"
                inputMode="numeric"
                autoFocus
              />
            </Box>
            <Button
              type="submit"
              color="teal"
              mt={10}
              size="md"
              disabled={!pinCompleted}
            >
              Create Pin
            </Button>
          </Box>
        </form>
      </Modal>
      <Modal
        opened={enterPinOpened}
        onClose={() => {
          newPinForm.reset();
          setEnterPinOpened(false);
          setPinCompleted(false);
        }}
        size={500}
        zIndex={3000}
        withCloseButton={false}
      >
        <form
          onSubmit={newPinForm.onSubmit((values) => {
            if (task === "delete") {
              if (handleDecrypt(values.pin)) {
                handleDeleteCard(values);
                setEnterPinOpened(false);
              }
            } else if (task === "update") {
              if (handleDecrypt(values.pin)) {
                handleUpdateCard(values.pin);
                setEnterPinOpened(false);
              }
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
                  newPinForm.setFieldValue("pin", value);
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
              Continue
            </Button>
          </Box>
        </form>
      </Modal>
      {info && info === "Not Available" && (
        <Box className={classes.wrapper}>
          <Box className={classes.body}>
            <Title className={classes.title}>You are almost there!</Title>
            <Text weight={500} size="lg" mb={5}>
              You need to create a 6 digit pin first.
            </Text>
            <Text size="sm" color="dimmed">
              Your pin will be used to encrypt your payment info. You will need
              to enter your pin to view, edit or delete your payment info. We
              don't store your pin or a hashed version of it anywhere. So, if
              you forget your pin, you will have to reset your payment info and
              create a new pin. all your previous payment info will be deleted.
            </Text>
            <Box className={classes.controls}>
              <Button
                onClick={() => {
                  setCreatePinOpened(true);
                }}
              >
                Create Pin
              </Button>
            </Box>
          </Box>
          <Image src={DATASECURITYIMAGE} className={classes.image} />
        </Box>
      )}
      {!isDecrypted && info && info !== "Not Available" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title order={2} mb={20} mt={20}>
            Please enter your pin to continue
          </Title>
          <Box>
            <PinField
              className={cn("pin-field", { complete: pinCompleted })}
              length={6}
              onChange={(value: string) => {
                value.length !== 6 && setPinCompleted(false);
              }}
              onComplete={(value: string) => {
                setPinCompleted(true);
                handleDecrypt(value);
              }}
              autoComplete="one-time-password"
              validate="0123456789"
              inputMode="numeric"
              type="password"
              autoFocus
              ref={pinRef}
            />
          </Box>
        </Box>
      )}
      {askForPinToAddCard && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title order={2} mb={20} mt={20}>
            Please enter your pin to continue
          </Title>
          <Box>
            <PinField
              className={cn("pin-field", { complete: pinCompleted })}
              length={6}
              onChange={(value: string) => {
                value.length !== 6 && setPinCompleted(false);
              }}
              onComplete={(value: string) => {
                setPinCompleted(true);
                if (handleDecrypt(value)) {
                  setAskForPinToAddCard(false);
                  handleAddCard(value);
                }
              }}
              autoComplete="one-time-password"
              validate="0123456789"
              inputMode="numeric"
              type="password"
              autoFocus
              ref={pinRef}
            />
          </Box>
        </Box>
      )}
      {isDecrypted &&
        !addCard &&
        !askForPinToAddCard &&
        infoDecrypted &&
        infoDecrypted.cardholderName === "" && (
          <Box className={classes.wrapper}>
            <Box className={classes.body}>
              <Title className={classes.title}>
                No Credit/Dedit Card Added
              </Title>
              <Text weight={500} size="lg" mb={5}>
                You need to add a credit/debit card first.
              </Text>
              <Text size="sm" color="dimmed">
                Please add a credit/debit card to your account. You can add a
                credit/debit card by clicking on the "Add Card" button below.
              </Text>
              <Box className={classes.controls}>
                <Button
                  onClick={() => {
                    setAddCard(true);
                  }}
                >
                  Add Card
                </Button>
              </Box>
            </Box>
            <Image src={CREDITCARDSIMAGE} className={classes.image} />
          </Box>
        )}
      {addCard && !askForPinToAddCard && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box mt={20}>
            <Cards
              cvc={addCardInfo.cvc}
              expiry={addCardInfo.expiry.replace(/\s/g, "")}
              focused={addCardInfo.focus}
              name={addCardInfo.name}
              number={addCardInfo.number}
            />
          </Box>
          <Box
            sx={{
              width: "400px",
            }}
          >
            <TextInput
              placeholder="Name on Card"
              value={addCardInfo.name}
              onChange={(e) => {
                handleCardNameChange(e);
              }}
              mt={20}
              width="100%"
              error={
                addCardInfo.name !== "" &&
                !addCardInfo.name.match(/^[a-zA-Z]+ [a-zA-Z]+$/) &&
                "Please enter a valid name, e.g. John Doe"
              }
            />
          </Box>
          <Box
            mt={20}
            sx={{
              borderRadius: "5px",
              width: "400px",
            }}
          >
            <CreditCardInput
              cardNumberInputProps={{
                value: addCardInfo.number,
                onChange: handleCardNumberChange,
              }}
              cardExpiryInputProps={{
                value: addCardInfo.expiry,
                onChange: handleCardExpiryChange,
              }}
              cardCVCInputProps={{
                value: addCardInfo.cvc,
                onChange: handleCVCChange,
              }}
              fieldClassName="input"
              containerStyle={{
                width: "100%",
              }}
              fieldStyle={{
                border: "1px solid #eaeaea",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "400px",
            }}
          >
            <Button
              onClick={() => {
                setAskForPinToAddCard(true);
              }}
              mt={20}
              disabled={
                addCardInfo.number === "" ||
                addCardInfo.expiry === "" ||
                addCardInfo.cvc === "" ||
                addCardInfo.name === "" ||
                !addCardInfo.name.match(/^[a-zA-Z]+ [a-zA-Z]+$/) ||
                !Payment.fns.validateCardNumber(addCardInfo.number) ||
                !Payment.fns.validateCardExpiry(addCardInfo.expiry) ||
                !Payment.fns.validateCardCVC(addCardInfo.cvc)
              }
              sx={{
                width: "100%",
              }}
            >
              Add Card
            </Button>
          </Box>
        </Box>
      )}
      {updateCard && !askForPinToAddCard && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box mt={20}>
            <Cards
              issuer={updateCardInfo.type}
              cvc={updateCardInfo.cvc}
              expiry={updateCardInfo.expiry.replace(/\s/g, "")}
              focused={updateCardInfo.focus}
              name={updateCardInfo.name}
              number={updateCardInfo.number}
              preview={true}
            />
          </Box>
          <Box
            sx={{
              width: "400px",
            }}
          >
            <TextInput
              placeholder="Name on Card"
              value={updateCardInfo.name}
              onChange={(e) => {
                handleCardNameUpdate(e);
              }}
              mt={20}
              width="100%"
              error={
                updateCardInfo.name !== "" &&
                !updateCardInfo.name.match(/^[a-zA-Z]+ [a-zA-Z]+$/) &&
                "Please enter a valid name, e.g. John Doe"
              }
            />
          </Box>
          <Box
            mt={20}
            sx={{
              borderRadius: "5px",
              width: "400px",
            }}
          >
            <CreditCardInput
              cardNumberInputProps={{
                value: updateCardInfo.number,
                onChange: handleCardNumberUpdate,
              }}
              cardExpiryInputProps={{
                value: updateCardInfo.expiry,
                onChange: handleCardExpiryUpdate,
              }}
              cardCVCInputProps={{
                value: updateCardInfo.cvc,
                onChange: handleCVCUpdate,
              }}
              fieldClassName="input"
              containerStyle={{
                width: "100%",
              }}
              fieldStyle={{
                border: "1px solid #eaeaea",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "400px",
            }}
          >
            <Button
              onClick={() => {
                setTask("update");
                setEnterPinOpened(true);
              }}
              mt={20}
              disabled={
                updateCardInfo.number === "" ||
                updateCardInfo.expiry === "" ||
                updateCardInfo.cvc === "" ||
                updateCardInfo.name === "" ||
                !updateCardInfo.name.match(/^[a-zA-Z]+ [a-zA-Z]+$/) ||
                !Payment.fns.validateCardNumber(updateCardInfo.number) ||
                !Payment.fns.validateCardExpiry(updateCardInfo.expiry) ||
                !Payment.fns.validateCardCVC(updateCardInfo.cvc)
              }
              sx={{
                width: "100%",
              }}
            >
              Update Card
            </Button>
          </Box>
        </Box>
      )}
      {isDecrypted &&
        !updateCard &&
        !addCard &&
        !askForPinToAddCard &&
        infoDecrypted &&
        infoDecrypted.cardholderName !== "" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box mt={20}>
              <Cards
                issuer={"visa"}
                cvc={"***"}
                expiry={infoDecrypted.expirationDate.replace(/\s/g, "")}
                focused={addCardInfo.focus}
                name={infoDecrypted.cardholderName}
                number={
                  infoDecrypted.cardType === "amex"
                    ? "***********" + infoDecrypted.panLastFour
                    : "************" + infoDecrypted.panLastFour
                }
                preview={true}
              />
            </Box>
            <Box
              sx={{
                width: "400px",
              }}
            >
              <Button
                onClick={() => {
                  setUpdateCardInfo({
                    ...updateCardInfo,
                    name: infoDecrypted.cardholderName,
                    expiry: infoDecrypted.expirationDate,
                    type: infoDecrypted.cardType,
                  });
                  setUpdateCard(true);
                }}
                mt={20}
                sx={{
                  width: "100%",
                }}
              >
                Update Card
              </Button>
              <Button
                onClick={() => {
                  openDeleteModal();
                }}
                color="red"
                mt={20}
                sx={{
                  width: "100%",
                }}
              >
                Remove Card
              </Button>
            </Box>
          </Box>
        )}
    </>
  );
};

export default PaymentInfo;

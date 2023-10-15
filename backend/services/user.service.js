import PaymentInfo from "../models/paymentInfo.model.js";
import Payment from "../models/payment.model.js";

export const initializePaymentInfo = async (id) => {
  return await PaymentInfo.create({ userId: id })
    .then(async (data) => {
      await data.save();
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getPaymentInfoByUserId = async (id) => {
  return await PaymentInfo.findOne({ userId: id })
    .then((data) => {
      if (data) {
        return data;
      } else {
        return initializePaymentInfo(id);
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updatePaymentInfoByUserId = async (id, paymentInfoObj) => {
  return await PaymentInfo.findOneAndUpdate({ userId: id }, paymentInfoObj, {
    new: true,
  })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Payment Info not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const createPayment = async (paymentObj) => {
  return await Payment.create(paymentObj)
    .then(async (data) => {
      await data.save();
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

const userService = {
  createPayment,
  getPaymentInfoByUserId,
  updatePaymentInfoByUserId,
};

export default userService;

export interface PaymentData {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  paymentDateAndTime: string;
  paymentStatus: string;
}

export interface PaymentDataStudent {
  _id: string;
  batchId: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDateAndTime: string;
  paymentStatus: string;
}

export interface CardInfo {
  cardType: string;
  cardholderName: string;
  expirationDate: string;
  panLastFour: string;
  encryptedPan: string;
  encryptedCvv: string;
}

export interface AddCardInfo {
  cvc: string;
  expiry: string;
  focus: "name" | "number" | "expiry" | "cvc";
  name: string;
  number: string;
}

export interface UpdateCardInfo {
  cvc: string;
  expiry: string;
  focus: "name" | "number" | "expiry" | "cvc";
  name: string;
  number: string;
  type: string;
}

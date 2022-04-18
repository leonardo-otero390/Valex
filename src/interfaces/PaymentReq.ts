export interface PaymentReq {
  cardNumber: string;
  businessId: number;
  amount: number;
  password: string;
}

export interface OnlinePaymentReq {
  cardNumber: string;
  businessId: number;
  amount: number;
  cvc: string;
  expirationDate: string;
  name: string;
}

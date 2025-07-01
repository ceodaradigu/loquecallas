export interface Plan {
  type: 'basica' | 'premium';
  name: string;
  price: number;
  words: string;
}

export interface LetterFormData {
  paraQuien: string;
  ocasion: string;
  relacion: string;
  emociones: string[];
  detalles: string;
  tono: string;
  tuNombre: string;
  email: string;
  planElegido: string;
}

export interface GoogleFormMapping {
  [key: string]: string;
}

export interface PaymentData {
  paymentIntentId: string;
  amount: number;
  status: string;
  customerEmail: string;
}

export interface StripeConfig {
  publicKey: string;
  apiUrl: string;
}
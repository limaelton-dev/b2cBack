export const CIELO_PAYMENT_METHODS = [
  {
    id: 'visa',
    name: 'Visa',
    type: 'credit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/visa.png',
    installments: true,
    maxInstallments: 12
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'credit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/mastercard.png',
    installments: true,
    maxInstallments: 12
  },
  {
    id: 'elo',
    name: 'Elo',
    type: 'credit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/elo.png',
    installments: true,
    maxInstallments: 10
  },
  {
    id: 'amex',
    name: 'American Express',
    type: 'credit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/amex.png',
    installments: true,
    maxInstallments: 10
  },
  {
    id: 'hipercard',
    name: 'Hipercard',
    type: 'credit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/hipercard.png',
    installments: true,
    maxInstallments: 6
  },
  {
    id: 'visa_debit',
    name: 'Visa Débito',
    type: 'debit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/visa.png',
    installments: false
  },
  {
    id: 'mastercard_debit',
    name: 'Mastercard Débito',
    type: 'debit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/mastercard.png',
    installments: false
  },
  {
    id: 'elo_debit',
    name: 'Elo Débito',
    type: 'debit_card',
    logo: 'https://www.cielo.com.br/assets/images/logos/elo.png',
    installments: false
  },
  {
    id: 'pix',
    name: 'PIX',
    type: 'pix',
    logo: 'https://www.cielo.com.br/assets/images/logos/pix.png',
    installments: false
  }
]; 
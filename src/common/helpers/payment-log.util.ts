const SENSITIVE_FIELDS = new Set([
  'token',
  'cardtoken',
  'cardnumber',
  'securitycode',
  'cvv',
  'cvc',
  'password',
  'senha',
  'cpf',
  'cnpj',
  'documentnumber',
  'merchantkey',
  'accesstoken',
  'access_token',
  'authorization',
  'holder',
  'expirationdate',
  'email',
]);

const PARTIAL_MASK_FIELDS = new Set(['email', 'holder']);

function maskValue(key: string, value: string): string {
  const lowerKey = key.toLowerCase();

  if (PARTIAL_MASK_FIELDS.has(lowerKey)) {
    if (lowerKey === 'email' && value.includes('@')) {
      const [local, domain] = value.split('@');
      const maskedLocal = local.length > 2 
        ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
        : '*'.repeat(local.length);
      return `${maskedLocal}@${domain}`;
    }
    if (lowerKey === 'holder' && value.length > 4) {
      return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
  }

  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }
  return '*'.repeat(value.length - 4) + value.slice(-4);
}

function isSensitiveField(key: string): boolean {
  return SENSITIVE_FIELDS.has(key.toLowerCase());
}

export function redact<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redact(item)) as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        result[key] = value;
      } else if (isSensitiveField(key) && typeof value === 'string') {
        result[key] = maskValue(key, value);
      } else if (typeof value === 'object') {
        result[key] = redact(value);
      } else {
        result[key] = value;
      }
    }

    return result as T;
  }

  return obj;
}

export function safeStringify(obj: unknown): string {
  return JSON.stringify(redact(obj));
}

export interface PaymentLogContext {
  orderId?: number;
  profileId?: number;
  gateway: string;
  method: string;
  amount: number;
}

export function buildPaymentLogMessage(context: PaymentLogContext, action: string): string {
  return `[${context.gateway}] ${action} | Order: ${context.orderId ?? 'N/A'} | Amount: ${context.amount}`;
}

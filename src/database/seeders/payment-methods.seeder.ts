import { DataSource } from 'typeorm';
import { PaymentMethod } from '../../modules/payments/entities/payment-method.entity';

export class PaymentMethodsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const paymentMethodRepository = this.dataSource.getRepository(PaymentMethod);
    
    // Verificar se já existem métodos de pagamento no banco
    const count = await paymentMethodRepository.count();
    if (count > 0) {
      console.log('Métodos de pagamento já existem no banco. Pulando seed.');
      return;
    }
    
    // Criar métodos de pagamento padrão
    const paymentMethods = [
      { name: 'credit_card' },
      { name: 'debit_card' },
      { name: 'pix' },
      { name: 'boleto' },
      { name: 'bank_transfer' },
    ];
    
    await paymentMethodRepository.save(paymentMethods);
    console.log('Métodos de pagamento criados com sucesso.');
  }
} 
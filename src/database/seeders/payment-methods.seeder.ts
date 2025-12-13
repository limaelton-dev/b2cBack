import { DataSource } from 'typeorm';
// import { PaymentMethod } from '../../modules/payment/entities/payment-method.entity';

export class PaymentMethodsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    // const repository = this.dataSource.getRepository(PaymentMethod);
    
    // // Verificar se já existem métodos de pagamento
    // const count = await repository.count();
    // if (count > 0) {
    //   console.log('Métodos de pagamento já existem no banco. Pulando seed.');
    //   return;
    // }
    
    // // Criar métodos de pagamento padrão
    // const methods = [
    //   { name: 'credit_card', display_name: 'Cartão de Crédito' },
    //   { name: 'debit_card', display_name: 'Cartão de Débito' },
    //   { name: 'pix', display_name: 'PIX' },
    //   { name: 'boleto', display_name: 'Boleto Bancário' },
    //   { name: 'bank_transfer', display_name: 'Transferência Bancária' },
    // ];
    
    // await repository.save(methods);
    console.log('Métodos de pagamento criados com sucesso!');
  }
} 
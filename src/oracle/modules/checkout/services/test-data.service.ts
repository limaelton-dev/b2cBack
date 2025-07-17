import { Injectable } from '@nestjs/common';
import { CreatePropostaDto } from '../dto/create.proposta.dto';

@Injectable()
export class TestDataService {
    
    static getExampleProposta(codigo?: number): CreatePropostaDto {
        const now = new Date().toISOString().split('.')[0] + 'Z'; // Remove milissegundos para Oracle
        const codigoProposta = codigo || 15;
        
        return {
            prpCodigo: codigoProposta,
            ratCodigo: 2,
            cliCodigo: 12345,
            oriCodigo: 1,
            traCodigo: 1,
            cpgCodigo: 1,
            ptpCodigo: 1,
            prpSituacao: "PE",
            prpNome: "João Silva Santos",
            prpEndereco: "Rua das Flores, 123, Apt 45",
            prpBairro: "Centro",
            prpCidade: "São Paulo",
            prpUf: "SP",
            prpCep: "01234567",
            prpFone: "11987654321",
            prpEmail: "joao.silva@email.com",
            prpVendedorInterno: 100,
            prpVendedorExterno: 200,
            prpDataEmissao: now,
            prpObservacaoNota: "Entrega urgente",
            prpDataEntrega: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z', // +5 dias
            prpValorFrete: 25.50,
            prpFretePago: "S",
            prpValorTotal: 1500.00,
            prpValorTotalDesconto: 150.00,
            prpFormaConfirmacao: "E",
            prpTipoFaturamento: "F",
            prpTipoEntrega: "E",
            prpShipDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z', // +3 dias
            prpIncluidaData: now,
            prpIncluidoPor: "B2C",
            prpAlteradaData: now,
            prpAlteradaPor: "B2C",
            prpTriangulacao: 3
        };
    }

    static getMinimalProposta(codigo?: number): CreatePropostaDto {
        const now = new Date().toISOString().split('.')[0] + 'Z'; // Remove milissegundos para Oracle
        const codigoProposta = codigo || 9570;
        
        return {
            prpCodigo: codigoProposta,
            ratCodigo: 2,
            cliCodigo: 12345,
            oriCodigo: 1,
            traCodigo: 1,
            cpgCodigo: 1,
            ptpCodigo: 1,
            prpSituacao: "PE",
            prpNome: "Cliente Teste",
            prpEndereco: "Rua Teste, 123",
            prpBairro: "Centro",
            prpCidade: "São Paulo",
            prpUf: "SP",
            prpCep: "01234567",
            prpFone: "11999999999",
            prpEmail: "teste@email.com",
            prpVendedorInterno: 1,
            prpVendedorExterno: 1,
            prpDataEmissao: now,
            prpObservacaoNota: "Teste",
            prpDataEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z',
            prpValorFrete: 10.00,
            prpFretePago: "N",
            prpValorTotal: 100.00,
            prpValorTotalDesconto: 0.00,
            prpFormaConfirmacao: "V",
            prpTipoFaturamento: "V",
            prpTipoEntrega: "R",
            prpShipDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z',
            prpIncluidaData: now,
            prpIncluidoPor: "B2C",
            prpAlteradaData: now,
            prpAlteradaPor: "B2C",
            prpTriangulacao: 0
        };
    }

    static getValidationTestCases() {
        return {
            invalidSituacao: {
                ...this.getMinimalProposta(9570),
                prpSituacao: "INVALID" // Deve falhar - valores permitidos: 'CA', 'FT', 'OK', 'PE', 'PK', 'PN', 'PR'
            },
            invalidCEP: {
                ...this.getMinimalProposta(9570),
                prpCep: "1234567" // Deve falhar - deve ter 8 dígitos
            },
            invalidEmail: {
                ...this.getMinimalProposta(9570),
                prpEmail: "email-invalido" // Deve falhar - email inválido
            },
            invalidUF: {
                ...this.getMinimalProposta(9570),
                prpUf: "SAO" // Deve falhar - deve ter 2 caracteres
            },
            invalidFretePago: {
                ...this.getMinimalProposta(9570),
                prpFretePago: "X" // Deve falhar - valores permitidos: 'S' ou 'N'
            }
        };
    }
} 
import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    Param, 
    HttpStatus, 
    HttpException,
    Logger,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { CheckoutOracleService } from '../services/checkout.oracle.service';
import { CreatePropostaDto } from '../dto/create.proposta.dto';
import { CreatePropostaProcedureDto } from '../dto/create-proposta-procedure.dto';
import { CreateHeaderPropostaDto } from '../dto/create.header.proposta.dto';
import { CreatePropostaItemDto } from '../dto/create.proposta.item.dto';
import { CalculateFeesDto } from '../dto/calculate-fees.dto';
import { CalculateNatCodigoDto } from '../dto/calculate.nat.codigo';
import { CreateCabecalhoPropostaDto } from '../dto/create.cabecalho.proposta.dto';

@Controller('oracle/checkout')
export class CheckoutOracleController {
    private readonly logger = new Logger(CheckoutOracleController.name);

    constructor(
        private readonly checkoutOracleService: CheckoutOracleService,
    ) {}

    @Post('proposta')
    @UsePipes(new ValidationPipe({ 
        transform: true, 
        whitelist: false, 
        forbidNonWhitelisted: false,
        validateCustomDecorators: true 
    }))
    async criarProposta(
        @Body() createCabecalhoPropostaDto: CreateCabecalhoPropostaDto
    ) {
        try {
            this.logger.log('Criando proposta');

            const result = await this.checkoutOracleService.criarProposta(createCabecalhoPropostaDto);
            
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Proposta criado com sucesso',
                data: result
            };
        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    error: 'Internal Server Error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('propostas')
    async buscarTodasPropostas() {
        try {
            this.logger.log('Buscando todas as propostas');
            const result = await this.checkoutOracleService.buscarTodasPropostas();
            
            return {
                statusCode: HttpStatus.OK,
                message: 'Propostas recuperadas com sucesso',
                data: result
            };
        } catch (error) {
            this.logger.error(`Erro ao buscar propostas: ${error.message}`);
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    error: 'Internal Server Error'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // @Post('proposta/item')
    // @UsePipes(new ValidationPipe({ transform: true }))
    // async createPropostaItem(
    //     @Body() createPropostaItemDto: CreatePropostaItemDto
    // ) {
    //     try {
    //         this.logger.log('Criando item da proposta');
    //         const result = await this.checkoutOracleService.createPropostaItem(createPropostaItemDto);
            
    //         return {
    //             statusCode: HttpStatus.CREATED,
    //             message: 'Item da proposta criado com sucesso',
    //             data: result
    //         };
    //     } catch (error) {
    //         this.logger.error(`Erro ao criar item da proposta: ${error.message}`);
    //         throw new HttpException(
    //             {
    //                 statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //                 message: error.message,
    //                 error: 'Internal Server Error'
    //             },
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    @Post('proposta/item/calculate-fees')
    @UsePipes(new ValidationPipe({ transform: true }))
    async calculateFees(
        @Body() calculateFeesDto: CalculateFeesDto
    ) {
        const result = await this.checkoutOracleService.calcularTarifas(calculateFeesDto);

        return {
            statusCode: HttpStatus.OK,
            message: 'Tarifas calculadas com sucesso',
            data: result
        };
    }

    @Post('proposta/item/calculate-operation-nature')
    @UsePipes(new ValidationPipe({ transform: true }))
    async calculateOperationNature(
        @Body() calculateNatCodigoDto: CalculateNatCodigoDto
    ) {
        this.logger.log('Calculando natureza de operação');
        const result = await this.checkoutOracleService.calcularNaturezaOperacao(calculateNatCodigoDto);

        return {
            statusCode: HttpStatus.OK,
            message: 'Natureza de operação calculada com sucesso',
            data: result
        };
    }
} 
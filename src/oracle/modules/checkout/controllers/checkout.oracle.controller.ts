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

@Controller('oracle/checkout')
export class CheckoutOracleController {
    private readonly logger = new Logger(CheckoutOracleController.name);

    constructor(
        private readonly checkoutOracleService: CheckoutOracleService,
    ) {}

    @Post('proposta/procedure')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createPropostaViaProcedure(
        @Body() createHeaderPropostaDto: CreateHeaderPropostaDto
    ) {
        try {
            this.logger.log('Criando proposta via stored procedure');
            const result = await this.checkoutOracleService.createPropostaViaProcedure(createHeaderPropostaDto);
            
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Proposta criada com sucesso via stored procedure',
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
    async getAllPropostas() {
        try {
            this.logger.log('Buscando todas as propostas');
            const result = await this.checkoutOracleService.getAllPropostas();
            
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

} 
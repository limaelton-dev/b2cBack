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

@Controller('oracle/checkout2')
export class Checkout2OracleController {
    private readonly logger = new Logger(Checkout2OracleController.name);

    constructor(
        private readonly checkoutOracleService: CheckoutOracleService,
    ) {}

    @Post('proposta')
    @UsePipes(new ValidationPipe({ 
        whitelist: true, 
        forbidNonWhitelisted: true,
        transform: true 
    }))
    async createProposta(@Body() createPropostaDto: CreatePropostaDto) {
        try {
            this.logger.log(`Recebida requisição para criar proposta: ${createPropostaDto.prpCodigo}`);
            
            const result = await this.checkoutOracleService.createProposta(createPropostaDto);
            
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Proposta criada com sucesso',
                data: result
            };
        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`, error.stack);
            
            if (error.message.includes('já existe')) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: error.message,
                        error: 'Conflict'
                    },
                    HttpStatus.CONFLICT
                );
            }
            
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                    error: 'Bad Request'
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('proposta/:codigo')
    async getProposta(@Param('codigo') codigo: number) {
        try {
            this.logger.log(`Recebida requisição para buscar proposta: ${codigo}`);
            
            const proposta = await this.checkoutOracleService.getProposta(codigo);
            
            if (!proposta) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: `Proposta com código ${codigo} não encontrada`,
                        error: 'Not Found'
                    },
                    HttpStatus.NOT_FOUND
                );
            }
            
            return {
                statusCode: HttpStatus.OK,
                message: 'Proposta encontrada',
                data: proposta
            };
        } catch (error) {
            this.logger.error(`Erro ao buscar proposta: ${error.message}`, error.stack);
            
            if (error instanceof HttpException) {
                throw error;
            }
            
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
            this.logger.log('Recebida requisição para listar todas as propostas');
            
            const propostas = await this.checkoutOracleService.getAllPropostas();
            
            return {
                statusCode: HttpStatus.OK,
                message: `${propostas.length} proposta(s) encontrada(s)`,
                data: propostas,
                total: propostas.length
            };
        } catch (error) {
            this.logger.error(`Erro ao buscar propostas: ${error.message}`, error.stack);
            
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

    @Get('proposta-example')
    async getPropostaExample() {
        const { TestDataService } = await import('../services/test-data.service');
        
        return {
            statusCode: HttpStatus.OK,
            message: 'Exemplos de DTOs válidos para criar proposta',
            data: {
                completo: TestDataService.getExampleProposta(),
                minimal: TestDataService.getMinimalProposta(),
                comCodigoCustom: TestDataService.getExampleProposta(9570)
            }
        };
    }

    @Get('test-validation')
    async getValidationTests() {
        const { TestDataService } = await import('../services/test-data.service');
        
        return {
            statusCode: HttpStatus.OK,
            message: 'Casos de teste para validação (estes devem falhar)',
            data: TestDataService.getValidationTestCases()
        };
    }

    @Post('test/create-example')
    async createExampleProposta() {
        try {
            const { TestDataService } = await import('../services/test-data.service');
            const exampleData = TestDataService.getExampleProposta();
            
            const result = await this.checkoutOracleService.createProposta(exampleData);
            
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Proposta de exemplo criada com sucesso',
                data: result,
                usedData: exampleData
            };
        } catch (error) {
            this.logger.error(`Erro ao criar proposta de exemplo: ${error.message}`, error.stack);
            
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                    error: 'Bad Request'
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('test/create-minimal')
    async createMinimalProposta() {
        try {
            const { TestDataService } = await import('../services/test-data.service');
            const minimalData = TestDataService.getMinimalProposta();
            
            const result = await this.checkoutOracleService.createProposta(minimalData);
            
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Proposta mínima criada com sucesso',
                data: result,
                usedData: minimalData
            };
        } catch (error) {
            this.logger.error(`Erro ao criar proposta mínima: ${error.message}`, error.stack);
            
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                    error: 'Bad Request'
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
} 
import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart/cart';
import { CartDataDto, UpdateCartDto } from './dto/updateCart.dto'
import { User } from 'src/models/user/user';

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);

    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getCarrinhoUser(id: number): Promise<CartDataDto> {
        this.logger.log(`Buscando carrinho para o usuário ID: ${id}`);
        
        try {
            const cart = await this.cartRepository.findOne({ where: { user: { id: id } } });
            
            if(cart) {
                this.logger.log(`Carrinho encontrado: ${JSON.stringify(cart.cart_data)}`);
                
                // Verificar se cart_data é um array válido
                if (cart.cart_data && Array.isArray(cart.cart_data)) {
                    return { cart_data: cart.cart_data };
                } else if (cart.cart_data && typeof cart.cart_data === 'object') {
                    // Se cart_data for um objeto, verificar se tem a propriedade cart_data
                    if (cart.cart_data.cart_data && Array.isArray(cart.cart_data.cart_data)) {
                        return { cart_data: cart.cart_data.cart_data };
                    } else {
                        // Tentar converter o objeto em um array
                        this.logger.log(`Convertendo objeto cart_data em array`);
                        return { cart_data: [cart.cart_data] };
                    }
                } else if (typeof cart.cart_data === 'string') {
                    // Tentar parsear string JSON
                    try {
                        const parsedData = JSON.parse(cart.cart_data);
                        if (Array.isArray(parsedData)) {
                            return { cart_data: parsedData };
                        } else if (parsedData.cart_data && Array.isArray(parsedData.cart_data)) {
                            return { cart_data: parsedData.cart_data };
                        } else {
                            return { cart_data: [parsedData] };
                        }
                    } catch (e) {
                        this.logger.error(`Erro ao parsear dados do carrinho: ${e.message}`);
                        return { cart_data: [] };
                    }
                } else {
                    this.logger.warn(`Formato de cart_data não reconhecido: ${typeof cart.cart_data}`);
                    return { cart_data: [] };
                }
            } else {
                this.logger.log(`Nenhum carrinho encontrado para o usuário ID: ${id}`);
                return { cart_data: [] };
            }
        } catch (error) {
            this.logger.error(`Erro ao buscar carrinho: ${error.message}`, error.stack);
            return { cart_data: [] };
        }
    }

    async updateCarrinhoUser(id: number, updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        this.logger.log(`Atualizando carrinho para o usuário ID: ${id}`);
        this.logger.log(`Dados para atualização: ${JSON.stringify(updateCartDto)}`);
        
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('Usuário não encontrado.');
    
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });
        
        if (!cart) {
            this.logger.log(`Criando novo carrinho para o usuário ID: ${id}`);
            const cartCreate = this.cartRepository.create({
                user,
                cart_data: updateCartDto.cart_data,
            });
            const response = await this.cartRepository.save(cartCreate);
            if (response) {
                this.logger.log(`Carrinho criado com sucesso`);
                return { cart_data: response.cart_data };
            } else {
                this.logger.error(`Erro ao adicionar carrinho`);
                throw new InternalServerErrorException('Erro ao adicionar carrinho');
            }
        }
    
        this.logger.log(`Atualizando carrinho existente ID: ${cart.id}`);
        await this.cartRepository.update(cart.id, { cart_data: updateCartDto.cart_data });
        this.logger.log(`Carrinho atualizado com sucesso`);
        return { cart_data: updateCartDto.cart_data };
    }
}

import { Injectable, InternalServerErrorException, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart/cart';
import { CartDataDto, UpdateCartDto, CartItemDto } from './dto/updateCart.dto';
import { User } from 'src/models/user/user';
import { Produto } from 'src/models/produto/produto';
import { Profile } from 'src/models/profile/profile';
import { ProfileService } from '../profile/profile.service';
import { In } from 'typeorm';

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);

    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        
        @InjectRepository(User)
        private userRepository: Repository<User>,
        
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        
        private profileService: ProfileService,
    ) {}

    async getProfileCart(profileId: number): Promise<CartDataDto> {
        this.logger.log(`Buscando carrinho para o perfil ID: ${profileId}`);
        
        try {
            const cart = await this.cartRepository.findOne({ where: { profile: { id: profileId } } });
            
            if(cart) {
                this.logger.log(`Carrinho encontrado: ${JSON.stringify(cart.cart_data)}`);
                
                // Verificar se cart_data é um array válido
                if (cart.cart_data && Array.isArray(cart.cart_data)) {
                    return { cart_data: this.normalizeCartItems(cart.cart_data) };
                } else if (cart.cart_data && typeof cart.cart_data === 'object') {
                    // Se cart_data for um objeto, verificar se tem a propriedade cart_data
                    if (cart.cart_data.cart_data && Array.isArray(cart.cart_data.cart_data)) {
                        return { cart_data: this.normalizeCartItems(cart.cart_data.cart_data) };
                    } else {
                        // Tentar converter o objeto em um array
                        this.logger.log(`Convertendo objeto cart_data em array`);
                        return { cart_data: this.normalizeCartItems([cart.cart_data]) };
                    }
                } else if (typeof cart.cart_data === 'string') {
                    // Tentar parsear string JSON
                    try {
                        const parsedData = JSON.parse(cart.cart_data);
                        if (Array.isArray(parsedData)) {
                            return { cart_data: this.normalizeCartItems(parsedData) };
                        } else if (parsedData.cart_data && Array.isArray(parsedData.cart_data)) {
                            return { cart_data: this.normalizeCartItems(parsedData.cart_data) };
                        } else {
                            return { cart_data: this.normalizeCartItems([parsedData]) };
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
                this.logger.log(`Nenhum carrinho encontrado para o perfil ID: ${profileId}`);
                return { cart_data: [] };
            }
        } catch (error) {
            this.logger.error(`Erro ao buscar carrinho: ${error.message}`, error.stack);
            return { cart_data: [] };
        }
    }

    async getUserCart(userId: number): Promise<CartDataDto> {
        try {
            // Buscar o perfil do usuário
            const profile = await this.profileService.findByUserId(userId);
            return this.getProfileCart(profile.id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn(`Nenhum perfil encontrado para o usuário ID: ${userId}`);
                return { cart_data: [] };
            }
            this.logger.error(`Erro ao buscar carrinho do usuário: ${error.message}`, error.stack);
            return { cart_data: [] };
        }
    }

    async updateProfileCart(profileId: number, updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        this.logger.log(`Atualizando carrinho para o perfil ID: ${profileId}`);
        this.logger.log(`Dados para atualização: ${JSON.stringify(updateCartDto)}`);
        
        const profile = await this.profileRepository.findOneBy({ id: profileId });
        if (!profile) throw new NotFoundException('Perfil não encontrado.');
    
        const cart = await this.cartRepository.findOne({ where: { profile: { id: profile.id } } });
        
        // Normalizar os itens do carrinho antes de salvar
        const normalizedCartItems = updateCartDto.cart_data ? 
            this.normalizeCartItems(updateCartDto.cart_data) : [];
        
        if (!cart) {
            this.logger.log(`Criando novo carrinho para o perfil ID: ${profileId}`);
            const cartCreate = this.cartRepository.create({
                profile,
                cart_data: normalizedCartItems,
            });
            const response = await this.cartRepository.save(cartCreate);
            if (response) {
                this.logger.log(`Carrinho criado com sucesso`);
                return { cart_data: normalizedCartItems };
            } else {
                this.logger.error(`Erro ao adicionar carrinho`);
                throw new InternalServerErrorException('Erro ao adicionar carrinho');
            }
        }
    
        this.logger.log(`Atualizando carrinho existente ID: ${cart.id}`);
        await this.cartRepository.update(cart.id, { cart_data: normalizedCartItems });
        this.logger.log(`Carrinho atualizado com sucesso`);
        return { cart_data: normalizedCartItems };
    }

    async updateUserCart(userId: number, updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        try {
            this.logger.log(`Atualizando carrinho do usuário ID: ${userId}`);
            this.logger.log(`Dados para atualização: ${JSON.stringify(updateCartDto)}`);
            
            // Validar se todos os produtos existem
            if (updateCartDto.cart_data && updateCartDto.cart_data.length > 0) {
                const produtoIds = updateCartDto.cart_data.map(item => Number(item.produto_id));
                this.logger.log(`IDs de produtos para validação: ${JSON.stringify(produtoIds)}`);
                
                const produtos = await this.produtoRepository.find({
                    where: { id: In(produtoIds) }
                });
                
                this.logger.log(`Produtos encontrados: ${produtos.length}`);
                
                // Verificar se todos os produtos foram encontrados
                if (produtos.length !== produtoIds.length) {
                    const encontradosIds = produtos.map(p => Number(p.id));
                    const naoEncontradosIds = produtoIds.filter(id => !encontradosIds.includes(id));
                    
                    if (naoEncontradosIds.length > 0) {
                        throw new BadRequestException(`Produtos não encontrados: ${naoEncontradosIds.join(', ')}`);
                    }
                }
                
                // Verificar se os produtos estão ativos
                const produtosInativos = produtos.filter(p => !p.pro_ativo);
                if (produtosInativos.length > 0) {
                    const inativosIds = produtosInativos.map(p => p.id);
                    throw new BadRequestException(`Produtos inativos não podem ser adicionados ao carrinho: ${inativosIds.join(', ')}`);
                }
                
                // Atualizar os preços dos produtos com os valores atuais do banco
                updateCartDto.cart_data = updateCartDto.cart_data.map(item => {
                    const produto = produtos.find(p => Number(p.id) === Number(item.produto_id));
                    return {
                        ...item,
                        price: produto.pro_precovenda,
                        product: {
                            id: produto.id,
                            pro_codigo: produto.pro_codigo,
                            pro_descricao: produto.pro_descricao,
                            pro_precovenda: produto.pro_precovenda,
                            pro_ativo: produto.pro_ativo
                        }
                    };
                });
            }
            
            // Buscar o perfil do usuário
            const profile = await this.profileService.findByUserId(userId);
            return this.updateProfileCart(profile.id, updateCartDto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.error(`Nenhum perfil encontrado para o usuário ID: ${userId}`);
                throw new NotFoundException(`Usuário com ID ${userId} não possui um perfil. Crie um perfil antes de atualizar o carrinho.`);
            }
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Erro ao atualizar carrinho: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Erro ao atualizar carrinho');
        }
    }

    /**
     * Adiciona um item ao carrinho do usuário
     */
    async addItemToCart(userId: number, item: CartItemDto): Promise<CartDataDto> {
        this.logger.log(`Adicionando item ao carrinho do usuário ID: ${userId}`);
        
        // Verificar se o produto existe
        const produto = await this.produtoRepository.findOne({ 
            where: { id: Number(item.produto_id) } 
        });
        
        if (!produto) {
            throw new BadRequestException(`Produto com ID ${item.produto_id} não encontrado`);
        }
        
        // Obter o carrinho atual
        const currentCart = await this.getUserCart(userId);
        
        // Verificar se o produto já está no carrinho
        const existingItemIndex = currentCart.cart_data.findIndex(
            cartItem => Number(cartItem.produto_id) === Number(item.produto_id)
        );
        
        if (existingItemIndex >= 0) {
            // Atualizar a quantidade se o produto já estiver no carrinho
            currentCart.cart_data[existingItemIndex].quantity += Number(item.quantity);
        } else {
            // Adicionar o novo item ao carrinho
            const newItem: CartItemDto = {
                produto_id: Number(item.produto_id),
                quantity: Number(item.quantity),
                price: Number(item.price || produto.pro_precovenda),
                product: {
                    id: produto.id,
                    pro_codigo: produto.pro_codigo,
                    pro_descricao: produto.pro_descricao,
                    pro_precovenda: produto.pro_precovenda,
                    pro_ativo: produto.pro_ativo
                }
            };
            
            currentCart.cart_data.push(newItem);
        }
        
        // Atualizar o carrinho
        return this.updateUserCart(userId, currentCart);
    }

    /**
     * Remove um item do carrinho do usuário
     */
    async removeItemFromCart(userId: number, produtoId: number): Promise<CartDataDto> {
        this.logger.log(`Removendo item do carrinho do usuário ID: ${userId}`);
        
        // Obter o carrinho atual
        const currentCart = await this.getUserCart(userId);
        
        // Filtrar o item a ser removido
        currentCart.cart_data = currentCart.cart_data.filter(
            item => Number(item.produto_id) !== Number(produtoId)
        );
        
        // Atualizar o carrinho
        return this.updateUserCart(userId, currentCart);
    }

    /**
     * Atualiza a quantidade de um item no carrinho
     */
    async updateItemQuantity(userId: number, produtoId: number, quantity: number): Promise<CartDataDto> {
        this.logger.log(`Atualizando quantidade do item no carrinho do usuário ID: ${userId}`);
        
        if (quantity < 1) {
            return this.removeItemFromCart(userId, produtoId);
        }
        
        // Obter o carrinho atual
        const currentCart = await this.getUserCart(userId);
        
        // Encontrar o item
        const itemIndex = currentCart.cart_data.findIndex(
            item => Number(item.produto_id) === Number(produtoId)
        );
        
        if (itemIndex === -1) {
            throw new BadRequestException(`Item com produto ID ${produtoId} não encontrado no carrinho`);
        }
        
        // Atualizar a quantidade
        currentCart.cart_data[itemIndex].quantity = Number(quantity);
        
        // Atualizar o carrinho
        return this.updateUserCart(userId, currentCart);
    }

    /**
     * Limpa o carrinho do usuário
     */
    async clearCart(userId: number): Promise<CartDataDto> {
        this.logger.log(`Limpando carrinho do usuário ID: ${userId}`);
        
        return this.updateUserCart(userId, { cart_data: [] });
    }

    /**
     * Calcula o valor total do carrinho
     */
    async getCartTotal(userId: number): Promise<number> {
        const cart = await this.getUserCart(userId);
        
        return cart.cart_data.reduce((total, item) => {
            const price = item.price || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    /**
     * Normaliza os itens do carrinho para o formato padrão
     */
    private normalizeCartItems(items: any[]): CartItemDto[] {
        return items.map(item => {
            // Extrair produto_id, quantity e price com base na estrutura do item
            let produto_id, quantity, price, product;
            
            if (item.produto_id !== undefined) {
                produto_id = Number(item.produto_id);
            } else if (item.product && item.product.id !== undefined) {
                produto_id = Number(item.product.id);
            } else if (item.id !== undefined) {
                produto_id = Number(item.id);
            } else if (item.product && item.product.pro_codigo !== undefined) {
                // Buscar o produto pelo pro_codigo para obter o ID real
                this.logger.warn(`Usando pro_codigo em vez de id. Isso deve ser evitado.`);
                produto_id = Number(item.product.pro_codigo);
            } else {
                this.logger.warn(`Não foi possível identificar produto_id no item: ${JSON.stringify(item)}`);
                produto_id = 0;
            }
            
            quantity = Number(item.quantity || 1);
            
            if (item.price !== undefined) {
                price = Number(item.price);
            } else if (item.product && item.product.price !== undefined) {
                price = Number(item.product.price);
            } else if (item.product && item.product.pro_precovenda !== undefined) {
                price = Number(item.product.pro_precovenda);
            } else {
                price = 0;
            }
            
            product = item.product || null;
            
            return {
                produto_id,
                quantity,
                price,
                product
            };
        }).filter(item => item.produto_id > 0);
    }
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartService {
  getCartById(id: number): Promise<Cart>;
  clearCart(id: number): Promise<void>;
  updateCartItemQuantity(cartId: number, productId: number, quantity: number): Promise<Cart>;
  removeCartItem(cartId: number, productId: number): Promise<Cart>;
} 
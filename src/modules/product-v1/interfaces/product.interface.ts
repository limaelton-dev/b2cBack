export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductService {
  getProductById(id: number): Promise<Product>;
  updateStock(id: number, quantity: number): Promise<Product>;
  validateStock(id: number, quantity: number): Promise<boolean>;
} 
import { Product } from './product';

export interface ProductQuantity{

    product: Product;
    quantity: number;
    price?: number;
}

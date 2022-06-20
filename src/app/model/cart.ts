import { ProductQuantity } from './product-quantity';

export interface Cart {

    id?: number;
    idAgent: number;
    idClient?: number;
    productQuantities: ProductQuantity[];
    productIds?: number[];
    quantities?: number[];
    checkedOut?: boolean;
    status?: string;
    dateOfOrder?: Date;
}

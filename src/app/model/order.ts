import { Agent } from './agent';
import { Client } from './client';
import { Product } from './product';

export interface Order {

    id: number;
    agent?: Agent;
    client?: Client;
    products: Product[];
    quantities: number[];
    status: string;
    price: number;
    dateOfOrder: Date;
    dateOfSending: Date;
}

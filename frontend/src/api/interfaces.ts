export interface User {
    id: number;
    email: string;
    password: string;
    role: string[];
}

// Snack to be added/bought to the vending machine
export interface Product {
    id: number;
    productName: string;
    productPrice: number;
    productQty: number;
}

export interface StatusMsg {
    msg: string,
    status: string
}

export interface Deposit {
    "5": number,
    "10": number,
    "20": number,
    "50": number,
    "100": number
}

export interface Order {
    products: Product[]
}
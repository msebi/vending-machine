export interface UserLoginRequestBody {
    username: string;
    password: string;
    grant_type: string;
}

export interface UserRegisterRequestBody {
    email: string;
    password: string;
}

export interface CredentialsRegisterObject {
    email: string;
    password: string;
    roles: Array<string>;
}

export interface CredentialsLoginObject {
    username: string;
    password: string;
    accessToken: string;
}

export interface CredentialsStatusObject {
    loginSuccess: boolean;
    loginError: boolean;
    logoutSuccess: boolean;
    logoutError: boolean;
    registerSuccess: boolean;
    registerError: boolean;
}
export interface User {
    id?: number;
    email: string;
    password: string;
    roles: Array<string>;
}

// Snack to be added/bought to the vending machine
export interface Product {
    id?: number;
    productName: string;
    productPrice: number;
    productQty: number;
}

export interface StatusMsg {
    msg: string;
    status: string;
}

export interface Deposit {
    "5": number;
    "10": number;
    "20": number;
    "50": number;
    "100": number;
}

export interface Order {
    products: Product[];
    deposit: Deposit;
    statusMsg: StatusMsg;
}

export interface VendingMachineState {
    loginSuccess: boolean;
    loginError: boolean;
    logoutSuccess: boolean;
    logoutError: boolean;
    registerSuccess: boolean;
    registerError: boolean;
    username: string;
    password: string;
    accessToken: string;
    productsInVendingMachine: Array<Product>;
    order: Order;
}
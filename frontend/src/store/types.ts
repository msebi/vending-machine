export interface UserLoginRequestBody {
    userEmail: string;
    userPass: string;
    grant_type: string;
}

export interface UserRegisterRequestBody {
    userEmail: string;
    userPass: string;
}

export interface CredentialsRegisterObject {
    userEmail: string;
    userPass: string;
}

export interface CredentialsLoginObject {
    userEmail: string;
    userPass: string;
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
    role: string[];
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
    userEmail: string;
    userPass: string;
    accessToken: string;
    productsInVendingMachine: Array<Product>;
    order: Order;
}
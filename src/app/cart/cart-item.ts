export interface CartItem {
    product: Product,
    price: number,
    quantityProduct: number
    addition: Addition[]
};
export interface Addition {
    addition_id: number,
    products: Product[],
    addition_title: string,
    addition_price: number,
    quantityAddition: number
}
export interface Product {
    id: number,
    description: string,
    image: string
    info: string,
    price: number,
    title: string
}
export interface CategoryWithProduct {
    category_title: string,
    products: Product[],
    productCount: number
}

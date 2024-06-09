export class OrderData {
    constructor(
        public order_method: string,
        public full_name: string,
        public email: string,
        public phone: string,
        public date: Date | string,
        public time: string,
        public total_price: string,
        public selected_payment: string,
        public address?: string,
        public postcode?: string,
    ) {}
}
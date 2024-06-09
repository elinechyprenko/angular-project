export class User {
    constructor(
        public email: string,
        public fullname: string,
        public phone: number | null,
        public birthday: Date | null,
        public password: string | number
    ) { }
}
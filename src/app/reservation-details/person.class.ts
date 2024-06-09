export class Person {
    constructor(
        public fullName: string,
        public email: string,
        public phone: number | null,
        public occasion: string,
        public request: string
    ) { }
}

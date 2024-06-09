export class Dining {
    constructor(
        public fullName: string,
        public email: string,
        public phone: number | null,
        public date: Date | string,
        public startTime: string,
        public endTime: string,
        public people: number | null,
        public nature_event?: string,
        public info?: string
    ) { }
}
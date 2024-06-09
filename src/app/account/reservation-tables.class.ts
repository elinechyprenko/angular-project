export class ReservationTables {
    constructor(
        public date: Date | string,
        public number_of_seats: number | null,
        public time: string,
        public email: string, 
        public full_name: string,
       public phone: string
    ) {}
}
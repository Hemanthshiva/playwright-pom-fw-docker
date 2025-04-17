export class Booking {
    constructor(
        public firstname: string,
        public lastname: string,
        public totalprice: number,
        public depositpaid: boolean,
        public bookingdates: { checkin: Date, checkout: Date },
        public additionalneeds: string
    ) {}
}
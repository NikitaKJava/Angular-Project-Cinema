export interface ITicket {
    ticket_id: number,
    movie_name: string,
    display_timestamp: number,
    display_time: string,
    date_of_display: string,
    theater_name: string,
    seat_number: number,
    price: number
}

export class Ticket { // purchase constructor for post requests
    ticket_id: number
    movie_name: string
    display_timestamp: number
    display_time: string
    date_of_display: string
    theater_name: string
    seat_number: number
    price: number
}

export interface ITheatreSeats {
  seat_rows: number
  seat_columns: number
  normal: number[]
  deluxe: number[]
  disabled: number[]
  inactive: number[]
}

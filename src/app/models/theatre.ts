export interface ITheatre {
  theater_id: number // generated from database
  theater_name: string // theater name A, B, C
  number_of_seats: number
  seat_rows: number
  seat_columns: number
  screentype: string
  soundtype: string
  deluxe: number[]
  disabled: number[]
}

//   constructor(rows: number, columns: number) {
//   this.rows = rows;
//   this.columns = columns;
//   this.deluxe = new Array();
//   this.disabled = new Array();
// }


export class Theatre {
  name: string // theater name A, B, C
  rows: number
  columns: number
  deluxe: number[]
  disabled: number[]
  screetype: string
  soundtype: string
}

//   constructor(rows: number, columns: number) {
//   this.rows = rows;
//   this.columns = columns;
//   this.deluxe = new Array();
//   this.disabled = new Array();
// }

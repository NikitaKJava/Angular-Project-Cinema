
export interface IPurchase {
  purchase_id: number // generated from database
  show_id: number
  seat_number: number
}

export class Purchase { // purchase constructor for post requests
  show_id: number
  seat_number: number
}

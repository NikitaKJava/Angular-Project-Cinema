import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {

  constructor() { }

  generateQRCode(ticket_id: number, price: number, seat_number: number) {
    let qrCodeData = `ticket_id: ${ticket_id}, price: ${price}, seat_number: ${seat_number}`;
    return qrCodeData;
  }
}

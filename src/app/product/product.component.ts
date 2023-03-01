import {Component, Input} from '@angular/core';
import {IProduct} from "../models/products";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product: IProduct;

  details = false;
}

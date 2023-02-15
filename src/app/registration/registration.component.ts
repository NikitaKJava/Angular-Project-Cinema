import {Component} from '@angular/core';
import {UserRegistration} from "../models/user";
import {RegistrationService} from "../database/registration.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  record: any;
  customer = new UserRegistration;

  constructor(private registrationService: RegistrationService,
    private router: Router,) {
  }

  registration() {
    this.registrationService.addUser(this.customer)
      .subscribe(data => {
          alert("Log in with the created account");
          this.router.navigate(['/overview']).then(() => {
          });
        }
      )
    this.record = this.customer;
    console.log(JSON.stringify(this.customer));
    console.log("Firstname ....." + this.customer.firstname);
    console.log("Lastname .............." + this.customer.lastname);
    console.log("Email ....... ...." + this.customer.email);
    console.log("Phone number ........" + this.customer.phone_number);
    console.log("password ........" + this.customer.customer_password);
    // console.log("isAdmin ........" + this.customer.isadmin);

  }
}

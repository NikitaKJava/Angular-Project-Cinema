export interface User {
  userName: string
  password: string
  role: string
}

export class UserObject {
  userName: string
  password: string
  role: string
}

export class UserRegistration {
  firstname: string
  lastname: string
  email: string
  phone_number: string
  customer_password: string
  //isadmin: boolean only set in backend/db
}

export class User {
  _id: string;
  name: string;
  email: string;
  imagemUrl: string;
  phoneNumber: string;
  savedCasesId?: string[];
  userMobileTokenKey?: string;
  notifications?: Notification[]
}

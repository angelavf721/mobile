import { Notification } from "./notification.model";
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

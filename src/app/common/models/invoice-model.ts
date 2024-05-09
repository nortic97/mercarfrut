import {UserModel} from "./userModel";
import {ProductInvoiceModel} from "./productInvoiceModel";

export class InvoiceModel {
  uuid?: string | null
  cliente?: UserModel | null
  productos?: any | null;
  subtotal?: number | null;
  total?: number | null;
  aprove?: boolean | null;
}

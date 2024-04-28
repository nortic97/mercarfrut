import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopUpsService {

  constructor() { }

  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success') {
    return Swal.fire({
      title: title,
      text: message,
      icon: type,
      showConfirmButton: true
    });
  }
}

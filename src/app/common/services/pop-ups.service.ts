import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopUpsService {

  constructor() {
  }

  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success') {
    return Swal.fire({
      title: title,
      text: message,
      icon: type,
      showConfirmButton: true
    });
  }

  showConfirmationDialog(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      // Si el usuario confirma, result.value será true; de lo contrario, será undefined
      return result.value === true;
    });
  }
}

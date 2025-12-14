import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  /**
   * Muestra una modal de confirmación y devuelve el resultado.
   * @param title Título del modal (por defecto: '¿Estás seguro?').
   * @returns Observable que emite true si se confirmó, o false/error si se canceló.
   */
  confirmDeletion(title: string = '¿Estás seguro?'): Observable<boolean> {

    return new Observable(observer => {
      Swal.fire({
        title: title,
        text: '',
        //icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6777ef', // Morado
        cancelButtonColor: '#fb7823',  // Naranja
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result: SweetAlertResult) => {
        
        // Si el usuario presionó el botón de confirmación
        if (result.isConfirmed) {
          observer.next(true);
        } 
        // Si el usuario presionó el botón de cancelar, hizo clic fuera, o presionó ESC
        else {
          observer.next(false);
        }
        observer.complete();
      });
    });
  }

  /**
   * Muestra un mensaje de éxito después de la eliminación.
   * @param title Título del mensaje de éxito.
   */
/*   showSuccess(title: string = '¡Registro eliminado!'): void {
    Swal.fire(
      title,
      'El registro ha sido eliminado con éxito.',
      'success'
    );
  } */
}
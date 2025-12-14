import { Injectable } from '@angular/core'; 
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root' // Esto lo registra como un singleton global
})
export class ToastrMessage {
  // estilos en src\assets\scss\_container.scss
  constructor(private toastr: ToastrService) {}

  // ejemplos que funcionaban en tu código
  addRecordSuccess(): void {
    this.toastr.success('Add Record Successfully', '');
  }

  editRecordSuccess(): void {
    this.toastr.success('Edit Record Successfully', '');
  }

  deleteRecordSuccess(count: number): void {
    this.toastr.error(count + ' Records Deleted Successfully', '');
  }

  // métodos genéricos reutilizables
  showSuccess(mensaje: string, titulo: string = 'Éxito'): void {
    this.toastr.success(mensaje, titulo, { toastClass: 'ngx-toastr toast-transparent' });
  }

  showError(mensaje: string, titulo: string = 'Error'): void {
    this.toastr.error(mensaje, titulo, { toastClass: 'ngx-toastr toast-transparent' });
  }

  showWarning(mensaje: string, titulo: string = 'Alerta'): void {
    this.toastr.warning(mensaje, titulo, { toastClass: 'ngx-toastr toast-transparent' });
  }

  showInfo(mensaje: string, titulo: string = ''): void {
    this.toastr.info(mensaje, titulo, { toastClass: 'ngx-toastr toast-transparent' });
  }
}
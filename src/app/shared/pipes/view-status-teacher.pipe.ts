import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewStatusTeacher'
})
export class ViewStatusTeacherPipe implements PipeTransform {

  transform(value: number): string {
    let aux : string = '';
    switch (value) {
      case 0 :
        aux = "Inactivo";
        break;
      case 1 :
        aux = "Activo";
        break;
    }
    return aux;
  }

}

import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '@shared/confirmation.service';
import { ToastrMessage } from '@shared/toastrMessage';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { ToastrModule } from 'ngx-toastr';
import { AdvancedSearchComponent } from './modals/advanced-search/advanced-search.component';
import { Docente } from '@shared/models/decanatura/docente.model';
import { ViewStatusTeacherPipe } from '@shared/pipes/view-status-teacher.pipe';

@Component({
  selector: 'app-search-teacher',
  imports: [
    NgxDatatableModule, 
    ToastrModule,
    NgbTooltip,
    ViewStatusTeacherPipe
  ],
  templateUrl: './search-teacher.component.html',
  styleUrl: './search-teacher.component.scss',
})
export class SearchTeacherComponent implements OnInit {
  teacherList: Docente[] = [];
  teacherFilterList: Docente[] = [];

  pageNumber = 0;
  pageSize = 1;
  totalItems = 0;

  loadingIndicator = true;
  reorderable = false;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private toastrMessage: ToastrMessage,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadTeachers(0, 10);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  advancedSearch() {
    const modalRef = this.modalService.open(AdvancedSearchComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    // pasar datos al componente modal
    //modalRef.componentInstance.data = row;

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        // result si cerró con close(...)
      },
      (reason) => {
        // dismissed (esc o backdrop)
      }
    );
  }

  deleteRow(row: any) {
    this.confirmationService
      .confirmDeletion('¿Estás seguro de eliminar?')
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          // 2. Lógica real de eliminación (puedes reemplazar esto con tu servicio HTTP)
          this.deleteRecord(row);

          // 3. Mostrar mensaje de éxito
          this.toastrMessage.showSuccess('¡Registro eliminado con éxito!');
        }
        // else, el usuario canceló la acción.
      });
  }

  loadTeachers(page: number, size: number) {
    console.log(`Page: ${page} | Size : ${size}`);
    this.loadingIndicator = true;

    setTimeout(() => {
      this.teacherList = [];
      console.log(this.teacherList);
      
      this.teacherFilterList = [...this.teacherList];
      this.pageNumber = page;
      this.pageSize = size;
      this.totalItems = 0;
      this.loadingIndicator = false;  
    }, 1000);
  }

  filterDatatable(event: any) {
    const val = event.target.value
    .toLowerCase()
    .trim();

  // filtrar
  const filtered = this.teacherList.filter((d: Docente) => {
    return (
      d.nombre?.toLowerCase().includes(val) ||
      d.apellidoPaterno?.toLowerCase().includes(val) ||
      d.apellidoMaterno?.toLowerCase().includes(val) ||
      d.numDocumento?.toLowerCase().includes(val) ||
      d.emailInstitucional?.toLowerCase().includes(val) ||
      d.telefono?.toLowerCase().includes(val)
    );
  });

  // reset paginación
  this.pageNumber = 0;
  this.totalItems = filtered.length;

  // aplicar slice (paginación manual)
  this.teacherFilterList = filtered.slice(0, this.pageSize);

  // reset tabla visual
  this.table.offset = 0;
  }
  
  // delete single row
  deleteRecord(row: any) {
    this.teacherList = this.arrayRemove(this.teacherList, row.id);
  }

  arrayRemove(array: any[], id: any) {
    return array.filter(function (element) {
      return element.id !== id;
    });
  }

  onPage(event : any) {
    this.pageNumber = event.offset;
    console.log(this.pageNumber);
    
    this.loadTeachers(this.pageNumber, 10);
  }

}

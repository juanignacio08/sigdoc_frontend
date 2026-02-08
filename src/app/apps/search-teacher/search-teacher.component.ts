import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '@shared/confirmation.service';
import { ToastrMessage } from '@shared/toastrMessage';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdvancedSearchComponent } from './modals/advanced-search/advanced-search.component';
import { Docente, DocenteFilter } from '@shared/models/decanatura/docente.model';
import { ViewStatusTeacherPipe } from '@shared/pipes/view-status-teacher.pipe';
import { DocenteService } from 'app/services/decanatura/docente.service';

@Component({
  selector: 'app-search-teacher',
  imports: [
    NgxDatatableModule,
    ToastrModule,
    NgbTooltip,
    ViewStatusTeacherPipe,
  ],
  templateUrl: './search-teacher.component.html',
  styleUrl: './search-teacher.component.scss',
})
export class SearchTeacherComponent implements OnInit {
  teacherList: Docente[] = [];
  teacherFilterList: Docente[] = [];
  teacherAllList: Docente[] = [];

  pageNumber = 0;
  pageSize = 1;
  totalItems = 0;
  pageSizeOptions = [10, 20, 50, 100];

  pageNumberV1 = 0;
  pageSizeV1 = 10;
  totalItemsV1 = 0;

  loadingIndicator = true;
  reorderable = false;
  scrollBarHorizontal = window.innerWidth < 1200;

  docenteFilter : DocenteFilter | null = null;

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  docenteService = inject(DocenteService);

  constructor(
    private modalService: NgbModal,
    private toastrMessage: ToastrMessage,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTeachers(0, 10, this.docenteFilter);
    this.loadAllTeachers();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  advancedSearch() {
    const modalRef = this.modalService.open(AdvancedSearchComponent, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        this.docenteFilter = result;
        this.pageNumber = 0;
        this.pageSize = 10;
        this.loadTeachers(this.pageNumber, this.pageSize, this.docenteFilter);
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

  loadAllTeachers() {
    this.loadingIndicator = true;
    this.docenteService.getAllPage(0, 10000).subscribe({
      next: (response) => {
        this.teacherAllList = response.data;
        this.loadingIndicator = false;
      },
      error: (err) => {
        this.loadingIndicator = false;
        if (err.error.detail) {
          this.showError(err.error.detail);
        } else {
          this.showError('Error desconocido. Intentelo de nuevo...');
        }
      },
    });
  }

  loadTeachers(page: number, size: number, docenteFilter : DocenteFilter | null) {
    this.loadingIndicator = true;
    if (docenteFilter === null) this.loadAllTeacher(page, size);
    else this.loadFilterTeacher(page, size, docenteFilter);
  }

  loadFilterTeacher(page: number, size: number, docenteFilter: DocenteFilter) {
    this.docenteService.getAllByFilters(docenteFilter, page, size).subscribe({
      next: (response) => {
        this.teacherList = response.data;
        this.teacherFilterList = [...this.teacherList];
        this.pageNumber = response.currentPage;
        this.pageSize = size;
        this.totalItems = response.totalItems;
        this.loadingIndicator = false;

        this.pageNumberV1 = this.pageNumber;
        this.pageSizeV1 = this.pageSize;
        this.totalItemsV1 = this.totalItems;
      },
      error: (err) => {
        this.loadingIndicator = false;
        if (err.error.detail) {
          this.showError(err.error.detail);
        } else {
          this.showError('Error desconocido. Intentelo de nuevo...');
        }
      },
    });
  }

  loadAllTeacher(page: number, size: number) {
    this.docenteService.getAllPage(page, size).subscribe({
      next: (response) => {
        this.teacherList = response.data;
        this.teacherFilterList = [...this.teacherList];
        this.pageNumber = response.currentPage;
        this.pageSize = size;
        this.totalItems = response.totalItems;
        this.loadingIndicator = false;

        this.pageNumberV1 = this.pageNumber;
        this.pageSizeV1 = this.pageSize;
        this.totalItemsV1 = this.totalItems;
      },
      error: (err) => {
        this.loadingIndicator = false;
        if (err.error.detail) {
          this.showError(err.error.detail);
        } else {
          this.showError('Error desconocido. Intentelo de nuevo...');
        }
      },
    });
  }

  filterDatatable(event: any) {
    const val = event.target.value.toLowerCase().trim();
    
    if (!val) {
      this.teacherFilterList = [];
      this.teacherFilterList = [...this.teacherList];
      this.pageNumber = this.pageNumberV1;
      this.pageSize = this.pageSizeV1;
      this.totalItems = this.totalItemsV1;
      return;
    }

    // filtrar
    const filtered = this.teacherAllList.filter((d: Docente) => {
      return (
        d.nombre?.toLowerCase().includes(val) ||
        d.apellidoPaterno?.toLowerCase().includes(val) ||
        d.apellidoMaterno?.toLowerCase().includes(val) ||
        d.numDocumento?.toLowerCase().includes(val) ||
        d.emailPersonal?.toLowerCase().includes(val) ||
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

  onPage(event: any) {
    this.pageNumber = event.offset;
    this.loadTeachers(this.pageNumber, this.pageSize, this.docenteFilter);
  }

  showError(message: string) {
    this.toastr.error(message, 'Error!');
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Información');
  }

  onPageSizeChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize = value;
    this.pageNumber = 0;   
    this.loadTeachers(this.pageNumber, this.pageSize, this.docenteFilter); 
  }

  clearFilters() {
    this.docenteFilter = null;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.loadTeachers(0, 10, this.docenteFilter);
  }

}

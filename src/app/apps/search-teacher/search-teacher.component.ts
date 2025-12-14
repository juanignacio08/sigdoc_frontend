import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '@shared/confirmation.service';
import { ToastrMessage } from '@shared/toastrMessage';
import { DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { Validators } from 'ngx-editor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ViewComponent } from './modals/view/view.component';
import { AdvancedSearchComponent } from './modals/advanced-search/advanced-search.component';

@Component({
  selector: 'app-search-teacher',
  imports: [
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
  templateUrl: './search-teacher.component.html',
  styleUrl: './search-teacher.component.scss'
})
export class SearchTeacherComponent implements OnInit {

  columns = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Phone' },
    { name: 'Email' },
    { name: 'Status' },
  ];

  rows = [];
  scrollBarHorizontal = window.innerWidth < 1200;

  newUserImg = 'assets/images/users/user-2.png';
  data: any[] = [];
  filteredData: any[] = [];
  register!: UntypedFormGroup;
  loadingIndicator = true;
  isRowSelected = false;
  selectedOption!: string;
  reorderable = true;
  selection!: SelectionType;
  public selected: number[] = [];

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;

  statusType = [
    { id: '1', value: 'Completed' },
    { id: '2', value: 'Pending' },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastrMessage: ToastrMessage,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {
    this.fetch((data: any) => {
      this.data = data;
      this.filteredData = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
    this.register = this.fb.group({
      id: [''],
      img: [''],
      firstName: ['', /* [Validators.required, Validators.pattern('[a-zA-Z]+')] */],
      lastName: [''],
      designation: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
      status: ['', [Validators.required]],
      address: [''],
    });
  }

    // View record
  viewRow(row: any) {
    const modalRef = this.modalService.open(ViewComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      scrollable: true
    });

    // pasar datos al componente modal
    modalRef.componentInstance.data = row;

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

  advancedSearch() {
    const modalRef = this.modalService.open(AdvancedSearchComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      scrollable: true
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
    this.confirmationService.confirmDeletion('¿Estás seguro de eliminar?').subscribe(
      (confirmed: boolean) => {

        if (confirmed) {
          // 2. Lógica real de eliminación (puedes reemplazar esto con tu servicio HTTP)
          this.deleteRecord(row);

          // 3. Mostrar mensaje de éxito
          this.toastrMessage.showSuccess('¡Registro eliminado con éxito!');

        }
        // else, el usuario canceló la acción.
      }
    );
  }


  // fetch data
  fetch(cb: any) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/adv-tbl-data.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }




  // delete single row
  deleteRecord(row: any) {
    this.data = this.arrayRemove(this.data, row.id);
  }

  arrayRemove(array: any[], id: any) {
    return array.filter(function (element) {
      return element.id !== id;
    });
  }

  // filter table data
  filterDatatable(event: any) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable

    this.data = this.filteredData.filter((item) => {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
      return false;
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  // get random id
  getId(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'app/services/maestros/dashboard.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { Dashboard } from '../../shared/models/maestros/dashboard.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import {
  Color,
  ScaleType,
  BarChartModule,
  LineChartModule,
  AreaChartModule,
  PieChartModule,
  LegendPosition,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-main',
  imports: [
    NgbProgressbar,
    NgxEchartsDirective,
    LoadingComponent,
    CommonModule,
    BarChartModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [provideEcharts()],
})
export class MainComponent implements OnInit {
  dashBoard?: Dashboard;

  controls = {
    general: { loading: false, error: false },
  };

  colorScheme: Color = {
    domain: ['#9370DB'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  public legendPosition: LegendPosition = LegendPosition.Right;
  // vaericle bar chart start
  vbarxAxisLabel = 'Departamentos Académicos';
  vbaryAxisLabel = 'Docentes';

  public single = [
    {
      name: 'D.A.',
      value: 0,
    },
  ];

  dashboardService = inject(DashboardService);

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDashboardMain();
  }

  loadDashboardMain() {
    this.controls.general.loading = true;
    this.dashboardService.getMain().subscribe({
      next: (response) => {
        this.dashBoard = response.data;
        this.updatePieChart(); // <--- Nueva función para mapear los datos
        this.updateBarChart();
        this.controls.general.loading = false;
      },
      error: (err) => {
        this.controls.general.loading = false;
        this.controls.general.error = true;
        this.showError(
          'No se pudo cargar la información... Intente nuevamente más tarde.',
        );
      },
    });
  }

  updatePieChart() {
    if (!this.dashBoard?.professionalSchoolList) return;

    const schoolData = this.dashBoard.professionalSchoolList;
    const legendNames = schoolData.map((item) => item.denomination);
    const seriesData = schoolData.map((item) => ({
      value: item.value,
      name: item.denomination,
    }));
    const colors = schoolData.map((item) => item.color);

    // Creamos el objeto de la serie por separado para evitar problemas de indexación [0]
    const pieSeries: any = {
      name: 'Escuelas Profesionales',
      type: 'pie',
      radius: '50%',
      center: ['50%', '60%'],
      data: seriesData,
      color: colors,
    };

    // Actualizamos el objeto completo
    this.pie_chart = {
      ...this.pie_chart,
      legend: {
        ...this.pie_chart.legend, // Casting a any para evitar el error de undefined
        data: legendNames,
        top: '5%',
      },
      series: [pieSeries], // Pasamos el array directamente
      color: colors,
    };
  }

  updateBarChart() {
    if (!this.dashBoard?.academicApartmentList) return;
  
    const apartmentData = this.dashBoard.academicApartmentList;
    const seriesData = apartmentData.map((item) => ({
      name: item.denomination,
      value: item.value,
    }));
    const colors = apartmentData.map((item) => item.color);

    this.colorScheme.domain = colors;
    this.single = seriesData;
    
  }

  showError(message: string) {
    this.toastr.error(message, 'Error!');
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Información');
  }

  getLegendData(): string[] {
    let list: string[] = [];
    if (this.dashBoard?.professionalSchoolList) {
      for (const item of this.dashBoard.professionalSchoolList) {
        list.push(item.denomination);
      }
    }
    return list;
  }

  // pie_chart: EChartsOption = {
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)',
  //   },
  //   legend: {
  //     textStyle: {
  //       color: '#9aa0ac',
  //       padding: [0, 5, 0, 5],
  //     },
  //   },
  //   series: [
  //     {
  //       name: 'Escuelas Profesionales',
  //       type: 'pie',
  //       radius: '55%',
  //       center: ['50%', '48%'],
  //       data: [], // Vacío al inicio
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: 'rgba(0, 0, 0, 0.5)',
  //         },
  //       },
  //     },
  //   ],
  // };

  pie_chart: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      data: ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'],
      textStyle: {
        color: '#9aa0ac',
        padding: [0, 5, 0, 5],
      },
    },

    series: [
      {
        name: 'Chart Data',
        type: 'pie',
        radius: '55%',
        center: ['50%', '48%'],
        data: [
          {
            value: 335,
            name: 'Data 1',
          },
          {
            value: 310,
            name: 'Data 2',
          },
          {
            value: 234,
            name: 'Data 3',
          },
          {
            value: 135,
            name: 'Data 4',
          },
          {
            value: 548,
            name: 'Data 5',
          },
        ],
      },
    ],
    color: ['#575B7A', '#DE725C', '#DFC126', '#72BE81', '#50A5D8'],
  };
}

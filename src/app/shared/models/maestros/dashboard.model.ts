import { ResponseDTO } from "../base/responsedto.model";

export interface ItemGraphPie {
    id: number,
    denomination: string,
    abbreviation: string,
    color: string,
    image: string,
    value: number,
    percent: number
}

export interface Dashboard {
    totalTeacher: number,
    teacherPercent: number,

    totalTeacherInAcademicApartment: number,
    teacherInAcademicApartmentPercent: number,

    totalTeacherInProfessionalSchool: number,
    teacherInProfessionalSchoolPercent: number,

    academicApartmentList: ItemGraphPie[],
    professionalSchoolList: ItemGraphPie[],
}

export type DashboardResponse = ResponseDTO<Dashboard>;
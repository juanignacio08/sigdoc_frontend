import { Route } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { ContactGridComponent } from "./contact-grid/contact-grid.component";
import { BlogComponent } from "./blog/blog.component";
import { SearchTeacherComponent } from "./search-teacher/search-teacher.component";
import { RegisterTeacherComponent } from "./register-teacher/register-teacher.component";
import { MainComponent } from "./main/main.component";
import { RegisterPersonalDataComponent } from "./register-teacher/register-personal-data/register-personal-data.component";
import { RegisterAcademicInfoComponent } from './register-teacher/register-academic-info/register-academic-info.component';
import { RegisterWorkInfoComponent } from "./register-teacher/register-work-info/register-work-info.component";
import { RegisterWorkExperienceInfoComponent } from "./register-teacher/register-work-experience-info/register-work-experience-info.component";
import { RegisterLanguagesInfoComponent } from './register-teacher/register-languages-info/register-languages-info.component';

export const APPS_ROUTE: Route[] = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'search-teacher',
    component: SearchTeacherComponent,
  },
  {
    path: 'register-teacher',
    component: RegisterTeacherComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-data',
        pathMatch: 'full',
      },
      {
        path: 'personal-data',
        component: RegisterPersonalDataComponent,
      },
      {
        path: 'academic-data',
        component: RegisterAcademicInfoComponent,
      },
      {
        path: 'work-data',
        component: RegisterWorkInfoComponent,
      },
      {
        path: 'work-experience-data',
        component: RegisterWorkExperienceInfoComponent,
      },
      {
        path: 'languages-data',
        component: RegisterLanguagesInfoComponent,
      },
    ],
  },
  




  
  /* Eliminar abajo */
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'contact-grid',
    component: ContactGridComponent,
  },
];

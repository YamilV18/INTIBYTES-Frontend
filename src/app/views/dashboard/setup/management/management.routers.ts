import { Routes } from '@angular/router';
import {ManagementContainerComponent} from "./containers/management-container.component";
import {ManagementComponent} from "./management.component";

export default [

  {
    path     : '',
    component: ManagementComponent,
    children: [
      {
        path: '',
        component: ManagementContainerComponent,
        data: {
          title: 'Management'
        }
      },
    ],
  },
] as Routes;

import { Routes } from '@angular/router';
import {ServiceContainerComponent} from "./containers/service-container.component";
import {ServiceComponent} from "./service.component";

export default [

  {
    path     : '',
    component: ServiceComponent,
    children: [
      {
        path: '',
        component: ServiceContainerComponent,
        data: {
          title: 'Servicios'
        }
      },
    ],
  },
] as Routes;

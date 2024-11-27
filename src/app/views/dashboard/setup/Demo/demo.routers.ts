import { Routes } from '@angular/router';
import {DemoContainerComponent} from "./containers/demo-container.component";
import {DemoComponent} from "./demo.component";

export default [

  {
    path     : '',
    component: DemoComponent,
    children: [
      {
        path: '',
        component: DemoContainerComponent,
        data: {
          title: 'Demo'
        }
      },
    ],
  },
] as Routes;

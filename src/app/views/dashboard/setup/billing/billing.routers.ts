import { Routes } from '@angular/router';
import {BillingContainerComponent} from "./containers/billing-container.component";
import {BillingComponent} from "./billing.component";

export default [

  {
    path     : '',
    component: BillingComponent,
    children: [
      {
        path: '',
        component: BillingContainerComponent,
        data: {
          title: 'Billing'
        }
      },
    ],
  },
] as Routes;

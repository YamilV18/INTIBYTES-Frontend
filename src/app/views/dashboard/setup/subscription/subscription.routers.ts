import { Routes } from '@angular/router';
import {SubscriptionContainerComponent} from "./containers/subscription-container.component";
import {SubscriptionComponent} from "./subscription.component";

export default [

  {
    path     : '',
    component: SubscriptionComponent,
    children: [
      {
        path: '',
        component: SubscriptionContainerComponent,
        data: {
          title: 'Subscription'
        }
      },
    ],
  },
] as Routes;

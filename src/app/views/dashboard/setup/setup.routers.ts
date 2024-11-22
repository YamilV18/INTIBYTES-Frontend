import { Routes } from '@angular/router';
import {SetupComponent} from "./setup.component";

export default [
    {
        path     : '',
        component: SetupComponent,
        children: [
            {path: 'client', loadChildren: () => import('./client/client.routers')},
            {path: 'service', loadChildren: () => import('./services/service.routers')},
            {path: 'billing', loadChildren: () => import('./billing/billing.routers')},
            {path: 'subscription', loadChildren: () => import('./subscription/subscription.routers')},
            {path: 'management', loadChildren:()=>import('./management/management.routers')},
            {path: 'review', loadChildren: () => import('./review/review.routers')},
            {path: 'role', loadChildren: () => import('./roles/roles.routers')},
            {path: 'users', loadChildren: () => import('./user/users-routers')},
            {path: 'user', loadChildren: () => import('./user/users-routers')},
            {path: 'tree', loadChildren: () => import('./tree/tree.routers')},
            {path: 'access', loadChildren: () => import('./access/access.routers')},
        ],
    },
] as Routes;

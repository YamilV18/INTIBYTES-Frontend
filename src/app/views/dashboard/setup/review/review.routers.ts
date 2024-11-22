import { Routes } from '@angular/router';
import {ReviewContainerComponent} from "./containers/review-container.component";
import {ReviewComponent} from "./review.component";

export default [

    {
        path     : '',
        component: ReviewComponent,
        children: [
            {
                path: '',
                component: ReviewContainerComponent,
                data: {
                    title: 'Review'
                }
            },
        ],
    },
] as Routes;

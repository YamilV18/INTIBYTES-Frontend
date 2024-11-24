import { Routes } from '@angular/router';
import {ChatContainerComponent} from "./containers/chat-container.component";
import {ChatComponent} from "./chat.component";

export default [

  {
    path     : '',
    component: ChatComponent,
    children: [
      {
        path: '',
        component: ChatContainerComponent,
        data: {
          title: 'Chats'
        }
      },
    ],
  },
] as Routes;

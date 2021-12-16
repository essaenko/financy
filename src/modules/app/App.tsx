import React from 'react';
import {BrowserRouter} from "react-router-dom";

import { Auth } from 'modules/auth';

export const App = (): JSX.Element => (
  <BrowserRouter>
    <Auth />
  </BrowserRouter>
);


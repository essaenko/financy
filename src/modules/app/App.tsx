import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Auth } from 'modules/auth'
import { Dashboard } from 'modules/dashboard'

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Auth />
      <Dashboard />
    </BrowserRouter>
  )
}

import React from 'react';
import { Link } from "react-router-dom";

export const AuthRegistration = (): JSX.Element => {
  return (
    <div>
      RegistrationForm
      <Link to={'/'}>
        Login
      </Link>
    </div>
  )
}
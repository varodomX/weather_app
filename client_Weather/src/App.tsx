import React from "react";
import Router from './Router'
import i18n from "./components/I18nextProvider/I18n/I18n";
import { I18nextProvider } from 'react-i18next';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router />
    </I18nextProvider>
  )
}

export default App

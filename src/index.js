import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {IntlProvider} from "react-intl";
import messages_ru from "./translations/ru.json";
import messages_en from "./translations/en.json";

const messages = {
    'ru': messages_ru,
    'en': messages_en
};
const language = navigator.language.split(/[-_]/)[0];  // language without region code

ReactDOM.render(
    <IntlProvider locale={language} messages={messages[language]}>
        <BrowserRouter>
                <App/>
        </BrowserRouter>
    </IntlProvider>,
    document.getElementById('root'));
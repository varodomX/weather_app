import { I18nextProvider as Provider } from 'react-i18next';
import i18n from './I18n/I18n';

function I18nextProvider(props: any) {
    return (
        <Provider i18n={i18n}>
            {props.children}
        </Provider>
    )
}

export default I18nextProvider
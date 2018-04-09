import React from 'react';
import LocaleContext from './LocaleContext';

const withLocale = Component => props => (
    <LocaleContext.Consumer>
        {context => (<Component {...props} locale={context} />)}
    </LocaleContext.Consumer>
);

export default withLocale;

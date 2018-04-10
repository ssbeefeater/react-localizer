import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import Handlebars from 'handlebars/runtime';
import { Text, LocaleProvider, withLocale } from '../src';

Text.displayName = 'Text';
storiesOf('Locale', module)
    .add('Basic', withInfo()(() => (
        <LocaleProvider language="en" source={{ test: 'Test Locale' }}>
            <Text>test</Text>
        </LocaleProvider>
    )))
    .add('Nested value', withInfo()(() => (
        <LocaleProvider language="en" source={{ nested: { test: 'Test Nested Locale' } }} >
            <Text id="nested.test" />
        </ LocaleProvider>
    )))
    .add('With variables', withInfo()(() => (
        <LocaleProvider language="en" source={{ withVariables: 'Hello, $user' }} >
            <Text id="withVariables" values={{ user: 'Mike' }} />
        </ LocaleProvider>
    )))
    .add('With Plurals', withInfo()(() => (
        <LocaleProvider language="en" source={{ withVariables: '{plural($users, ["user","users"] )}' }} >
            <Text id="withVariables" values={{ users: 1 }} />
            <Text id="withVariables" values={{ users: 2 }} />
        </ LocaleProvider>
    )))
    .add('With Html', withInfo()(() => (
        <LocaleProvider language="en" source={{ withHtml: '<a href="https://github.com/ssbeefeater/react-localizer" target="_blank">REACT-LOCALIZER</a>' }} >
            <Text html id="withHtml" />
        </LocaleProvider>
    )))
    .add('With custom textParser', withInfo()(() => (
        <LocaleProvider textParser={(text, values) => { return 'Mpamies' }} language="en" source={{ withHtml: '<a href="https://github.com/ssbeefeater/react-localizer" target="_blank">REACT-LOCALIZER</a>' }} >
            <Text html id="withHtml" />
        </LocaleProvider>
    )))
    .add('Change language', withInfo()(() => {
        let Button = props => (
            <button onClick={() => props.locale.setLanguage('gr')}>Change language</button>
        );
        Button = withLocale(Button);
        Button.displayName = 'Button';
        return (
            <LocaleProvider importer={() => Promise.resolve({ test: 'Γεια' })} language="en" source={{ test: 'Hello' }} >
                <Text id="test" /><br />
                <Button />
            </LocaleProvider>
        );
    }));

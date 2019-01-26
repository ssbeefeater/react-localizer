import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
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
            <Text text="nested.test" />
        </ LocaleProvider>
    )))
    .add('With variables', withInfo()(() => (
        <LocaleProvider language="en" source={{ withVariables: 'Hello, $user' }} >
            <Text text="withVariables" values={{ user: 'Mike' }} />
        </ LocaleProvider>
    )))
    .add('With Plurals', withInfo()(() => (
        <LocaleProvider language="en" source={{ withVariables: '{plural($users, ["user","users"] )}' }} >
            <div><Text text="withVariables" values={{ users: 1 }} /></div>
            <div> <Text text="withVariables" values={{ users: 2 }} /></div>
        </ LocaleProvider>
    )))
    .add('With custom textParser', withInfo()(() => (
        <LocaleProvider textParser={(text, values) => `${text} - react-localizer`} language="en" source={{ awesome: 'Awesome' }} >
            <Text text="awesome" />
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
                <Text text="test" /><br />
                <Button />
            </LocaleProvider>
        );
    }));

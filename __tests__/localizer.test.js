import 'raf/polyfill';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from './react16Adapter';
import { LocaleProvider, Text, withLocale } from '../src';

Enzyme.configure({ adapter: new Adapter() });

const { mount } = Enzyme;
const localeShape = {
    setLanguage: expect.any(Function),
    get: expect.any(Function),
    language: expect.any(String),
};
describe('Localizer', () => {
    it('Renders correct in the', () => {
        const component = mount(<LocaleProvider language="en" source={{ test: 'Test Locale' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale).toMatchObject(localeShape);
        expect(producedText).toBe('Test Locale');
    });
    it('Should render the key if not value was found', () => {
        const component = mount(<LocaleProvider language="en" source={{ test: 'Test Locale' }}>
            <Text>noExist</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale).toMatchObject(localeShape);
        expect(producedText).toBe('noExist');
    });
    it('Should render empty string if not value specified', () => {
        const component = mount(<LocaleProvider language="en" source={{ test: 'Test' }}>
            <Text></Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale).toMatchObject(localeShape);
        expect(producedText).toBe('');
    });
    it('Renders correctly with values', () => {
        const component = mount(<LocaleProvider language="en" source={{ test: 'Hello $user' }}>
            <Text values={{ user: 'Mike' }}>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale).toMatchObject(localeShape);
        expect(producedText).toBe('Hello Mike');
    });
    it('should get locale prop withLocale', () => {
        let Button = () => (<button>change language</button>);
        Button = withLocale(Button);
        const component = mount(<LocaleProvider importer={language => Promise.resolve({ test: 'Γεια' })} language="en" source={{ test: 'Hello' }}>
            <Text values={{ user: 'Mike' }}>test</Text>
            <Button />
        </LocaleProvider>);
        const button = component.find('Button');
        const { locale } = button.props();
        expect(component).toHaveLength(1);
        expect(locale).toMatchObject(localeShape);
    });
    it('Expect to change language', (done) => {
        const importer = jest.fn(language => Promise.resolve({ test: 'Γεια' }));
        const component = mount(<LocaleProvider importer={importer} language="en" source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();

        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('Hello');

        locale.setLanguage('gr').then(() => {
            expect(importer).toHaveBeenCalled();
            expect(component.state('language')).toBe('gr');
            expect(component.state('source').test).toBe('Γεια');
            done();
        });
    });
    it('Expect to handle non promised importers ', (done) => {
        const importer = jest.fn(language => ({ test: 'Γεια' }));
        const component = mount(<LocaleProvider importer={importer} language="en" source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();

        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('Hello');

        locale.setLanguage('gr').then(() => {
            expect(importer).toHaveBeenCalled();
            expect(component.state('language')).toBe('gr');
            expect(component.state('source').test).toBe('Γεια');
            done();
        });
    });

    it('Expect not to change language if no resource found', (done) => {
        const importer = jest.fn(language => Promise.resolve());
        const component = mount(<LocaleProvider importer={importer} language="en" source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('Hello');

        locale.setLanguage('gr').then(() => {
            expect(importer).toHaveBeenCalled();
            expect(component.state('language')).toBe('en');
            expect(component.state('source').test).toBe('Hello');
            done();
        });
    });
    it('Expect not to call setState if setLanguage language is the same with the current', (done) => {
        const importer = jest.fn(language => Promise.resolve());
        const component = mount(<LocaleProvider importer={importer} language="en" source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const mockSetState = jest.fn();
        component.instance().setLanguageFromSource = mockSetState;
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('Hello');

        locale.setLanguage('en').then(() => {
            expect(importer).not.toHaveBeenCalled();
            expect(component.state('language')).toBe('en');
            expect(component.state('source').test).toBe('Hello');
            expect(mockSetState).not.toHaveBeenCalled();
            done();
        });
    });
    it('Expect not to change language if no importer was defined', (done) => {
        const component = mount(<LocaleProvider language="en" source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('Hello');

        locale.setLanguage('gr').then(() => {
            expect(component.state('language')).toBe('en');
            expect(component.state('source').test).toBe('Hello');
            done();
        });
    });
    it('Expect return value that custom textParser returns', () => {
        const component = mount(<LocaleProvider textParser={() => 'anything'} source={{ test: 'Hello' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const producedText = component.find('Text').find('p').text();
        const { locale } = component.find('Text').props();
        expect(component).toHaveLength(1);
        expect(locale.language).toBe('en');
        expect(producedText).toBe('anything');
    });
    it('Expect not to render html if html prop not specified', () => {
        const component = mount(<LocaleProvider source={{ test: '<a class="test" href="#">Hello</a>' }}>
            <Text>test</Text>
        </LocaleProvider>);
        const html = component.find('Text').html();
        expect(component).toHaveLength(1);
        expect(html.includes('</a>')).toBeFalsy();
    });
    it('Expect to render html value if html prop has specified', () => {
        const component = mount(<LocaleProvider source={{ test: '<a class="test" href="#">Hello</a>' }}>
            <Text html>test</Text>
        </LocaleProvider>);
        const html = component.find('Text').html();
        expect(component).toHaveLength(1);
        expect(html.includes('</a>')).toBeTruthy();
    });
});


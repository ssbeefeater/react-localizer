import 'raf/polyfill';
import React from 'react';
import { LocaleProvider } from '../src';

describe('LocaleProvider', () => {
    describe('replaceText', () => {
        it('Should return the correct value for simple variable', () => {
            expect(LocaleProvider.replaceText('$user', { user: 'Mike' })).toBe('Mike');
        });
        it('Should return the correct value for multiple instances of te same variable', () => {
            expect(LocaleProvider.replaceText('My name is $user, James $user', { user: 'Bond' })).toBe('My name is Bond, James Bond');
        });
        it('Should return the correct value with multiple variables ', () => {
            expect(LocaleProvider.replaceText('$bond vs $mike', { bond: 'Bond', mike: 'Mike' })).toBe('Bond vs Mike');
        });

        it('Should return the correct value with multiple variables with similar name', () => {
            expect(LocaleProvider.replaceText('$user1 vs $user2', { user1: 'Bond', user2: 'Mike' })).toBe('Bond vs Mike');
            expect(LocaleProvider.replaceText('$username $user', { user: 'Bond', username: 'James' })).toBe('James Bond');
        });
        it('Should return empty string if the args are not correct', () => {
            expect(LocaleProvider.replaceText(null, { user1: 'Bond', user2: 'Mike' })).toBe('');
            expect(LocaleProvider.replaceText('$username $user')).toBe('$username $user');
        });
    });
    describe('pluralize', () => {
        it('Should return the correct value with single instance ', () => {
            const locale = new LocaleProvider({ language: 'en' });
            expect(locale.pluralize('there {plural(1,["is","are"])}')).toBe('there is');
            expect(locale.pluralize('there {plural(0,["is","are"])}')).toBe('there are');
            expect(locale.pluralize('there {plural(2,["is","are"])}')).toBe('there are');
        });
        it('Should return the correct value with multiple instances', () => {
            const locale = new LocaleProvider({ language: 'en' });
            expect(locale.pluralize('there {plural(20,["is","are"])} 20 {plural(20,["user","users"])} online')).toBe('there are 20 users online');
        });
        it('Should return empty string if fail and console error', () => {
            const locale = new LocaleProvider({ language: 'en' });
            const consoleError = jest.spyOn(console, 'error');
            expect(locale.pluralize('{plural(20,[is,are])}')).toBe('');
            expect(consoleError).toHaveBeenCalledTimes(1);
        });
        it('Should return empty string if no text was defined', () => {
            const locale = new LocaleProvider({ language: 'en' });
            expect(locale.pluralize()).toBe('');
        });
        it('Should return the correct value with custom plural function', () => {
            const locale = new LocaleProvider({
                language: 'en',
                pluralize: (language, args) => {
                    expect(language).toBe('en');
                    expect(args[0]).toBe('user');
                    expect(args[1]).toBe('1');
                    return 'user';
                },
            });
            expect(locale.pluralize('1 {plural(user, 1)} online')).toBe('1 user online');
        });
    });
});

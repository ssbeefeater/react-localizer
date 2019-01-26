## v2.0.0

- Breaking changes
    - Change id prop to text in Text component
    - Change values prop to variables in Text component
    - In locale.get change the second params from values to ```option = { nullable: boolean, variables: object }``` nullable:true will return null if no text found. variables are the old values
    - Add lowerCase prop in text component that returns the text in loweCase
    - Add upperCase prop in text component that returns the text in upperCase
    - Add upperFirst prop in text component that returns the text with the first letter only in upper case
    - Now Text component returns the translated text only without any wrapped component




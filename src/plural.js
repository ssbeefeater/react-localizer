const plural = (language, args) => {
    try {
        const values = JSON.parse(args[1]);
        if (Number(args[0]) === 1) {
            return values[0];
        }
        return values[1];
    } catch (err) {
        console.error('Something went wrong with plurals. Values:', language, args);
    }
    return '';
};
export default plural;

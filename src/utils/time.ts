export const getGMTTime = () => {
    const a = new Date().toUTCString();
    return new Date(a).toISOString();
}

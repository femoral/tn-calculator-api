export const getFromEnv = (key: string, defaultValue: string) => {
    const value = process.env[key];
    if (value) return value;
    return defaultValue;
}
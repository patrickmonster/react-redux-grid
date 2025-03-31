export const isPluginEnabled = (
    plugins: {
        [key: string]: any;
    },
    name: string
) => {
    const enabled = plugins && plugins[name] && plugins[name].enabled;

    return !!enabled;
};

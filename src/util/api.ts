type ApiConfig = {
    method?: string;
    route: string;
    data?: any;
    headers?: { [key: string]: string };
    queryStringParams?: { [key: string]: any };
};
type ApiResponse = {
    status: number;
    statusText: string;
    data: any;
};
type ApiError = {
    status: number;
    statusText: string;
    message: string;
};

export const Api = (config: ApiConfig) => {
    const promise = new Promise((resolve) => {
        if (!config.method) {
            config.method = "GET";
        }

        if (config.data) {
            config.data = JSON.stringify(config.data);
        }

        const request = new XMLHttpRequest();
        config.route = buildQueryString(config).route;

        request.open(config.method, config.route, true);
        setRequestHeaders(request, config);
        addAjaxEvents(request, resolve);

        request.send(config.data || null);
    });

    return promise;
};

export const setRequestHeaders = (
    request: XMLHttpRequest,
    config: Partial<ApiConfig> = {}
) => {
    if (!config.headers || !config.headers.contentType) {
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
    }

    if (!config.headers) {
        return false;
    }

    for (const key of Object.keys(config.headers)) {
        request.setRequestHeader(key, config.headers[key]);
    }
};

export const addAjaxEvents = (request: XMLHttpRequest, resolver: Function) => {
    const getResponse = () => {
        try {
            const response = JSON.parse(request.responseText);

            resolver(response);
        } catch (e) {
            /* eslint-disable no-console */
            console.log(e);
            /* eslint-enable no-console */
        }
    };

    request.addEventListener("load", getResponse);
};

export const buildQueryString = (config: ApiConfig) => {
    const ret = {
        route: `${config.route}?_dc=${Date.now()}&`, // cache buster
    };

    if (!config.queryStringParams) return ret;
    for (const key of Object.keys(config.queryStringParams))
        if (config.queryStringParams[key])
            ret.route += `${key}=${config.queryStringParams[key]}&`;

    return ret;
};

export default Api;

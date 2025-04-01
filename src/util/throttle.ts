type ThrottleOptions = {
    leading?: boolean;
    trailing?: boolean;
};

export function throttle(
    callback: Function,
    scope,
    limit = 100,
    options: ThrottleOptions = {}
) {
    options = {
        leading: true,
        trailing: false,
        ...options,
    };

    let wait = false;
    let skip = false;

    if (options.leading === false) {
        skip = true;
    }

    const later = debounce(() => {
        if (options.trailing) {
            callback.apply(scope, arguments);
        }
        if (options.leading === false) {
            skip = true;
        }
    }, limit + limit * 0.15);

    return function dothrottle() {
        if (!wait && !skip) {
            callback.apply(scope, arguments);
            wait = true;
            setTimeout(() => {
                wait = false;
                if (later) {
                    later.apply(scope, arguments);
                }
            }, limit);
        } else if (!wait && skip) {
            wait = true;
            setTimeout(() => {
                skip = false;
                wait = false;
                if (later) {
                    later.apply(scope, arguments);
                }
            }, limit);
        }
    };
}

export function debounce(func: Function, wait: number, immediate = false) {
    let timeout: NodeJS.Timer | null;

    return function doDebounce() {
        const context = this;
        const args = arguments;

        const later = function later() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}

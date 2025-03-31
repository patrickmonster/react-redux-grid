export const keyGenerator = (...keywords: string[]) =>
    encode(Array.from(keywords).join(""));

export const keyFromObject = (obj: any, additionalStrings?: string[]) => {
    if (additionalStrings && Array.isArray(additionalStrings)) {
        return encode(
            additionalStrings.join("") +
                Object.keys(obj)
                    .map((k) => obj[k])
                    .join("")
        );
    }

    return encode(
        Object.keys(obj)
            .map((k) => obj[k])
            .join("")
    );
};

export const encode = (s: string | number | boolean) =>
    btoa(unescape(encodeURIComponent(s)));

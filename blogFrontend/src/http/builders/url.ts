export class UrlBuilder {
    private baseUrl: string;
    private params: Record<string, any> = {};

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    addParams(params: Record<string, any>): this {
        this.params = { ...this.params, ...params };
        return this;
    }

    build(): string {
        if (!this.params) return this.baseUrl;

        const queryString = Object.entries(this.params)
            .map(([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return `${this.baseUrl}${this.baseUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
}
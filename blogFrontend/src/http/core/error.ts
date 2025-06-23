export class httpError extends Error {
    constructor(
        public message: string,
        public status: number,
        public url: string,
        public meta?: any
    ) {
        super(message);
        this.name = 'HttpError';
    }
}
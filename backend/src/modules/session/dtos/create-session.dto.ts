export default class CreateSessionDto {
    constructor(
        public sessionName: string
    ) {}

    public static fromRequestBody(body: any): CreateSessionDto {
        if (!body || typeof body.sessionName !== 'string') {
            throw new Error('Invalid request body: sessionName is required and must be a string.');
        }

        return new CreateSessionDto(body.sessionName);
    }
}


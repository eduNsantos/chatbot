type SessionAgentConfigDto = {
    prompt: string
}

type SessionAgentUpsertDto = {
    id?: number;
    sessionId: string;
    name: string;
    config: SessionAgentConfigDto;
}

export type {
    SessionAgentUpsertDto,
    SessionAgentConfigDto
}

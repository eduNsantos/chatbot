import { makeSessionDependencies } from "./make-session-dependencies.js";

export default async function loadSessions() {
    const { whatsappGateway, sessionRepository, createSessionUseCase } = makeSessionDependencies();


    const sessions = await sessionRepository.findAll();

    if (sessions?.length === 0) {
        console.log('No sessions found. Creating default session "default".');


        createSessionUseCase.execute({ sessionName: 'default' }).catch(err => {
            console.error('Failed to create default session:', err);
        });

        return;
    }

    sessions.forEach(session => {
        if (!session.id) {
            console.warn(`Session with ID ${session.id} has no sessionId. Skipping.`);
            return;
        }

        whatsappGateway.createSession(session.id).catch(err => {
            console.error(`Failed to create session ${session.id}:`, err);
        });
    });
}

import { makeSessionDependencies } from "./make-session-dependencies.js";

export default async function loadSessions() {
    const { whatsappGateway } = makeSessionDependencies();
    const { sessionRepository } = makeSessionDependencies();

    const sessions = await sessionRepository.findAll();

    if (sessions?.length === 0) {
        console.log('No sessions found. Creating default session "default".');
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

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
        if (!session.sessionName) {
            console.warn(`Session with ID ${session.id} has no sessionName. Skipping.`);
            return;
        }

        whatsappGateway.createSession(session.sessionName).catch(err => {
            console.error(`Failed to create session ${session.sessionName}:`, err);
        });
    });
}

import { makeSessionDependencies } from "./make-session-dependencies.js";

export default function makeDefaultSession() {
    const { whatsappGateway } = makeSessionDependencies();

    whatsappGateway.createSession('default-session').catch(err => {
        console.error('Failed to create session:', err);
    });
}

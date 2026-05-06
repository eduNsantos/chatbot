import type { CreateMessage } from "./message.contract.js";

export default interface MessageRepositoryContract {
    createMessage(props: CreateMessage): Promise<void>;
}
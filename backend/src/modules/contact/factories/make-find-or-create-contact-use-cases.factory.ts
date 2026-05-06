import ContactRepository from "../infrastructure/respositories/contact.repository.js";
import FindOrCreateContactUseCase from "../use-cases/find-or-create-contact.use-case.js";

export default function makeFindOrCreateContactUseCase() {
    const contactRepository = new ContactRepository();

    const findOrCreateContactUseCase = new FindOrCreateContactUseCase(contactRepository);

    return findOrCreateContactUseCase;
}
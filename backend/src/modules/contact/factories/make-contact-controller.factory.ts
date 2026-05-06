import ContactController from "../controllers/contact.controller.js";
import ContactRepository from "../infrastructure/respositories/contact.repository.js";
import FindAllContactsUseCase from "../use-cases/find-all-contacts.use-case.js";
import FindOrCreateContactUseCase from "../use-cases/find-or-create-contact.use-case.js";

export default function makeContactController(): ContactController {
  const contactRepository = new ContactRepository();
  const findOrCreateContactUseCase = new FindOrCreateContactUseCase(contactRepository);
  const findAllContactsUseCase = new FindAllContactsUseCase(contactRepository);

  return new ContactController(findOrCreateContactUseCase, findAllContactsUseCase);
}

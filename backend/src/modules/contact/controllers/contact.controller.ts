export default class ContactController {
    constructor(
        private findOrCreateContactUseCase: any
    ) { }

    async findOrCreate(req: any, res: any) {
        try {
            const contact = await this.findOrCreateContactUseCase.execute(req.body);
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json({ error: 'Failed to find or create contact' });
        }
    }
}
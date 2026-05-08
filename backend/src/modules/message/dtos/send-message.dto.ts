export default class SendMessageDto {
  constructor(
    public sessionId: string,
    public to: string,
    public type: 'person' | 'group',
    public message: string,
    public name?: string,
  ) {}

}
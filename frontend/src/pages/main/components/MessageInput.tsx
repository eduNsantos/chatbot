import { useState } from "react";
import Button from "../../../components/Button";
import toastr from 'toastr';
import api from "../../../utils/api";

export default function MessageInput () {
    const [text, setText] = useState('');

    function handleSendMessage (){

        if (text.trim() === '') {
            toastr.info('O texto da mensagem não pode ser vazio!');
            return;
        }

        api.post('/sessions/337f3ccc-7f35-4463-a8b5-68ed79e2646b/message', {
            message: text,
            to: '5511954318786',
            type: 'person'
        })
        .then(() => {
            toastr.success('Mensagem enviada com sucesso!');
            setText('');
        })
        .catch(() => {
            toastr.error('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
        });
    }

    return (
        <div className="w-full">
            <input
                className="py-2 px-2 border border-gray-300 rounded-md w-9/12" placeholder="Digite o texto à ser enviado!"
                value={text}
                onChange={(e) => setText(e.target.value)}/>
            <Button className="w-3/12" color="blue" onClick={handleSendMessage}>Enviar mensagem</Button>
        </div>
    )
}
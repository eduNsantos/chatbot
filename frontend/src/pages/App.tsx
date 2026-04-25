import Button from "../components/Button";
import MessageInput from "./main/components/MessageInput";
import MessageList from "./main/components/MessageList";

export default function App () {
    return (
        <div className="w-8/12 mx-auto mt-10">
            <h2 className="mb-3">Controle de envio de mensagens</h2>

            <div className=" border border-gray-300 p-4 rounded-lg">
                <MessageList/>
                <MessageInput/>
            </div>
        </div>
    );
}
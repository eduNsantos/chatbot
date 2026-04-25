import { ButtonProps } from "./@types/types";

export default function Button(props: ButtonProps) {
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-700',
        red: 'bg-red-500 hover:bg-red-700',
        green: 'bg-green-500 hover:bg-green-700',
    };

    return (
        <button className={`b text-white px-3 py-2 font-medium shadow-amber-300 ${colorClasses[props.color]} ${props.className || ''}`} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
export interface ButtonProps {
    color: 'blue' | 'red' | 'green';
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}
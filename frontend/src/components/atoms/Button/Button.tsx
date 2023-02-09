interface IButton {
    children: React.ReactNode
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
}

export default function Button({...props}: IButton) {
    return (
        <button
            disabled={props.disabled}
            type={props.type}
            className={props.className}
        >
            {props.children}
        </button>
    )
}
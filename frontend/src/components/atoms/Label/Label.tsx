interface ILabel {
    children: React.ReactNode
    htmlFor: string
    className: string
}

export default function Label({...props}: ILabel) {
    return (
        <label
            htmlFor={props.htmlFor}
            className={props.className}
        >
            {props.children}
        </label>
    )
}

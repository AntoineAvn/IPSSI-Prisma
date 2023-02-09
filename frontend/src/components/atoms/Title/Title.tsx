interface ITitle {
    text: string,
    className: string,
}

export default function Title(props: ITitle) {
    return (
        <h1 className={props.className}>{props.text}</h1>
    )
}
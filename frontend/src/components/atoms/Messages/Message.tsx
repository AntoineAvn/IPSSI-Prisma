interface IMessage {
    text: string,
    className: string,
}

export default function Message(props: IMessage) {
    return (
        <p className={props.className}>{props.text}</p>
    )
}
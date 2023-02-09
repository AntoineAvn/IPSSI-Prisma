interface IInput {
    type: string,
    id: string,
    value: string,
    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className: string,
}

export default function Input(props: IInput) {
    return (
        <input
            type={props.type}
            id={props.id}
            value={props.value}
            onKeyUp={props.onKeyUp}
            onChange={props.onChange}
            className={props.className}
        />
    )
}
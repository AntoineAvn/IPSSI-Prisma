import { Button } from "../../atoms"

interface IForm {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    children: React.ReactNode
}

export default function Form({...props}: IForm) {

    
    return (
        <form onSubmit={props.onSubmit}>
            {props.children}
        </form>
    )
}
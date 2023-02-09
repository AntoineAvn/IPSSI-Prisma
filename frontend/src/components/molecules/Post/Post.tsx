import { IPost } from '../../../types/model';
import { Message, Title } from '../../atoms';
import "../../../index.css"

export default function Post(props: IPost) {

    return (
        <div className={props.className}>
            <Title 
            text={props.title} 
            className="" />
        </div>
    )
}

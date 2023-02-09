import { useState } from "react";
import { Button, Input, Label } from "../../components/atoms";
import Form from "../../components/molecules";

interface IData {
    token: string;
    error: string;
}

export default function SignUp() {

    const [name , setName] = useState('')
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')

    const validateForm = name.length > 0 && username.length > 0 && password.length > 0 && password.length > 8

    const isValidate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.currentTarget.value.length > 0 ? e.currentTarget.style.border = '2px solid green' : e.currentTarget.style.border = '2px solid red'
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const request = await fetch('http://localhost:1234/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "username" : username,
                    "password" : password
                })
            })

            const { token } = await request.json() as { token: IData }
            if(token.error) {
                alert(token.error)
                return
            }
            localStorage.setItem('token', token.token)
            window.location.href = '/dashboard'
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Form 
        onSubmit={ async (event: React.FormEvent<HTMLFormElement>): Promise<void>  =>{
            await handleSubmit(event)
        } } 
        >
            <Label 
            htmlFor="name"
            className="">
                Name
            </Label>
            <Input 
            type="text"
            className=""
            id="name"
            value={name}
            onChange={(e) => {
                setName(e.currentTarget.value)
            }}
            onKeyUp={(e) => {
                isValidate(e)
            }}/>
            <Label
            htmlFor="username"
            className="">
                Username
            </Label>
            <Input
            type="text"
            className=""
            id="username"
            value={username}
            onChange={(e) => {
                setUsername(e.currentTarget.value)
            }}
            onKeyUp={(e) => {
                isValidate(e)
            }}/>
            <Label
            htmlFor="password"
            className="">
                Password
            </Label>
            <Input
            type="password"
            className=""
            id="password"
            value={password}
            onChange={(e) => {
                setPassword(e.currentTarget.value)
            }}
            onKeyUp={(e) => {
                isValidate(e)
            }}/>

            <Button
                type="submit"
                className=""
                disabled={!validateForm}>
                Submit
            </Button>

        </Form>
    )
}
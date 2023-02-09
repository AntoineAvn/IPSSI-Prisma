
import { useState } from "react";
import { Button, Input, Label } from "../../components/atoms";
import Form from "../../components/molecules";
import "../../index.css"

interface IData {
    token: string;
    error: string;
}

export default function SignIn() {

    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')

    const validateForm = username.length > 0 && password.length > 0 && password.length > 8

    const isValidate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.currentTarget.value.length > 0 ? e.currentTarget.style.border = '2px solid green' : e.currentTarget.style.border = '2px solid red'
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const request = await fetch('http://localhost:1234/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username" : username,
                    "password" : password
                })
            })
            const { data } = await request.json() as { data: IData }
            if(data.error) {
                alert(data.error)
                return
            }
            if(localStorage.getItem('token')) {
                localStorage.removeItem('token')
            }
            localStorage.setItem('token', data.token)
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
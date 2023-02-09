import './index.css'  
import { useEffect, useState } from 'react'

interface IData {
  token: string
}

function App() {

  const [name , setName] = useState('')
  const [username , setUsername] = useState('')
  const [password , setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const dataForm = {
      "name" : name,
      "username" : username,
      "password" :password
    }

    fetch('http://localhost:1234/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      localStorage.setItem('token', data.token)
      window.location.href = '/dashboard'
    })
  }

  const validateForm = name.length > 0 && username.length > 0 && password.length > 0 && password.length > 8 

  return (
    <div className=' '>
      <form onSubmit={(e) => {
          handleSubmit(e)
      }}
      className=" flex flex-col justify-center m-auto align-middle">
        <label htmlFor="name">Name</label>
        <input onKeyUp={(e) => {
          e.currentTarget.value.length > 0 ? e.currentTarget.style.border = '2px solid green' : e.currentTarget.style.border = '2px solid red'
        }}  
        onChange={(e) => 
          setName(e.currentTarget.value)
        }
        type="text" id="name" 
        style={
          {border: '2px solid red'}
        }
        value={name}
        className=""
        />
        <label htmlFor="email">Username</label>
        <input onKeyUp={(e) => {
          e.currentTarget.value.length > 0 ? e.currentTarget.style.border = '2px solid green' : e.currentTarget.style.border = '2px solid red'
        }} onChange={(e) => {
          setUsername(e.currentTarget.value)
        }} type="text" id="username" 
        style={
          {border: '2px solid red'}
        }
        value={username}/>
        <label htmlFor="password">Password</label>
        <input onInput={(e) => {
          e.currentTarget.value.length > 0 && e.currentTarget.value.length > 8 ? e.currentTarget.style.border = '2px solid green' : e.currentTarget.style.border = '2px solid red'
        }} onChange={(e) => {
          setPassword(e.currentTarget.value)
        }}
        type="password" id="password" 
        style={
          {border: '2px solid red'}
        }
        value={password}
        />
        <button disabled={!validateForm} type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App

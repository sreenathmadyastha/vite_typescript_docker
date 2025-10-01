import { useEffect, useState } from 'react'

function App() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('/api/message')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
    }, [])

    return (
        <div>
            <h1>Welcome to My App</h1>
            <p>Message from server: {message}</p>
        </div>
    )
}

export default App
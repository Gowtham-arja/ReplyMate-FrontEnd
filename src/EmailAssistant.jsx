import { useState } from 'react'

function EmailAssistant() {
    const [emailContent, setEmailContent] = useState('')
    const [tone, setTone] = useState('professional')
    const [generatedEmail, setGeneratedEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!emailContent.trim()) {
            setError('Please enter email content before generating.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('https://replymate-backend-k8uu.onrender.com/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent,
                    tone,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch generated email')
            }

            const data = await response.text()
            setGeneratedEmail(data)
        } catch (err) {
            setError('Failed to generate email reply. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        if (!generatedEmail) return
        try {
            await navigator.clipboard.writeText(generatedEmail)
            console.log('Generated email copied to clipboard')
        } catch (error) {
            console.error('Copy failed:', error)
        }
    }

    return (
        <div className='bg-gray-800 h-screen w-screen flex items-center justify-center overflow-hidden'>
            <div className='bg-gray-700 h-screen w-full max-w-6xl rounded-lg p-6 overflow-y-auto flex flex-col no-scrollbar'>
                <h1 className="text-3xl font-bold underline">
                    Email Generator Assistant
                </h1>
                
                <div className='mt-6'>
                    <label htmlFor="emailContent" className='block text-white text-sm font-semibold mb-2'>
                        Enter email content : 
                    </label>
                    <textarea 
                        name="emailContent" 
                        id="emailContent"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className='p-2 h-60 bg-blue-200 w-full resize-none rounded-lg overflow-y-auto no-scrollbar' 
                    ></textarea>
                </div>

                <div className='mt-6'>
                    <label htmlFor="tone" className='block text-white text-sm font-semibold mb-2'>
                        Tone : 
                    </label>
                    <select 
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className='p-2 bg-blue-200 w-full rounded-lg'
                    >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="apologetic">Apologetic</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="humorous">Humorous</option>
                    </select>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className='mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer w-fit'
                >
                    {loading ? 'Generating...' : 'Generate Reply'}
                </button>

                {error && (
                    <p className='mt-4 text-sm text-red-300'>{error}</p>
                )}

                {generatedEmail && (
                    <div className='relative mt-8 p-4 bg-gray-600 rounded-lg border border-blue-400 w-full'>
                        <h2 className='text-xl font-semibold text-white mb-3'>Generated Reply:</h2>
                        <div className='bg-blue-100 p-4 rounded max-h-64 overflow-y-auto no-scrollbar'>
                            <p className='text-gray-800 whitespace-pre-wrap break-words'>{generatedEmail}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition hover:cursor-pointer w-fit' 
                        >
                            Copy
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
} 

export default EmailAssistant

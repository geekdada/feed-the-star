import Head from 'next/head'
import { useState } from 'react'

export default function IndexPage() {
  const [repoName, setRepoName] = useState('')
  const onSubmit = () => {
    if (repoName.trim()) {
      setRepoName('')
      window.open(`/api/${repoName.trim()}/rss`)
    }
  }

  return (
    <>
      <Head>
        <title>🌟 Feed the Star</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col justify-center items-center w-full h-full ">
        <h1 className="text-xl">🌟 Feed the Star</h1>
        <form
          className="input-wrapper flex flex-col items-center mt-3 w-full space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSubmit()
          }}
        >
          <input
            type="text"
            autoComplete={'off'}
            autoCapitalize={'off'}
            autoCorrect={'off'}
            required
            id="username"
            placeholder="Enter GitHub username here"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-indigo-500/50 focus:outline-none"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 text-sm font-light	">
          You can subscribe my star feed{' '}
          <a
            className="underline decoration-wavy"
            href="/api/geekdada/rss"
            target="__blank"
          >
            here
          </a>
          !
        </p>
      </div>
    </>
  )
}

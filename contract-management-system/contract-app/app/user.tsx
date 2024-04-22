'use client'

import { useSession } from 'next-auth/react'

// Use this function to display the user data on the page.
// You can also receive user data from the server.
export const User = () => {
  const { data: session } = useSession()
  console.log('Client Session', session)
  return <pre>{JSON.stringify(session)}</pre>
}

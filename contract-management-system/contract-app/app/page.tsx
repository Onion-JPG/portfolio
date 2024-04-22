import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from './auth'
import { User } from './user'
import { redirect } from 'next/navigation'

export default async function Home() {
  // If the session is invalid send the user to the login page
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  } else {
    redirect('/dashboard')
  }

  return (
    <main>
      <LoginButton />
      <LogoutButton />
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client Call</h2>
      <User />
    </main>
  )
}

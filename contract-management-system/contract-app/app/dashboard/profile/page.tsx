import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation'
import Link from "next/link";
import { Session } from "next-auth";

export async function getAccount(session : Session) {
  var id
  if (!session) {
    redirect('/api/auth/signin')
  } else {
    id = parseInt((session as any).user.id)
  } 

  const account = await prisma.account.findFirst({
    where: {
      userID: id
    },
  });

  return {
    account
  }
}

export default async function Profile() {
  const session : any = await getServerSession(authOptions);
  const accountInfo = await getAccount((session as any));

  return (
    <main className="m-10">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            User Profile
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            <strong>Username:</strong> {accountInfo.account?.username || 'N/A'}<br/>
            <strong>Name:</strong> {accountInfo.account?.firstName + " " + accountInfo.account?.lastName}<br/>
            <strong>Email:</strong> {accountInfo.account?.email || 'N/A'}<br/>
            <strong>Account Type:</strong> {accountInfo.account?.accountType || 'N/A'}
          </div>
        </div>
      </div>
      {session?.user?.accountType === 'Admin' && (
          <div className="mt-4">
           <h1 className="title has-text-centered">Admin Only Control Panel</h1>
            <Link href={"/dashboard/profile/create"} className="card-footer-item button is-primary m-3">
              Create New User Account
            </Link>
            <Link href={"/dashboard/profile/edit"} className="card-footer-item button is-primary m-3">
              Edit/Remove Account
            </Link>
          </div>
        )}
    </main>
  );
}

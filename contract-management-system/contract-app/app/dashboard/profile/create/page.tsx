'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountType } from '@prisma/client';

export default function Create() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();

    // FormData to handle file upload
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('accountType', accountType);
    formData.append('isInternal', isInternal.toString());
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);

    // Fetch API to send the request to your API route
    const response = await fetch('/api/create-account', {
      method: 'POST',
      body: formData,
    });

    // Handle response from the server
    if (response.ok) {
      // Handle success
      console.log(await response.json())
      router.push(`/dashboard/profile`);
    } else {
      console.log(response.status)
    }
  }

  return (
    <main>
      <div className='mb-5'>
        <h1 className="title">Create Account</h1>
        <h2 className="subtitle">
          Enter all of the information for a new account
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Username and Password on the same line */}
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label" htmlFor="username">Username</label>
              <div className="control">
                <input className="input" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <div className="control">
                <input className="input" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </div>
        </div>

        {/* First Name and Last Name on the same line */}
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label" htmlFor="firstName">First Name</label>
              <div className="control">
                <input className="input" type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label" htmlFor="lastName">Last Name</label>
              <div className="control">
                <input className="input" type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
          </div>
        </div>

        {/* Remaining fields */}
        <div className="field">
          <label className="label" htmlFor="accountType">Account Type</label>
          <div className="control">
            <div className="select">
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                required
              >
                <option value="">Select Account Type</option>
                {Object.values(AccountType).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="checkbox" htmlFor="isInternal">Is Internal</label>
          <div className="control">
            <input type="checkbox" id="isInternal" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <div className="control">
            <input className="input" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="control">
          <button className="button is-primary" type="submit">Create Account</button>
        </div>
      </form>
    </main>
  );
}

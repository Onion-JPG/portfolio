'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export async function getAccounts(userID: number) {
    // FormData to handle file upload
    const formData = new FormData();
    formData.append('userID', userID.toString());

    // Fetch API to send the request to your API route
    const response = await fetch('/api/get-account', {
        method: 'POST',
        body: formData,
    });

    // Handle response from the server
    if (response.ok) {
        return await response.json()
    } else {
        console.log(response.status)
    }
}

export default function Create({ params }: any) {
    const userID = params.id;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tempWorkflowInfo = await getAccounts(params.id);
                if (tempWorkflowInfo && tempWorkflowInfo['data'] && tempWorkflowInfo['data'].length > 0) {
                    const account = tempWorkflowInfo['data'][0]; // Assuming you want to fill with the first account's info
                    setUsername(account.username);
                    setPassword(account.password); // Note: It's generally unsafe to handle passwords this way
                    setAccountType(account.accountType);
                    setIsInternal(account.isInternal);
                    setFirstName(account.firstName);
                    setLastName(account.lastName);
                    setEmail(account.email);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]); // Ensure the effect runs again if params.id changes

    const router = useRouter();
    async function handleSubmit(e: any) {
        e.preventDefault();

        // FormData to handle file upload
        const formData = new FormData();
        formData.append('userID', userID);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('accountType', accountType);
        formData.append('isInternal', isInternal.toString());
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);

        // Fetch API to send the request to your API route
        const response = await fetch('/api/edit-account', {
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

    async function handleSubmitRemove(e: any) {
        e.preventDefault();

        // FormData to handle file upload
        const formData = new FormData();
        formData.append('userID', userID);

        // Fetch API to send the request to your API route
        const response = await fetch('/api/remove-account', {
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
            {loading ? (
                <p> Loading... </p>
            ) : (
                <div className="m-10">
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
                                <input className="input" type="text" id="accountType" value={accountType} onChange={(e) => setAccountType(e.target.value)} required />
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

                        <div className="control mt-4">
                            <button className="button is-primary" type="submit">Submit Account Changes</button>
                        </div>
                    </form>
                    <form onSubmit={handleSubmitRemove}>
                        <button className="button is-danger mt-4" type="submit">Remove Account</button>
                    </form>
                </div>
            )}
        </main>
    );
}

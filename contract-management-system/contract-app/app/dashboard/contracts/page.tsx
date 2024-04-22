'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export async function getContracts(docID: number) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('id', docID.toString());
	formData.append('searchUser', 'false');

	// Fetch API to send the request to your API route
	const response = await fetch('/api/get-contracts', {
		method: 'POST',
		body: formData,
	});

	// Handle response from the server
	if (response.ok) {
		return await response.json();
	} else {
		console.log(response.status);
	}
}

export default function ContractsPage() {
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');
	const [documents, SetDocuments] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tempDocInfo = await getContracts(-1);
				SetDocuments(tempDocInfo['data']);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredDocuments = query
		? documents.filter(
				(document: any) =>
					document.DocumentMetadata[0]?.docName.toLowerCase().includes(query.toLowerCase()) ||
					document.ownerID.toString().includes(query.toLowerCase())
		  )
		: documents;

	const router = useRouter();
	const handleRowClick = (docID: number) => {
		router.push(`/dashboard/contracts/${docID}`);
	};

	return (
		<div>
			{loading ? (
				<p> Loading... </p>
			) : (
				<div>
					<div>
						<h1 className="title">Contracts</h1>
						<h2 className="subtitle">List of all contracts contained within the app</h2>
						<a href="contracts/create">
							<button className="button is-primary my-3">Create New Contract</button>
						</a>
						{/* Render contracts in a table [*/}
						<p className="control has-icons-left">
							{
								<input
									className="input"
									type="text"
									placeholder="Search by Document Name or Owner ID..."
									value={query}
									onChange={(e) => setQuery(e.target.value)}
								/>
							}
							<span className="icon is-small is-left">
								<i className="fas fa-search"></i>
							</span>
						</p>
						<table className="table is-striped is-fullwidth">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Company</th>
									<th>Type</th>
									<th>Owner ID</th>
								</tr>
							</thead>
							<tbody>
								{filteredDocuments.map((document) => (
                                    <tr key={document.docID} onClick={() => handleRowClick(document.docID)} style={{ cursor: 'pointer' }}>
                                        <td>{document.docID}</td>
										<td>{document.DocumentMetadata[0]?.docName}</td>
										<td>{document.DocumentMetadata[0]?.companyName}</td>
										<td>{document.docType}</td>
										<td>{document.ownerID}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export async function getWorkflows(workflowID: number) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('id', workflowID.toString());
    formData.append('searchUser', "false");

	// Fetch API to send the request to your API route
	const response = await fetch('/api/get-workflow', {
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

export default function workflowsPage() {
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');
	const [workflows, setWorkflows] = useState([]);
	const Step = ['NDA', 'Master Service Agreement', 'Working Agreement', 'Finished'];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tempWorkflowInfo = await getWorkflows(-1);
				setWorkflows(tempWorkflowInfo['data']);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredWorkflows = query
		? workflows.filter(
				(workflow: any) =>
					workflow.workflowName.toLowerCase().includes(query.toLowerCase()) || workflow.ownerID.toString().includes(query.toLowerCase())
		  )
		: workflows;

	const router = useRouter();
	const handleRowClick = (workflowId: number) => {
		router.push(`/dashboard/workflows/${workflowId}`);
	};

	const getStatus = (inReview: boolean) => {
		if (inReview) {
			return 'In review';
		} else {
			return 'Waiting for Document Finalization';
		}
	};

	return (
		<div>
			{loading ? (
				<p> Loading... </p>
			) : (
				<div>
					<div>
						<h1 className="title">Workflows</h1>
						<h2 className="subtitle">All current contract workflows</h2>
					</div>
					<Link href="/dashboard/workflows/create">
						<button className="button is-primary my-5">Create New Workflow</button>
					</Link>
					<div className="workflows">
						<div className="field">
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
						</div>
						<table className="table is-striped is-fullwidth">
							<thead>
								<tr>
									<th>Workflow Title</th>
									<th>Step</th>
									<th>Status</th>
									<th>Owner ID</th>
								</tr>
							</thead>
							<tbody>
								{filteredWorkflows.map((workflow: any) => (
									<tr key={workflow.workflowID} onClick={() => handleRowClick(workflow.workflowID)} style={{ cursor: 'pointer' }}>
										{' '}
										<td>{workflow.workflowName}</td>
										<td>{Step[workflow.workflowStatus - 1]}</td>
										<td>{getStatus(workflow.inReview)}</td>
										<td>{workflow.ownerID}</td>
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

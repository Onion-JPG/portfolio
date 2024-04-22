'use client'

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { useState, useEffect } from 'react';

export async function getContracts(docID: number) {
    // FormData to handle file upload
    const formData = new FormData();
    formData.append('id', docID.toString());
	formData.append('searchUser', "true");

    // Fetch API to send the request to your API route
    const response = await fetch('/api/get-contracts', {
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

export async function getWorkflows(workflowID: number) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('id', workflowID.toString());
	formData.append('searchUser', "true");

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

export default function Home() {
	const Step = ['NDA', 'Master Service Agreement', 'Working Agreement', 'Finished'];
	const [loading, setLoading] = useState(true);
	const [notification, setNotification] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isManager, setIsManager] = useState(false);
    const [documents, SetDocuments] = useState([]);
	const [workflows, setWorkflows] = useState([]);
	const [inactive, setInactive] = useState<string[]>([]);

	const { data: session } = useSession()

	useEffect(() => {
        const fetchData = async () => {
            try {
				if (session) {
					setIsAdmin((session as any).user.accountType == 'Admin');
					setIsManager((session as any).user.accountType == 'Manager');
					
					const tempDocInfo = await getContracts(session?.user?.id);
					SetDocuments(tempDocInfo['data']);
					const tempWorkflowInfo = await getWorkflows(session?.user?.id);
					setWorkflows(tempWorkflowInfo['data']);

					const tempInactive = tempWorkflowInfo.data.filter((workflow) => {
						if(workflow.workflowStatus != 4){
							const inactiveBool = checkDate(workflow.lastChange);
							if (inactiveBool) setNotification(true);
							return inactiveBool
						}
                    });
                    const inactiveWorkflowNames = tempInactive.map((workflow) => workflow.workflowName);
                    setInactive(inactiveWorkflowNames);
					
				}  
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [session]);

	const hideNotification = () => {
		setNotification(!notification);
	}

	const router = useRouter();

	const handleWorkflowRowClick = (workflowId: number) => {
		router.push(`/dashboard/workflows/${workflowId}`);
	};

	const handleDocRowClick = (docID: number) => {
		router.push(`/dashboard/contracts/${docID}`);
	};

	const checkDate = (dateString: string) => {
		const changeDate = new Date(dateString);
		const currentDate = new Date();
		const diff = currentDate.getTime() - changeDate.getTime();
		const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
		if (dayDiff > 7) {
			return true;
		}
	}

	return (
		<div>
			{loading ? (
				<p> Loading... </p>
			) : (
				<div>
					<div>
						<h1 className="title">Contract Managment App</h1>
						<h2 className="subtitle">Streamline Your Operations with Contract Management Software</h2>
						<p>
							In today's fast-paced business landscape, efficient contract management is the key to success. Say goodbye to manual paperwork,
							missed deadlines, and costly errors. Welcome to the future of contract management with our cutting-edge Contract Management
							Software.
						</p>
						<p>
							Our Contract Management Software is a powerful and user-friendly solution designed to simplify the entire contract lifecycle, from
							creation and negotiation to execution and renewal. It's the ultimate tool for organizations of all sizes and industries, offering
							unparalleled control, visibility, and compliance.
						</p>
					</div>
					<div className="pt-6">
						<h2 className="subtitle">Your Queues</h2>
						{!isAdmin && !isManager && (
							<div>
								<h3 className="strong">Workflows</h3>
								<table className="table">
									<thead>
										<tr>
											<th>Workflow ID</th>
											<th>Workflow Name</th>
											<th>Status</th>
											<th>In Review</th>
											<th>Last Edited</th>
										</tr>
									</thead>
									<tbody>
										{workflows.map((workflow) => (
											<tr key={workflow.workflowID} onClick={() => handleWorkflowRowClick(workflow.workflowID)} style={{ cursor: 'pointer' }}>
												<td>{workflow.workflowID}</td>
												<td>{workflow.workflowName}</td>
												<td>{Step[workflow.workflowStatus - 1]}</td>
												<td>{workflow.inReview.toString()}</td>
												<td>{(new Date(workflow.lastChange)).toDateString()}</td>
											</tr>
										))}
									</tbody>
								</table>
								<h3 className="strong">Documents</h3>
								<table className="table">
									<thead>
										<tr>
											<th>Document Name</th>
											<th>Document Type</th>
											<th>Company Name</th>
											<th>Status</th>
											<th>Last Edited</th>
										</tr>
									</thead>
									<tbody>
										{documents.map((doc) => (
											<tr key={doc.docID} onClick={() => handleDocRowClick(doc.docID)} style={{ cursor: 'pointer' }}>
												<td>{doc.DocumentMetadata[0]?.docName}</td>
												<td>{doc.docType}</td>
												<td>{doc.DocumentMetadata[0]?.companyName}</td>
												<td>{doc.UserQueue[0]?.queueStatus}</td>
												<td>{(new Date(doc.DocumentHistory[0]?.changeDate)).toDateString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
					<div>
						<div className={notification ? 'modal is-active' : 'modal'}>
							<div className="modal-background">
								<div className="modal-content has-background-white mt-6 mx-auto">
									<div className="box">
										<p>This is a notification that the following workflows have been inactive for more than 7 days</p>
										<br></br>
										{inactive.map((workflow) => (
											<p>{workflow}</p>
										))}
									</div>
								</div>
								<button className="modal-close is-large" aria-label="close" onClick={hideNotification}></button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

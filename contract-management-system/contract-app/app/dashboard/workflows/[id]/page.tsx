'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import build from 'next/dist/build';

// import { Resend } from 'resend';
// const resend = new Resend('re_NhpNQVj8_BpsHVT8nmF2HLHoZs6K8UZKM');

export async function updateStatus(index: number, workflowID: number, newAssign: number) {
	const indexString = index.toString();
	const workflowIDString = workflowID.toString();
	const newAssignString = newAssign.toString();

	// FormData to handle file upload
	const formData = new FormData();
	formData.append('workflowID', workflowIDString);
	formData.append('index', indexString);
	formData.append('newAssign', newAssignString);

	// Fetch API to send the request to your API route
	const response = await fetch('/api/update-workflow-status', {
		method: 'POST',
		body: formData,
	});

	// Handle response from the server
	if (response.ok) {
		// Handle success
		console.log(await response.json());
	} else {
		console.log(response.status);
	}
}

export async function updateReview(inReview: boolean, workflowID: number, newAssign: number) {
	const workflowIDString = workflowID.toString();
	const newAssignString = newAssign.toString();

	// FormData to handle file upload
	const formData = new FormData();
	formData.append('workflowID', workflowIDString);
	formData.append('newAssign', newAssignString);
	formData.append('inReview', inReview.toString());

	// Fetch API to send the request to your API route
	const response = await fetch('/api/update-workflow-review-status', {
		method: 'POST',
		body: formData,
	});

	// Handle response from the server
	if (response.ok) {
		// Handle success
		console.log(await response.json());
	} else {
		console.log(response.status);
	}
}

export async function getWorkflows(workflowID: number) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('id', workflowID.toString());

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

export async function getAssignableUsers() {
	const formData = new FormData();
	const response = await fetch('/api/get-users', {
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

export default function ContractsPage(data: any) {
	const [loading, setLoading] = useState(true);
	const [workflowInfo, setWorkflowInfo] = useState([]);
	const [currentContract, setCurrentContract] = useState(0);
	const [workflowIndex, setWorkflowIndex] = useState(0);
	const [assignableUsers, setAssignableUsers] = useState([]);
	const [newAssign, setNewAssign] = useState(0);
	const [contracts, setContracts] = useState([
		{name: 'NDA', completed: false },
		{name: 'Master Service Agreement', completed: false },
		{name: 'Working Agreement', completed: false },
		{name: 'Finished', completed: false },
	]);
	var hasBuilt = false;

	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			try {

				const tempWorkflowInfo = await getWorkflows(data.params.id);

				setWorkflowInfo(tempWorkflowInfo);
				setCurrentContract(tempWorkflowInfo.data[0].workflowStatus - 1);
				setWorkflowIndex(tempWorkflowInfo.data[0].workflowStatus - 1);

				BuildWorkflow(tempWorkflowInfo.data[0].workflowSetup, tempWorkflowInfo.data[0].workflowStatus - 1, tempWorkflowInfo);
			
				const tempUserInfo = await getAssignableUsers();
				setAssignableUsers(tempUserInfo['data']);
				
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const BuildWorkflow = (buildString: string, workflowIndex: number, workflowInfo: any) => {
		if (!hasBuilt) {
			const buildContracts = [];

			for (let i = 0; i < buildString.length; i++) {
				let docType = buildString.charAt(i)
				let isCompleted = false;
				if (i - 1 < workflowIndex - 1) {						
					if (workflowInfo) {
						isCompleted = true;
					}
				}

				switch (docType) {
					case 'n':
						buildContracts.push({ name: "NDA", completed: isCompleted });
						break;
					case 'm':
						buildContracts.push({ name: "Master Service Agreement", completed: isCompleted });
						break;
					case 'w':
						buildContracts.push({ name: "Working Agreement", completed: isCompleted });
						break;
					case 'x':
						buildContracts.push({ name: "Document 1", completed: isCompleted });
						break;
					case 'y':
						buildContracts.push({ name: "Document 2", completed: isCompleted });
						break;
					case 'f':
						buildContracts.push({ name: "Finished", completed: isCompleted });
						break;
				}
			}
			setContracts(buildContracts);
			hasBuilt = true;
		}
	}

	const print = () => {
		console.log(contracts)
	}

	// Function to mark a contract as completed and allow moving to the next one
	const completeContract = (index: number) => {
		const newContracts = contracts.map((contract, i) => {
			if (i === index) {
				return { ...contract, completed: true };
			}
			return contract;
		});

		setContracts(newContracts);
		if (index + 1 < contracts.length) {
			setCurrentContract(index + 1);
			setWorkflowIndex(currentContract);
		}
		updateStatus(workflowInfo['data'][0].workflowStatus + 1, workflowInfo.data[0].workflowID, newAssign);
		router.push('../');
	};

	const sendToReview = (index: number) => {
		updateReview(workflowInfo['data'][0].inReview, workflowInfo['data'][0].workflowID, newAssign);
		router.push('../');
	};

	return (
		<div>
			{loading ? (
				<p> Loading... </p>
			) : (
				<div>
					<div>
						<h1 className="title">{workflowInfo['data'][0].workflowName} Contracts</h1>
					</div>
					<div className="tabs is-boxed">
						<ul>
							{contracts.map((contract, index) => (
								<li
									key={contract.id}
									className={index === currentContract ? 'is-active' : ''}
									onClick={() => index <= workflowIndex && setCurrentContract(index)}>
									<a>
										{/* <span>{index + ' ' + currentContract + ' ' + workflowIndex + ' ' + contract.name}</span> */}
										<span>{contract.name}</span>
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className="content">
						{!workflowInfo['data'][0]['Document'][currentContract] && <h2>{contracts[currentContract].name}</h2>}

						{workflowInfo['data'][0]['Document'][currentContract] && (
							<h2>{workflowInfo['data'][0]['Document'][currentContract].fileName}</h2>
						)}
						{currentContract == contracts.length-1 && <p> The workflow is finished! </p>}
						{currentContract != contracts.length-1 && (
							<div>
								<p>
									This is the content for the {contracts[currentContract].name}. Complete this contract to proceed to the next one.
								</p>

								{workflowInfo['data'][0]['Document'][currentContract] && (
									<iframe
										src={'/contractFiles/' + workflowInfo['data'][0]['Document'][currentContract].fileName + '.pdf'}
										width="100%"
										height="500px"
									/>
								)}
								{!workflowInfo['data'][0]['Document'][currentContract] && (
									<div>
										<p>There is currently no document for this step in the workflow</p>
										<a href="/dashboard/contracts/create">
											<button className="button is-link is-primary">Upload a Document</button>
										</a>
									</div>
								)}
								{!contracts[currentContract].completed &&
									workflowInfo['data'][0]['Document'][currentContract] &&
									currentContract == workflowIndex &&
									session?.user?.id == workflowInfo['data'][0].ownerID && (
										<div className="field">
											<label className="label">Assigned User</label>
											<div className="select">
												<select onChange={(e) => setNewAssign(parseInt(e.target.value))}>
													<option></option>
													{assignableUsers.map((userID: any) => (
														<option key={userID.userID} value={userID.userID}>
															{userID.lastName + ' , ' + userID.firstName + ', id:' + userID.userID}
														</option>
													))}
												</select>
											</div>
										</div>
									)}
								{!contracts[currentContract].completed &&
									!workflowInfo['data'][0].inReview &&
									workflowInfo['data'][0]['Document'][currentContract] &&
									currentContract == workflowIndex &&
									session?.user?.id == workflowInfo['data'][0].ownerID && (
										<button className="button is-primary mt-5" onClick={() => sendToReview(currentContract)}>
											Send to next user for review
										</button>
									)}
								{!contracts[currentContract].completed &&
									workflowInfo['data'][0].inReview &&
									currentContract == workflowIndex &&
									session?.user?.id == workflowInfo['data'][0].ownerID && (
										<button className="button is-primary mt-5" onClick={() => completeContract(currentContract)}>
											Approve and send to next user
										</button>
									)}
							</div>
						)}
					</div>
					<div>
						{!contracts[currentContract].completed && session?.user?.accountType == 'Admin' && (
							<button className="button is-primary">Override Step</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

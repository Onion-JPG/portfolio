'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import 'bulma/css/bulma.min.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';

export async function CreateContract(
	ownerID: string,
	documentName: string,
	companyName: string,
	docType: string,
	startDate: string,
	endDate: string,
	renewalType: string,
	workflowToAdd: string,
	addToWorkflow: string,
	uploadedContract: File
) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('documentName', documentName);
	formData.append('companyName', companyName);
	formData.append('ownerId', ownerID);
	formData.append('docType', docType);
	formData.append('startDate', startDate);
	formData.append('endDate', endDate);
	formData.append('renewalType', renewalType);
	formData.append('workflowID', workflowToAdd);
	formData.append('addToWorkflow', addToWorkflow);
	formData.append('uploadedContract', uploadedContract);

	// Fetch API to send the request to your API route
	const response = await fetch('/api/create-contract', {
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

export async function GetUserIDs() {
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

export async function GetWorkflows() {
	const formData = new FormData();
	formData.append('id', '-1');

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

export async function GetCompanies() {
	const formData = new FormData();
	const response = await fetch('/api/get-companies', {
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

export default function CreateContractsPage() {
	const [documentName, setDocumentName] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [documentType, setDocumentType] = useState('NDA');
	const [renewalType, setRenewalType] = useState('');
	const [uploadedContract, setUploadedContract] = useState<File>();
	const [ownerID, setOwnerID] = useState('');
	const [addToWorkflow, setAddToWorkflow] = useState(Boolean);
	const [workflowToAdd, setWorkflowToAdd] = useState('');

	const [userIDs, setUserIDs] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [workflows, setWorkflows] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const tempUserIDInfo = await GetUserIDs();
				setUserIDs(tempUserIDInfo['data']);
				const tempCompaniesInfo = await GetCompanies();
				setCompanies(tempCompaniesInfo['data']);
				const tempWorkflowsInfo = await GetWorkflows();

                const acceptingNewWorkflows = tempWorkflowsInfo.data.filter(workflow => workflow.acceptingNew === true);
                setWorkflows(acceptingNewWorkflows);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	const handleFileChange = (event: any) => {
		setUploadedContract(event.target.files[0]);
	};

	const router = useRouter();
	const handleSubmit = async (event: any) => {
		if (!uploadedContract) return;
		event.preventDefault();
		await CreateContract(
			ownerID,
			documentName,
			companyName,
			documentType,
			startDate,
			endDate,
			renewalType,
			workflowToAdd,
			addToWorkflow.toString(),
			uploadedContract
		);
		router.push('../');
	};

	return (
		<main>
			<form className="form" onSubmit={handleSubmit}>
				<div className="field">
					<label className="label">Document Name</label>
					<div className="control">
						<input
							className="input"
							type="text"
							placeholder="Enter Document Name"
							value={documentName}
							onChange={(e) => setDocumentName(e.target.value)}
						/>
					</div>
				</div>

				<div className="field">
					<label className="label">Company Name</label>
					<div className="select">
						<select onChange={(e) => setCompanyName(e.target.value)}>
							<option></option>
							{companies.map((company: any) => (
								<option key={company.entityID} value={company.entityName}>
									{company.entityName}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="field">
					<label className="label">Assigned User</label>
					<div className="select">
						<select onChange={(e) => setOwnerID(e.target.value)}>
							<option></option>
							{userIDs.map((user: any) => (
								<option key={user.userID} value={user.userID}>
									{user.lastName + ' , ' + user.firstName + ', id:' + user.userID}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="field">
					<label className="label">Start Date</label>
					<div className="control">
						<div className="date">
							<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
						</div>
					</div>
				</div>

				<div className="field">
					<label className="label">End Date</label>
					<div className="control">
						<div className="date">
							<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
						</div>
					</div>
				</div>

				<div className="field">
					<label className="label">Document Type</label>
					<div className="control">
						<div className="select">
							<select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
								<option value="NDA">NDA</option>
								<option value="MasterServiceAgreement">Master Service Agreement</option>
								<option value="WorkingAgreement">Working Agreement</option>
								{/* Add more document types as needed */}
							</select>
						</div>
					</div>
				</div>

				<div className="field">
					<label className="label">Auto renewal</label>
					<div className="control">
						<input type="checkbox" onChange={(e) => setRenewalType(e.target.checked.toString())} />
					</div>
				</div>

				<div className="field">
					<label className="label">Draft Document</label>
					<div className="control">
						<input className="input" type="file" accept=".docx" onChange={handleFileChange} />
					</div>
				</div>

				<div className="columns">
					<div className="column is-one-quarter">
						<div className="field">
							<label className="label">Add to a Existing Workflow?</label>
							<div className="control">
								<input type="checkbox" onChange={(e) => setAddToWorkflow(e.target.checked)} />
							</div>
						</div>
					</div>
					<div className="column is-half">
						{addToWorkflow && (
							<div className="field">
								<label className="label">Assigned User</label>
								<div className="select">
									<select onChange={(e) => setWorkflowToAdd(e.target.value)}>
										<option></option>
										{workflows.map((workflow: any) => (
											<option key={workflow.workflowName} value={workflow.workflowID}>
												{workflow.workflowName}
											</option>
										))}
									</select>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="control">
					<button className="button is-link" type="submit">
						Create Contract
					</button>
				</div>
			</form>
		</main>
	);
}

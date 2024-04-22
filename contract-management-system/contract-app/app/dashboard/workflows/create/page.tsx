'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Document } from '@prisma/client';
import SortableList from './SortableList';
import { arrayMoveImmutable } from 'array-move';

export async function getContracts(docID: number) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('id', docID.toString());

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

export default function Create() {
	const [workflowName, setWorkflowName] = useState('');
	const [NDA, setNDA] = useState('');
	const [masterServiceAgreement, setMasterServiceAgreement] = useState('');
	const [workingAgreement, setWorkingAgreement] = useState('');
	const [documentType1, setDocumentType1] = useState('');
	const [documentType2, setDocumentType2] = useState('');

	const [hasNDA, setHasNDA] = useState(Boolean);
	const [hasMasterServiceAgreement, setHasMasterServiceAgreement] = useState(Boolean);
	const [hasWorkingAgreement, setHasWorkingAgreement] = useState(Boolean);
	const [hasDocumentType1, setHasDocument1] = useState(Boolean);
	const [hasDocumentType2, setHasDocument2] = useState(Boolean);

	const toggleNDA = (NDABool: Boolean) => {
		setHasNDA(!hasNDA);
		if (!NDABool) {
			setItems((l) => l.filter((item) => item !== 'NDA'));
		} else {
			setItems([...items, 'NDA']);
		}
	};

	const toggleMasterServiceAgreement = (MasterServiceAgreementBool: Boolean) => {
		setHasMasterServiceAgreement(!hasMasterServiceAgreement);
		if (!MasterServiceAgreementBool) {
			setItems((l) => l.filter((item) => item !== 'Master Service Agreement'));
		} else {
			setItems([...items, 'Master Service Agreement']);
		}
	};

	const toggleWorkingAgreement = (WorkingAgreementBool: Boolean) => {
		setHasWorkingAgreement(!hasWorkingAgreement);
		if (!WorkingAgreementBool) {
			setItems((l) => l.filter((item) => item !== 'Working Agreement'));
		} else {
			setItems([...items, 'Working Agreement']);
		}
	};

	const toggleDocumentType1 = (docType1Bool: Boolean) => {
		setHasDocument1(!hasDocumentType1);
		if (!docType1Bool) {
			setItems((l) => l.filter((item) => item !== 'Document Type 1'));
		} else {
			setItems([...items, 'Document Type 1']);
		}
	};

	const toggleDocumentType2 = (docType2Bool: Boolean) => {
		setHasDocument2(!hasDocumentType2);
		if (!docType2Bool) {
			setItems((l) => l.filter((item) => item !== 'Document Type 2'));
		} else {
			setItems([...items, 'Document Type 2']);
		}
	};

	const [items, setItems] = useState([]);

	const router = useRouter();

	const { data: session } = useSession();

	const [documents, setDocuments] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tempDocInfo = await getContracts(-1);
				setDocuments(tempDocInfo['data']);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems((prevItem) => arrayMoveImmutable(prevItem, oldIndex, newIndex));
	};

	async function handleSubmit(e: any) {
		e.preventDefault();

		// put set each element of order equal to the docID of
		// the document assigned
		const order = [];
		var buildString = '';
		for (let i = 0; i < items.length; i++) {
			switch (items[i]) {
				case ("NDA"):
					order[i] = NDA
					buildString += 'n'
					break;
				case("Master Service Agreement"):
					order[i] = masterServiceAgreement
					buildString += 'm'
					break;
				case("Working Agreement"):
					order[i] = workingAgreement
					buildString += 'w'
					break;
				case("Document Type 1"):
					order[i] = documentType1
					buildString += 'x'
					break;
				case("Document Type 2"):
					order[i] = documentType2
					buildString += 'y'
					break;[]
			}
		}
		buildString += 'f' 	// always end the buildString in f
						   	// to symbolize ending the workflow		

		// FormData to handle file upload
		const formData = new FormData();
		formData.append('workflowName', workflowName);
		formData.append('ownerID', session?.user?.id.toString());
		formData.append('buildString', buildString);
		formData.append('document1', order[0]); 
		formData.append('document2', order[1]); 
		formData.append('document3', order[2]); 
		formData.append('document4', order[3]); 
		formData.append('document5', order[4]); 

		

		// Fetch API to send the request to your API route
		const response = await fetch('/api/create-workflow', {
			method: 'POST',
			body: formData,
		});

		// Handle response from the server
		if (response.ok) {
			// Handle success
			console.log(await response.json());
			router.push(`/dashboard/workflows`);
		} else {
			console.log(response.status);
		}
	}

	return (
		<main>
			<div className="mb-5">
				{/* <pre>Contracts Create</pre>
            <pre>{JSON.stringify(session)}</pre> */}
				<h1 className="title">Create Workflow</h1>
				<h2 className="subtitle">Enter all of the information for a new workflow</h2>
			</div>
			<form onSubmit={handleSubmit}>
				{/* Username */}
				<div className="field">
					<label className="label" htmlFor="username">
						Name
					</label>
					<div className="control">
						<input
							className="input"
							type="text"
							id="username"
							value={workflowName}
							onChange={(e) => setWorkflowName(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="box">
					<div>
						<label className="checkbox">
							<input type="checkbox" onChange={(e) => toggleNDA(e.target.checked)} />
							NDA
						</label>
					</div>
					<div>
						<label className="checkbox">
							<input type="checkbox" onChange={(e) => toggleMasterServiceAgreement(e.target.checked)} />
							Working Agreement
						</label>
					</div>
					<div>
						<label className="checkbox">
							<input type="checkbox" onChange={(e) => toggleWorkingAgreement(e.target.checked)} />
							Master Service Agreement
						</label>
					</div>
					<div>
						<label className="checkbox">
							<input type="checkbox" onChange={(e) => toggleDocumentType1(e.target.checked)} />
							Document 1
						</label>
					</div>
					<div>
						<label className="checkbox">
							<input type="checkbox" onChange={(e) => toggleDocumentType2(e.target.checked)} />
							Document 2
						</label>
					</div>
				</div>

				<SortableList items={items} onSortEnd={onSortEnd} />

				{/* Dropdowns */}
				<div>
					{hasNDA && (
						<div>
							<label className="label">NDA</label>
							<div className="select is-fullwidth">
								<select onChange={(e) => setNDA(e.target.value)}>
									<option>Please Select A Contract</option>
									{documents.map((document: any) => (
										<option key={document.docID} value={document.docID}>
											{document.fileName}
										</option>
									))}
								</select>
							</div>
						</div>
					)}

					{hasMasterServiceAgreement && (
						<div>
							<label className="label">Master Services Agreement</label>
							<div className="select is-fullwidth">
								<select onChange={(e) => setMasterServiceAgreement(e.target.value)}>
									<option>Please Select A Contract</option>
									{documents.map((document: any) => (
										<option key={document.docID} value={document.docID}>
											{document.fileName}
										</option>
									))}
								</select>
							</div>
						</div>
					)}

					{hasWorkingAgreement && (
						<div>
							<label className="label">Working Agreement</label>
							<div className="select is-fullwidth">
								<select onChange={(e) => setWorkingAgreement(e.target.value)}>
									<option>Please Select A Contract</option>
									{documents.map((document: any) => (
										<option key={document.docID} value={document.docID}>
											{document.fileName}
										</option>
									))}
								</select>
							</div>
						</div>
					)}

					{hasDocumentType1 && (
						<div>
							<label className="label">Document Type 1</label>
							<div className="select is-fullwidth">
								<select onChange={(e) => setDocumentType1(e.target.value)}>
									<option>Please Select A Contract</option>
									{documents.map((document: any) => (
										<option key={document.docID} value={document.docID}>
											{document.fileName}
										</option>
									))}
								</select>
							</div>
						</div>
					)}

					{hasDocumentType2 && (
						<div>
							<label className="label">Document Type 2</label>
							<div className="select is-fullwidth">
								<select onChange={(e) => setDocumentType2(e.target.value)}>
									<option>Please Select A Contract</option>
									{documents.map((document: any) => (
										<option key={document.docID} value={document.docID}>
											{document.fileName}
										</option>
									))}
								</select>
							</div>
						</div>
					)}
				</div>

				<div className="control">
					<button className="button is-primary mt-5" type="submit">
						Create Workflow
					</button>
				</div>
			</form>
			<div className="mt-5">
				<p className="is-italic is-size-7">If you cant find the contract, you can create a new one:</p>
				<a href="/dashboard/contracts/create">
					<button className="button is-link my-3 is-small">Create New Contract</button>
				</a>
			</div>
		</main>
	);
}

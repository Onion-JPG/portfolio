'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export async function getContract(docID: number) {
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

export async function UpdateContract(ownerID: number, docID: number, uploadedContract: File) {
	// FormData to handle file upload
	const formData = new FormData();
	formData.append('ownerID', ownerID.toString());
	formData.append('docID', docID.toString());
	formData.append('uploadedContract', uploadedContract);

	// Fetch API to send the request to your API route
	const response = await fetch('/api/update-contract-file', {
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

export default function ContractPage(data: any) {
	const [loading, setLoading] = useState(true);
	const [clicked, setClicked] = useState(false);
	const [contract, setContract] = useState([]);

	const [uploadedContract, setUploadedContract] = useState<File>();
	const [ownerID, setOwnerID] = useState(0);
	const [docID, setDocID] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tempDocInfo = await getContract(data.params.id);
				setContract(tempDocInfo);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleFileChange = (event: any) => {
		setUploadedContract(event.target.files[0]);
		setOwnerID(contract['data'][0].ownerID);
		setDocID(contract['data'][0].docID);
	};

	const router = useRouter();
	const handleSubmit = async (event: any) => {
		event.preventDefault();
		await UpdateContract(ownerID, docID, uploadedContract);
		router.push('../');
	};

	const showHistory = () => {
		setClicked(!clicked);
	};

	return (
		<div>
			{loading ? (
				<p> Loading... </p>
			) : (
				<div>
					<div style={{ textAlign: 'center' }}>
						<h1 className="title">{contract['data'][0].DocumentMetadata[0].docName}</h1>
						<h2>Last Modification: {contract['data'][0].DocumentHistory[0].changeDate.substring(0, 10)}</h2>
						<h3>Start Date: {contract['data'][0].DocumentMetadata[0].startDate.substring(0, 10)}</h3>
						<h3>End date: {contract['data'][0].DocumentMetadata[0].endDate.substring(0, 10)}</h3>
						<h3>Company Name: {contract['data'][0].DocumentMetadata[0].companyName}</h3>
						<a href={'/contractFiles/' + contract['data'][0].fileName + '.pdf'} download={contract['data'][0].fileName + '.pdf'}>
							<button className="button is-primary m-1">Download PDF File</button>
						</a>
						<a href={'/contractFiles/' + contract['data'][0].fileName + '.docx'} download={contract['data'][0].fileName + '.docx'}>
							<button className="button is-primary m-1">Download DocX File</button>
						</a>
					</div>
					<div>
						<iframe src={'/contractFiles/' + contract['data'][0].fileName + '.pdf'} width="100%" height="500px" />
					</div>
					<div>
						<button className="button is-primary m-1" onClick={() => showHistory()}>
							Show History
						</button>
						<div className={clicked ? 'modal is-active' : 'modal'}>
							<div className="modal-background">
								<div className="modal-content">
									<table className="table mt-6 mx-auto">
										<thead>
											<tr>
												<th>Change Date</th>
												<th>Change Type</th>
												<th>User ID</th>
											</tr>
										</thead>
										<tbody>
											{contract['data'][0]['DocumentHistory'].map((history) => (
												<tr key={history.changeDate}>
													<td>{new Date(history.changeDate).toDateString()}</td>
													<td>{history.changeType}</td>
													<td>{history.userID}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<button className="modal-close is-large" aria-label="close" onClick={() => showHistory()}></button>
							</div>
						</div>
					</div>
					<form className="form" onSubmit={handleSubmit}>
						<div className="field">
							<label className="label">Update Document</label>
							<div className="control">
								<input className="input" type="file" accept=".docx" onChange={handleFileChange} />
							</div>
						</div>
						<div className="control">
							<button className="button is-primary" type="submit">
								Upload updated document
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

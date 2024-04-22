import { prisma } from '@/lib/prisma';
import { ChangeType, DocumentType, Status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';

// Handler for creating a contract
export async function POST(req: Request) {
	try {
		// Parse request body
		const body = await req.formData();
		const documentName = body.get('documentName')?.toString();
		const companyName = body.get('companyName')?.toString();
		const ownerId = body.get('ownerId')?.toString();
		const docTypeString = body.get('docType')?.toString();
		const startDateString = body.get('startDate')?.toString();
		const endDateString = body.get('endDate')?.toString();
		const renewalType = body.get('renewalType')?.toString();
		const addToWorkflow = body.get('addToWorkflow')?.toString();
		const workflowID = body.get('workflowID')?.toString();
		const uploadedContract = body.get('uploadedContract');

		const addToWorkflowBool = addToWorkflow === 'true';
		const renewal = renewalType === 'true';

		var startDate;
		var endDate;
		if (startDateString) {
			startDate = new Date(startDateString);
		}
		if (endDateString) {
			endDate = new Date(endDateString);
		}

		var docType;
		switch (docTypeString) {
			case 'NDA':
				docType = DocumentType.Nda;
				break;
			case 'MasterServiceAgreement':
				docType = DocumentType.MasterServiceAgreement;
				break;
			case 'WorkingAgreement':
				docType = DocumentType.WorkingAgreement;
				break;
		}

		// Validate required fields
		if (
			!documentName ||
			!companyName ||
			!ownerId ||
			!docType ||
			!startDate ||
			!endDate ||
			!uploadedContract ||
			(addToWorkflowBool && !workflowID)
		) {
			return NextResponse.json({ message: 'Missing Data' });
		}

		const buffer = Buffer.from(await uploadedContract?.arrayBuffer());
		const filename = uploadedContract.name.replaceAll(' ', '_').substring(0, uploadedContract.name.length - 5);
		await writeFile('public/contractFiles/' + filename + '.docx', buffer);

		// Create a new document in the database
		const document = await prisma.document.create({
			data: {
				docType: docType,
				fileName: filename,
				owner: {
					connect: { userID: parseInt(ownerId) },
				},
			},
		});

		if (addToWorkflowBool) {
			const docAddToWorkflow = await prisma.document.update({
				where: {
					docID: document.docID,
				},
				data: {
					Workflows: {
						connect: { workflowID: parseInt(workflowID) },
					},
				},
			});
			const workflow = await prisma.workflows.update({
				where: {
					workflowID: parseInt(workflowID),
				},
				data: {
					acceptingNew: false
				}
			})
		}

		// Create document metadata
		const documentMetadata = await prisma.documentMetadata.create({
			data: {
				docName: documentName,
				companyName: companyName,
				startDate: startDate,
				endDate: endDate,
				renewalType: renewal,
				document: {
					connect: { docID: document.docID },
				},
			},
		});

		// Create document history
		const documentHistory = await prisma.documentHistory.create({
			data: {
				changeType: ChangeType.Creation,
				changeDate: new Date(),
				document: {
					connect: { docID: document.docID },
				},
				user: {
					connect: { userID: parseInt(ownerId) },
				},
			},
		});

		// Create userqueue
		const UserQueue = await prisma.userQueue.create({
			data: {
				queueStatus: Status.Draft,
				document: {
					connect: { docID: document.docID },
				},
				user: {
					connect: { userID: parseInt(ownerId) },
				},
			},
		});

		return NextResponse.json({ message: 'Contract created successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' });
	}
}

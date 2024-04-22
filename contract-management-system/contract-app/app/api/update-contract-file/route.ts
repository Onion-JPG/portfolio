import { prisma } from '@/lib/prisma';
import { ChangeType, DocumentType, Status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';

// Handler for creating a contract
export async function POST(req: Request) {
	try {
		// Parse request body
		const body = await req.formData();
		const docID = body.get('docID')?.toString();
		const ownerID = body.get('ownerID')?.toString();
		const uploadedContract = body.get('uploadedContract');

		console.log(docID);
		console.log(ownerID);
		console.log(uploadedContract);

		// Validate required fields
		if (!docID || !ownerID || !uploadedContract) {
			return NextResponse.json({ message: 'Missing Data' });
		}

		const buffer = Buffer.from(await uploadedContract?.arrayBuffer());
		const filename = uploadedContract.name.replaceAll(' ', '_').substring(0, uploadedContract.name.length - 5);
		await writeFile('public/contractFiles/' + filename + '.docx', buffer);

		// update document fileName
		const document = await prisma.document.update({
			where: {
				docID: parseInt(docID),
			},
			data: {
				fileName: filename,
			},
		});

		// create new document history
		const documentHistory = await prisma.documentHistory.create({
			data: {
				changeType: ChangeType.Modification,
				changeDate: new Date(),
				document: {
					connect: { docID: parseInt(docID) },
				},
				user: {
					connect: { userID: parseInt(ownerID) },
				},
			},
		});

		return NextResponse.json({ message: 'Contract updated successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Internal server error' });
	}
}

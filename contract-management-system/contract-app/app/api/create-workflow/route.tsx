import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for creating a workflow and its documents
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const workflowName = body.get("workflowName")?.toString();
        const owner = body.get("ownerID")?.toString();
        const buildString = body.get("buildString")?.toString()
        const document1str = body.get("document1")?.toString();
        const document2str = body.get("document2")?.toString();
        const document3str = body.get("document3")?.toString();
        const document4str = body.get("document3")?.toString();
        const document5str = body.get("document3")?.toString();


        if (!workflowName || !owner || !buildString) {
            return NextResponse.json({ message: 'Missing or invalid data' });
        }

        const ownerID = parseInt(owner);

        // Make a temp array to fill in all docs
        const tempDocData = [document1str, document2str, document3str, document4str, document5str].map(doc => parseInt(doc));
        
        // use a filter to remove all NaN, leaving just the documents that exist
        const documentsData = tempDocData.filter(function (value) {
            return !Number.isNaN(value);
        });
        const workflowStatus = documentsData.length;

        console.log(ownerID);
        console.log(documentsData);
        console.log(workflowStatus);

        if (isNaN(ownerID) || isNaN(workflowStatus) || documentsData.some(isNaN)) {
            return NextResponse.json({ message: 'Invalid numerical data' });
        }

        // Create workflow and documents
        const newWorkflow = await prisma.workflows.create({
            data: {
                ownerID,
                workflowName,
                workflowStatus,
                inReview: false,
                lastChange: new Date(),
                notified: false,
                workflowSetup: buildString,
                acceptingNew: true,
                Document: {
                    connect: documentsData.map(docID => ({ docID })),
                },
            },
        });

        return NextResponse.json({ message: 'Workflow and documents created successfully', data: newWorkflow });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

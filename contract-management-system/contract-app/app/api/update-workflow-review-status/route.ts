import { prisma } from "@/lib/prisma";
import { DocumentType, Status } from '@prisma/client';
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const workflowID = body.get("workflowID")?.toString();
        const inReview = body.get("inReview")?.toString();
        const newAssign = body.get("newAssign")?.toString();

        // Validate required fields
        if (!workflowID || !inReview || !newAssign) {
            return NextResponse.json({ message: 'Missing Data' });
        }

        const reviewBool = (inReview != "true");


        // Create a new document in the database
        const updateWorkflow = await prisma.workflows.update({
            where: {
                workflowID: parseInt(workflowID)
            },
            data: {
                ownerID: parseInt(newAssign),
                inReview: reviewBool
            },
        });

        return NextResponse.json({ message: 'Workflow updates successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error'});
    }
}

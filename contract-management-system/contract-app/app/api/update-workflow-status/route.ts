import { prisma } from "@/lib/prisma";
import { DocumentType, Status } from '@prisma/client';
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const workflowID = body.get("workflowID")?.toString();
        const index = body.get("index")?.toString();
        const newAssign = body.get("newAssign")?.toString();

        // Validate required fields
        if (!workflowID || !index || !newAssign) {
            return NextResponse.json({ message: 'Missing Data' });
        }

        // Create a new document in the database
        const updateWorkflow = await prisma.workflows.update({
            where: {
                workflowID: parseInt(workflowID)
            },
            data: {
                owner: {
                    connect: {
                        userID: parseInt(newAssign),
                    }
                },
                workflowStatus: parseInt(index),
                inReview: false
            },
        });

        return NextResponse.json({ message: 'Workflow updates successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error'});
    }
}

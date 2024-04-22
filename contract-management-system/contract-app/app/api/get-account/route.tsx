import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const userID = body.get("userID")?.toString();

        // Validate required field
        if (!userID) {
            return NextResponse.json({ message: 'Missing Data' });
        }

        if (parseInt(userID) === -1) {
            const account = await prisma.account.findMany();
            return Response.json({ data: account }, { status: 200 });
        } else {
            const account = await prisma.account.findMany({
                where: {
                    userID: parseInt(userID)
                },
            });
            return Response.json({ data: account }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

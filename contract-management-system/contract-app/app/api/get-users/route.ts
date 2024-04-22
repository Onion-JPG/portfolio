import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const users = await prisma.account.findMany({
            where: {
                userID: {
                    gt: 0
                }
            },
            select: {
                firstName: true,
                lastName: true,
                userID: true
            },
            orderBy: {
                userID: 'asc'
            }
        });
        return Response.json({ data: users }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

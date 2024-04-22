import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const companies = await prisma.externalEntity.findMany({
            where: {},
            distinct: ["entityName"],
            orderBy: {
                entityName: 'asc',
            }
        });
        return Response.json({ data: companies }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for updating a user account
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const user = body.get("userID")?.toString();
        var userID : number = -1;
        if (user) {
            userID = parseInt(user);
        }

        // Update user account
        if (userID != -1) {
            const account = await prisma.account.delete({
                where: { userID }, 
            });
        } else {
            return NextResponse.json({ message: 'Missing Data', data: JSON.stringify(body)});
        }
        
        return NextResponse.json({ message: 'Account updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error'});
    }
}

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
        const username = body.get("username")?.toString();
        const password = body.get("password")?.toString();
        const accountType = body.get("accountType")?.toString();
        const isInternal = body.get("isInternal")?.toString().toLowerCase() === 'true';
        const firstName = body.get("firstName")?.toString();
        const lastName = body.get("lastName")?.toString();
        const email = body.get("email")?.toString();

        // Update user account
        if (userID != -1 && username && password && accountType && isInternal && firstName && lastName && email) {
            const account = await prisma.account.update({
                where: { userID }, 
                data: {
                    username,
                    password,
                    accountType,
                    isInternal,
                    firstName,
                    lastName,
                    email,
                },
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

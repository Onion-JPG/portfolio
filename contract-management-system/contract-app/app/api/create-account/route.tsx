import { prisma } from "@/lib/prisma";
import { ChangeType, DocumentType, Status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from "fs/promises";
import path from "path";

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const username = body.get("username")?.toString();
        const password = body.get("password")?.toString();
        const accountType = body.get("accountType")?.toString();
        const isInternal = body.get("isInternal")?.toString().toLowerCase() === 'true';
        const firstName = body.get("firstName")?.toString();
        const lastName = body.get("lastName")?.toString();
        const email = body.get("email")?.toString();

        // Create userqueue
        if (username && password && accountType && isInternal && firstName && lastName && email) {
            const account = await prisma.account.create({
                data: {
                    username,
                    password,
                    accountType,
                    isInternal,
                    firstName,
                    lastName,
                    email,
                }
            });
        } else {
            return NextResponse.json({ message: 'Missing Data', data: JSON.stringify(body)});
        }
        
        return NextResponse.json({ message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error'});
    }
}

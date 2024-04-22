import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

import { Resend } from 'resend';

const resend = new Resend('re_NhpNQVj8_BpsHVT8nmF2HLHoZs6K8UZKM');

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const email = body.get("email")?.toString();

        if (email) {
            await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: [email],
                subject: 'Contract Managment App Updates',
                text: 'You have been notified by a workflow!',
            });

            return NextResponse.json({ message: 'Emailed' });
        }

        return NextResponse.json({ message: 'Missing Data' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

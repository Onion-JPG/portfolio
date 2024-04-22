import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Handler for creating a contract
export async function POST(req: Request) {
    try {
        // Parse request body
        const body = await req.formData();
        const id = body.get("id")?.toString();
        const searchUser = body.get("searchUser")?.toString();

        const searchBool = (searchUser == "true");

        // Validate required field
        if (!id) {
            return NextResponse.json({ message: 'Missing Data' });
        }
        else if (parseInt(id) === -1) {
            const workflow = await prisma.workflows.findMany({
                include: {
                    Document: {
                        include: {
                            DocumentMetadata: {
                                take: 1
                            },
                            DocumentHistory: {
                                take: 1
                            }
                        }
                    }
                }
            });
            return Response.json({ data: workflow }, { status: 200 });
        } else if (searchBool) {
            const workflow = await prisma.workflows.findMany({
                where: {
                    ownerID: parseInt(id)
                },
                include: {
                    Document: {
                        include: {
                            DocumentMetadata: {
                                take: 1
                            },
                            DocumentHistory: {
                                take: 1
                            }
                        }
                    }
                }
            });
            return Response.json({ data: workflow }, { status: 200 });
        } else {
            const workflow = await prisma.workflows.findMany({
                where: {
                    workflowID: parseInt(id)
                },
                include: {
                    Document: {
                        include: {
                            DocumentMetadata: {
                                take: 1
                            },
                            DocumentHistory: {
                                take: 1
                            }
                        }
                    }
                }
            });
            return Response.json({ data: workflow }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

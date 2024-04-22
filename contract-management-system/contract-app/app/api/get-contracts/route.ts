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
        } else if (parseInt(id) === -1) {
          const document = await prisma.document.findMany({
              include: {
                UserQueue: {
                  take: 1,
                },
                DocumentMetadata: {
                  take: 1,
                },
                DocumentHistory: {
                  take: -1,
                },
              },
          });
          return Response.json({ data: document }, { status: 200 });
        } else if (searchBool) {
            const document = await prisma.document.findMany({
              where: {
                ownerID: parseInt(id),
              },
                include: {
                    UserQueue: {
                      take: 1,
                    },
                    DocumentMetadata: {
                      take: 1,
                    },
                    DocumentHistory: {
                    }
                  }
            });
            return Response.json({ data: document }, { status: 200 });
        } else {
          const document = await prisma.document.findMany({
              where: {
                  docID: parseInt(id)
              },
              include: {
                  UserQueue: {
                    take: 1,
                  },
                  DocumentMetadata: {
                    take: 1,
                  },
                  DocumentHistory: {
                  }
                }
          });
          return Response.json({ data: document }, { status: 200 });
      }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

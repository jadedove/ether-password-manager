import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { NoteData, getNotes, getUser, pinToIPFS } from "../../utils";
import { IPFSType } from "@prisma/client";

export async function POST(request: any, context: any) {
  try {
    let data: NoteData;
    const address = context.params.id.toLowerCase();

    try {
      data = await request.json();
    } catch (error) {
      if (request.headers["content-type"] !== "application/json") {
        return new NextResponse("Unsupported Media Type", { status: 415 });
      }
      console.error("Error parsing request body:", error);
      return new NextResponse("Error parsing request body", { status: 400 });
    }

    const user = await getUser(address);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!data.title || !data.ciphertext) {
      return new NextResponse("Missing  data for Notes object", {
        status: 404,
      });
    }

    const IpfsHash = await pinToIPFS(data);
    if (!IpfsHash) {
      return new NextResponse("Failed to pin to IPFS", { status: 500 });
    }

    await prisma.iPFS.create({
      data: {
        user: { connect: { address: user.address } },
        cid: IpfsHash,
        type: IPFSType.NOTE,
      },
    });

    const allUserNotes = await getNotes(address);
    return new NextResponse(JSON.stringify(allUserNotes), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    // return NextResponse.error();
    return new NextResponse("Something went wrong", { status: 500 });
  }
}

export async function GET(request: NextRequest, context: any) {
  try {
    const address = context.params.id.toLowerCase();
    const allUserNotes = await getNotes(address);

    return new NextResponse(JSON.stringify(allUserNotes), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
export async function DELETE(request: NextRequest, context: any) {
  try {
    let id = context.params.id;
    id = parseInt(id);

    const existingNote = await prisma.iPFS.findFirst({
      where: { id: id },
    });

    if (!existingNote) {
      return new NextResponse("Note not found", { status: 404 });
    }

    await prisma.iPFS.delete({
      where: {
        id: existingNote.id,
      },
    });

    const allUserNotes = await getNotes(existingNote.userAddress);

    return new NextResponse(JSON.stringify(allUserNotes), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Something went wrong", { status: 500 });
  }
}

export async function PUT(request: any, context: any) {
  let data: NoteData;
  let id = context.params.id;
  id = parseInt(id);
  try {
    try {
      data = await request.json();
    } catch (error) {
      if (request.headers["content-type"] !== "application/json") {
        return new NextResponse("Unsupported Media Type", { status: 415 });
      }
      console.error("Error parsing request body:", error);
      return new NextResponse("Error parsing request body", { status: 400 });
    }

    if (!data.title || !data.ciphertext) {
      return new NextResponse("missing  data! or connect wallet", {
        status: 400,
      });
    }

    const existingNote = await prisma.iPFS.findFirst({
      where: { id: id },
    });
    if (!existingNote) {
      return new NextResponse("Password not found", { status: 404 });
    }

    const IpfsHash = await pinToIPFS(data);
    if (!IpfsHash) {
      return new NextResponse("Something went wrong", { status: 500 });
    }

    await prisma.iPFS.update({
      where: { id: id },
      data: {
        cid: IpfsHash,
      },
    });
    const passwords = await getNotes(existingNote.userAddress);

    return new NextResponse(JSON.stringify(passwords), { status: 200 });
  } catch (error) {
    console.error(error);

    return new NextResponse("Something went wrong", { status: 500 });
  }
}

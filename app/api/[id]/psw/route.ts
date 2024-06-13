import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PasswordData, getPasswords, pinToIPFS } from "../../utils";
import { IPFSType } from "@prisma/client";

// Get PSW
export async function GET(request: any, context: any) {
  try {
    const address = context.params.id.toLowerCase();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { address: address },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwords = await getPasswords(user.address);

    return NextResponse.json(passwords, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Create PSW
export async function POST(request: any, context: any) {
  let data: PasswordData;
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

  const user = await prisma.user.findUnique({
    where: { address: address },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const { url, username, ciphertext } = data;

  if (!user || !url || !username || !ciphertext) {
    return new NextResponse("missing  data! or connect wallet", {
      status: 400,
    });
  }

  const IpfsHash = await pinToIPFS(data);
  if (!IpfsHash) {
    return new NextResponse("Something went wrong", { status: 500 });
  }

  await prisma.iPFS.create({
    data: {
      user: { connect: { address: user.address } },
      cid: IpfsHash,
      type: IPFSType.PASSWORD,
    },
  });

  const passwords = await getPasswords(user.address);

  return NextResponse.json(passwords, { status: 200 });
}

// Delete PSW
export async function DELETE(request: any, context: any) {
  try {
    const id = parseInt(context.params.id);

    const existingPsw = await prisma.iPFS.findFirst({
      where: { id: id },
    });

    if (!existingPsw) {
      return new NextResponse("Password not found", { status: 404 });
    }

    await prisma.iPFS.delete({
      where: { id: existingPsw.id },
    });

    const passwords = await getPasswords(existingPsw.userAddress);

    return new NextResponse(JSON.stringify(passwords), { status: 200 });
  } catch (error) {
    console.error("Error deleting password:", error);
    return new NextResponse("Error deleting password", { status: 500 });
  }
}

// Update PSW
export async function PUT(request: any, context: any) {
  let data: PasswordData;
  try {
    let id = context.params.id;
    id = parseInt(id);

    try {
      data = await request.json();
    } catch (error) {
      if (request.headers["content-type"] !== "application/json") {
        return new NextResponse("Unsupported Media Type", { status: 415 });
      }
      console.error("Error parsing request body:", error);
      return new NextResponse("Error parsing request body", { status: 400 });
    }

    if (!data.url || !data.username || !data.ciphertext) {
      return new NextResponse("missing  data! or connect wallet", {
        status: 400,
      });
    }

    const existingPsw = await prisma.iPFS.findFirst({
      where: { id: id },
    });
    if (!existingPsw) {
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
    const passwords = await getPasswords(existingPsw.userAddress);

    return new NextResponse(JSON.stringify(passwords), { status: 200 });
  } catch (error) {
    console.error("Error deleting password:", error);
    return new NextResponse("Error deleting password", { status: 500 });
  }
}

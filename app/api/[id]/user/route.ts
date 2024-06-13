import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserItems } from "../../utils";

export async function GET(request: any, context: any) {
  try {
    const address = context.params.id.toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: { address: address },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    } else {
      // No user found with the provided address
      return new NextResponse("User not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 400 });
  } finally {
    await prisma.$disconnect();
  }
}

// Create User
export async function POST(request: any, context: any) {
  const address: string = context.params.id.toLowerCase();

  if (address.length !== 42) {
    return new NextResponse("missing  data! or connect wallet", {
      status: 400,
    });
  }

  const existinguser = await prisma.user.findUnique({
    where: { address: address },
  });

  if (!existinguser) {
    const createdUser = await prisma.user.create({
      data: {
        address,
      },
    });

    return NextResponse.json(createdUser);
  } else {
    return new NextResponse("User already exists", { status: 400 });
  }
}

export async function PATCH(request: any, context: any) {
  try {
    const address = context.params.id.toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: { address: address },
    });

    if (existingUser) {
      const data = await getUserItems(existingUser.address);
      return NextResponse.json(data, { status: 200 });
    } else {
      // No user found with the provided address
      return new NextResponse("User not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 400 });
  } finally {
    await prisma.$disconnect();
  }
}

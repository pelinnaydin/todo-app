import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json(
        { error: "Görev bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Görev alınamadı" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 ASYNC AWAIT EKLENDİ
    const body = await req.json();

    const data: any = {};

    if (body.title !== undefined) data.title = body.title.trim();
    if (body.description !== undefined) {
      data.description = body.description.trim() || null;
    }
    if (body.completed !== undefined) data.completed = body.completed;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Görev güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Görev silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Görev silinemedi" },
      { status: 500 }
    );
  }
}
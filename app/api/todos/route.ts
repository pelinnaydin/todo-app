
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//Tüm görevleri getir
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Görevler alınamadı" },
      { status: 500 }
    );
  }
}

// Yeni görev ekle
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasyon
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Başlık zorunludur" },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || undefined, 
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Görev oluşturulamadı" },
      { status: 500 }
    );
  }
}
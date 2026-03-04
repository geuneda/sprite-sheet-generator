import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get("executionId");

  if (!executionId) {
    return NextResponse.json(
      { success: false, error: "executionId is required" },
      { status: 400 }
    );
  }

  const apiUrl = process.env.N8N_API_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { success: false, error: "N8N API not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/executions/${executionId}?includeData=true`,
      {
        headers: { "X-N8N-API-KEY": apiKey },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, status: "processing" }
      );
    }

    const execution = await response.json();
    const execStatus: string = execution.status ?? (execution.finished ? "success" : "running");

    if (execStatus === "running" || execStatus === "waiting" || execStatus === "new") {
      return NextResponse.json({
        success: true,
        status: "processing",
      });
    }

    if (execution.status === "error" || execution.status === "crashed") {
      return NextResponse.json({
        success: false,
        status: "error",
        error: "Sprite generation failed in n8n workflow",
      });
    }

    // Execution finished - extract results from Format Response node
    const resultData = execution.data?.resultData?.runData;
    if (!resultData) {
      return NextResponse.json({
        success: true,
        status: "processing",
      });
    }

    // Find Format Response node output
    const formatNode = resultData["Format Response"];
    if (!formatNode?.[0]?.data?.main?.[0]?.[0]?.json) {
      return NextResponse.json({
        success: true,
        status: "processing",
      });
    }

    const sprites = formatNode[0].data.main[0][0].json;

    return NextResponse.json({
      success: true,
      status: "completed",
      sprites: sprites.sprites || sprites,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, status: "error", error: message },
      { status: 500 }
    );
  }
}

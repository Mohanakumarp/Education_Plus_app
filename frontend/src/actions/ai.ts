"use server";

export async function summarizeText(text: string) {
  try {
    const plainText = text.replace(/<[^>]*>?/gm, " ");

    const response = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: plainText, sentences_count: 5 }),
    });
    
    if (!response.ok) {
        throw new Error("AI Service error");
    }

    const data = await response.json();
    return { summary: data.summary };
  } catch (e) {
    console.error(e);
    return { error: "AI Service unavailable." };
  }
}

export async function generateQuiz(text: string) {
  try {
    const plainText = text.replace(/<[^>]*>?/gm, " ");

    const response = await fetch("http://127.0.0.1:8000/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: plainText }),
    });
    
    if (!response.ok) {
        throw new Error("AI Service error");
    }

    const data = await response.json();
    return { quiz: data.quiz };
  } catch (e) {
    console.error(e);
    return { error: "AI Service unavailable." };
  }
}

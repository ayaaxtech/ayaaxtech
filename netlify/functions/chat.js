export async function handler(event) {
  const body = JSON.parse(event.body);
  const message = body.message;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
    }),
  };
}

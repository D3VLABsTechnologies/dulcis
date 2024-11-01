// API route for handling customer feedback submissions
// This endpoint processes feedback data and sends it to a Telegram channel

export async function POST(req) {
  // CORS headers for security
  const headers = {
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? "https://dulcisfeedback.vercel.app"
        : "http://localhost:3000",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { orderItems, date, suggestion, rating } = await req.json();

    // Input validation
    if (!orderItems?.length || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers }
      );
    }

    // Validate environment variables
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !CHAT_ID) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers }
      );
    }

    // Sanitize and format order items
    const formattedOrderItems = orderItems
      .map((item) => {
        // Sanitize numeric values
        const quantity = parseInt(item.quantity);

        if (isNaN(quantity)) {
          throw new Error("Invalid order item data");
        }

        // Escape special Markdown characters
        const sanitizedName = item.name.replace(
          /[_*[\]()~`>#+=|{}.!-]/g,
          "\\$&"
        );

        return `🍽️ *${quantity} x ${sanitizedName}*`;
      })
      .join("\n");

    // Sanitize suggestion text
    const sanitizedSuggestion = suggestion
      ? suggestion.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")
      : "No suggestion provided";

    // Construct message with sanitized data
    const message = `
🚀 *New Customer Feedback*

🗓️ *Date:* ${date}
📍 *Branch:* JEGA Hostel

⭐ *Rating:* ${rating ? "".padStart(rating, "⭐") : "Not rated"}

🎉 *Order Summary:*
${formattedOrderItems}

💬 *Feedback:*
"${sanitizedSuggestion}"

---
    `.trim();

    // Send to Telegram with a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10s

    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        throw new Error(`Telegram API error: ${errorText}`);
      }

      return new Response(
        JSON.stringify({ message: "Feedback sent successfully!" }),
        { status: 200, headers }
      );
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({
            error: "Request timeout - please try again",
            details: "The request took too long to complete",
          }),
          { status: 408, headers }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Feedback submission error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process feedback",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers }
    );
  }
}

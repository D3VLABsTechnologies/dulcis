// src/app/api/suggestions/routes.js

export async function POST(req) {
  console.log("Incoming request:", req);
  try {
    const { orderItems, total, date, branch, suggestion } = await req.json();
    console.log("Received data:", {
      orderItems,
      total,
      date,
      branch,
      suggestion,
    });

    // Validate input data
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      console.error("Invalid orderItems:", orderItems);
      return new Response(JSON.stringify({ error: "Invalid order items" }), {
        status: 400,
      });
    }

    // Access environment variables for Telegram bot token and chat ID
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !CHAT_ID) {
      console.error("Missing Telegram Token or Chat ID");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    // Construct the order items list for the message
    const formattedOrderItems = orderItems
      .map(
        (item) =>
          `${item.quantity} x ${item.name} (${
            item.size
          }) - GHS ${item.price.toFixed(2)}`
      )
      .join("\n");

    // Format the message for Telegram
    const message = `
        📩 New Suggestion:
        - Items:
        ${formattedOrderItems}
        - Total: GHS ${total.toFixed(2)}
        - Date: ${date}
        - Branch: ${branch}
        - Suggestion: "${suggestion}"
      `;

    // Send the message to the specified Telegram chat ID
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(
      message
    )}`;
    const response = await fetch(telegramURL);

    if (!response.ok) {
      console.error(
        "Failed to send message to Telegram:",
        await response.text()
      );
      throw new Error("Failed to send message to Telegram");
    }

    return new Response(
      JSON.stringify({ message: "Feedback sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: "Failed to send feedback" }), {
      status: 500,
    });
  }
}

export async function getZoomAccessToken(): Promise<string> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom credentials are not configured in environment variables.");
  }

  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Zoom OAuth error:", errorText);
    throw new Error("Failed to get Zoom access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function createZoomMeeting(
  topic: string,
  startTimeUtc: string,
  durationMinutes: number
): Promise<{ join_url: string; start_url: string }> {
  try {
    const token = await getZoomAccessToken();

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled meeting
        start_time: startTimeUtc, // e.g. "2024-03-15T14:30:00Z"
        duration: durationMinutes,
        timezone: "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0, // Automatically approve
          waiting_room: true, // Crucial for safety!
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Zoom API meeting creation error:", errorText);
      throw new Error("Failed to create Zoom meeting");
    }

    const data = await response.json();
    return {
      join_url: data.join_url,
      start_url: data.start_url,
    };
  } catch (error) {
    console.error("Zoom integration error:", error);
    throw error;
  }
}

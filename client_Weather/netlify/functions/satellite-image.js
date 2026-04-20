const SATELLITE_IMAGE_URL = "http://www.sattmet.tmd.go.th/satmet/thai/ir_enh/ir_enh_thai.jpg";

exports.handler = async () => {
  try {
    const response = await fetch(SATELLITE_IMAGE_URL);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch satellite image: ${response.statusText}`,
      };
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: error instanceof Error ? error.message : "Failed to fetch satellite image",
    };
  }
};

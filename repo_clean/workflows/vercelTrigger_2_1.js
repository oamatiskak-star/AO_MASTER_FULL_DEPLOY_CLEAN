import fetch from "node-fetch";

export default async function triggerVercel(moduleName) {
  console.log("Trigger Vercel deploy voor:", moduleName);

  const response = await fetch(
    `https://api.vercel.com/v1/integrations/deploy/prj_xxxxxx`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  const json = await response.json();
  console.log("Vercel response:", json);
}

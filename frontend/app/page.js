"use client";

import { useEffect } from "react";
import { supabase } from "./api/config";

export default function Home() {
useEffect(() => {
async function run() {
const { data } = await supabase.auth.getSession();
if (data?.session) {
window.location.href = "/dashboard";
} else {
window.location.href = "/login";
}
}
run();
}, []);

return <div></div>;
}
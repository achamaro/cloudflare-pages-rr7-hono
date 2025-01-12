import { createCookie } from "react-router";

export const SessionCookie = (secrets: string, secure: boolean) =>
	createCookie("session", {
		httpOnly: true,
		secrets: secrets.split(","),
		maxAge: 60,
		path: "/",
		sameSite: "lax",
		secure,
	});

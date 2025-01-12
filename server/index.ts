import { Hono } from "hono";
import { redirect } from "react-router";
import { SessionCookie } from "../app/cookie.server";
import { singleFetchRedirect } from "../app/util/navigation/redirect";
import type { HonoEnv } from "../load-context";

const app = new Hono<HonoEnv>();

app.use(async (c, next) => {
	const url = new URL(c.req.url);

	// 認証が不要なページはスキップ
	if (!url.pathname.startsWith("/private")) {
		return next();
	}

	// クッキーからセッションデータを取得
	const userName = await SessionCookie(
		c.env.SESSION_COOKIE_SECRETS,
		c.env.APP_ENV === "production",
	).parse(c.req.header("Cookie") ?? "");
	if (userName) {
		c.set("userName", userName);
		return next();
	}

	// 認証に失敗した場合はログイン画面へリダイレクト
	const redirectResponse = redirect("/login");

	// HTML要求ではない場合はfetchリクエストへのレスポンスを返す
	if (!c.req.header("Accept")?.includes("text/html")) {
		// シングルフェッチリクエストの場合はシングルフェッチのデータ形式で返す
		if (url.pathname.endsWith(".data")) {
			return singleFetchRedirect(redirectResponse);
		}
		return new Response("Unauthorized", { status: 401 });
	}

	return redirectResponse;
});

export default app;

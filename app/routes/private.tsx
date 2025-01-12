import { Form, redirect } from "react-router";
import type { Route } from "./+types/private";

export async function action({ context: { sessionCookie } }: Route.ActionArgs) {
	return redirect("/login", {
		headers: {
			"Set-Cookie": await sessionCookie.serialize("", { maxAge: 1 }),
		},
	}) as Response;
}

export async function loader({ context }: Route.LoaderArgs) {
	return context.hono.context.get("userName");
}

export default function Private({ loaderData }: Route.ComponentProps) {
	return (
		<div className="p-5">
			<h1 className="mb-5 text-4xl">ダッシュボード</h1>
			<p>ようこそ、{loaderData}さん</p>
			<Form method="post" className="mt-5">
				<button type="submit" className="btn btn-sm btn-neutral">
					ログアウト
				</button>
			</Form>
		</div>
	);
}

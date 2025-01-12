import { Form, redirect } from "react-router";
import type { Route } from "./+types/login";

export async function action({
	request,
	context: { sessionCookie },
}: Route.ActionArgs) {
	const formData = await request.formData();

	return redirect("/private", {
		headers: {
			"Set-Cookie": await sessionCookie.serialize(
				formData.get("username") as string,
			),
		},
	}) as Response;
}

export default function Login() {
	return (
		<div className="p-5">
			<Form method="post" className="flex w-fit flex-col gap-4">
				<div>
					<label className="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-4 w-4 opacity-70"
						>
							<title>username</title>
							<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
						</svg>
						<input
							name="username"
							type="text"
							className="grow"
							placeholder="ユーザー名"
							required
						/>
					</label>
				</div>

				<button type="submit" className="btn btn-neutral">
					ログイン
				</button>
			</Form>
		</div>
	);
}

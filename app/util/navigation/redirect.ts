import { UNSAFE_SingleFetchRedirectSymbol } from "react-router";
import { encode } from "turbo-stream";

export function singleFetchRedirect(response: Response) {
	const result = {
		[UNSAFE_SingleFetchRedirectSymbol]: getSingleFetchRedirect(
			response.status,
			response.headers,
		),
	};

	const body = encode(result, {
		// https://github.com/remix-run/react-router/blob/5d96537148d768b304be3bea7237a12351127807/packages/react-router/lib/server-runtime/single-fetch.ts#L352C19-L352C74
		plugins: [
			(value) => {
				if (
					value &&
					typeof value === "object" &&
					UNSAFE_SingleFetchRedirectSymbol in value
				) {
					return [
						"SingleFetchRedirect",
						value[UNSAFE_SingleFetchRedirectSymbol],
					];
				}
			},
		],
	});

	const headers = new Headers(response.headers);
	headers.set("Content-Type", "text/x-script");
	headers.set("X-Remix-Response", "yes");

	return new Response(body, {
		status: 202,
		headers,
	});
}

// https://github.com/remix-run/react-router/blob/5d96537148d768b304be3bea7237a12351127807/packages/react-router/lib/server-runtime/single-fetch.ts#L256
function getSingleFetchRedirect(status: number, headers: Headers) {
	const redirect2 = headers.get("Location");
	return {
		redirect: redirect2,
		status,
		revalidate:
			// Technically X-Remix-Revalidate isn't needed here - that was an implementation
			// detail of ?_data requests as our way to tell the front end to revalidate when
			// we didn't have a response body to include that information in.
			// With single fetch, we tell the front end via this revalidate boolean field.
			// However, we're respecting it for now because it may be something folks have
			// used in their own responses
			// TODO(v3): Consider removing or making this official public API
			headers.has("X-Remix-Revalidate") || headers.has("Set-Cookie"),
		reload: headers.has("X-Remix-Reload-Document"),
		replace: headers.has("X-Remix-Replace"),
	};
}

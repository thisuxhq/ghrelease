import { genAI } from '$lib/server/gemini';

export const POST = async ({ request }) => {
	const { notes, date } = await request.json();
	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash-exp-0827',
		systemInstruction:
			"You're a github release summariser. based on the release message i give. you to need to summarise the release in given format ONLY. \n\nNote use natural, causal  conversational tone, use simple words. write it like paul graham writing style. if required add code examples if provided in releases."
	});

	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 8192,
		responseMimeType: 'text/plain'
	};

	const chatSession = model.startChat({
		generationConfig,
		history: [
			{
				role: 'user',
				parts: [
					{
						text: "Input:\nHono v4.6.0 is now available!\n\nOne of the highlights of this release is the Context Storage Middleware. Let's introduce it.\n\nContext Storage Middleware\n\nMany users may have been waiting for this feature. The Context Storage Middleware uses AsyncLocalStorage to allow handling of the current Context object even outside of handlers.\n\nFor example, let’s define a Hono app with a variable message: string.\n\ntype Env = {\n  Variables: {\n    message: string\n  }\n}\n\nconst app = new Hono<Env>()\nTo enable Context Storage Middleware, register contextStorage() as middleware at the top and set the message value.\n\nimport { contextStorage } from 'hono/context-storage'\n\n//...\n\napp.use(contextStorage())\n\napp.use(async (c, next) => {\n  c.set('message', 'Hello!')\n  await next()\n})\n getContext() returns the current Context object, allowing you to get the value of the message variable outside the handler.\n\nimport { getContext } from 'hono/context-storage'\n\napp.get('/', (c) => {\n  return c.text(getMessage())\n})\n\n// Access the variable outside the handler.\nconst getMessage = () => {\n  return getContext<Env>().var.message\n}\nIn the case of Cloudflare Workers, you can also access the Bindings outside the handler by using this middleware.\n\ntype Env = {\n  Bindings: {\n    KV: KVNamespace\n  }\n}\n\nconst app = new Hono<Env>()\n\napp.use(contextStorage())\n\nconst setKV = (value: string) => {\n  return getContext<Env>().env.KV.put('key', value)\n}\nThanks @marceloverdijk !\n\nNew features\n\nfeat(secureHeader): add Permissions-Policy header to secure headers middleware #3314\nfeat(cloudflare-pages): enable c.env.eventContext in handleMiddleware #3332\nfeat(websocket): Add generics type to WSContext #3337\nfeat(jsx-renderer): set Content-Encoding when stream is true #3355\nfeat(serveStatic): add precompressed option #3366\nfeat(helper/streaming): Support Promise<string> or (async) JSX.Element in streamSSE #3344\nfeat(context): make fetch Response headers mutable #3318\nfeat(serve-static): add onFound option #3396\nfeat(basic-auth): added custom response message option #3371\nfeat(bearer-auth): added custom response message options #3372\nOther changes\n\nchore(jsx-renderer): fix typo in JSDoc by @taga3s in #3378\nchore(deno): use the latest jsr libraries for testing by @ryuapp in #3375\nfix(secure-headers): optimize getPermissionsPolicyDirectives function by @kbkn3 in #3398\nfix(bearer-auth): typo by @yusukebe in #3404\nNew Contributors\n\n@kbkn3 made their first contribution in #3314\n@hayatosc made their first contribution in #3337\n@inetol made their first contribution in #3366\nFull Changelog: v4.5.11...v4.6.0"
					}
				]
			},
			{
				role: 'model',
				parts: [
					{
						text: "\n\n**Version:** v4.6.0\n**Release Date:** 2024-09-19\n\n\n- **New Feature (Context Storage Middleware):**  Easily access and manage your Hono context data even outside of request handlers.  It's like having a backstage pass to the current request's info, no matter where you are in your code.\n- **New Feature:** Added more security headers for better protection.\n- **New Feature:** Improved CloudFlare Pages integration.\n- **New Feature:** Enhanced WebSocket functionality with generics.\n- **New Feature:** Streamlined handling of JSX elements.\n- **New Feature:** Added more customization options for file serving and authentication.\n- **Other Updates:**  Various bug fixes and improvements throughout the codebase, such as streamlining testing and enhancing the JSX renderer.\n\n\n**Quick Facts:**\n\n- **Context Storage Middleware:** Keep the current request's information readily available everywhere using AsyncLocalStorage.  \n- **Security:** Added the `Permissions-Policy` header to enhance security.\n- **CloudFlare Pages:** Access `c.env.eventContext` within handleMiddleware for better integration.\n- **WebSocket:** Improved WebSockets with generics support.\n- **JSX:**  Streamlined handling of JSX and `Promise<string>` for server-sent events (SSE).\n- **File Serving:** Added `precompressed` and `onFound` options for finer control.\n- **Authentication:** Increased flexibility with custom response messages for Basic and Bearer authentication.\n\n\n**Example: Context Storage Middleware**\n\n\n```typescript\ntype Env = {\n  Variables: {\n    message: string\n  }\n}\n\nconst app = new Hono<Env>()\n\napp.use(contextStorage())\n\napp.use(async (c, next) => {\n  c.set('message', 'Hello!')\n  await next()\n})\n\napp.get('/', (c) => {\n  return c.text(getMessage())\n})\n\n// Access the variable outside the handler.\nconst getMessage = () => {\n  return getContext<Env>().var.message\n}\n```\n\n**What's Changed:**\n- **Context Storage:** Added the Context Storage Middleware, a game-changer for keeping track of request context ([Full Details](https://github.com/honojs/hono/blob/main/docs/guides/middleware/context-storage.md)).\n- **Secure Headers:**  Added Permissions-Policy header to secure headers middleware ([PR #3314](https://github.com/honojs/hono/pull/3314)).\n- **CloudFlare Pages:** Enabled `c.env.eventContext` in handleMiddleware ([PR #3332](https://github.com/honojs/hono/pull/3332)).\n- **WebSocket:** Added generics type to WSContext ([PR #3337](https://github.com/honojs/hono/pull/3337)).\n- **JSX Renderer:** Set Content-Encoding when stream is true ([PR #3355](https://github.com/honojs/hono/pull/3355)).\n- **Serve Static:** Added precompressed option ([PR #3366](https://github.com/honojs/hono/pull/3366)).\n- **Streaming Helper:** Supported Promise<string> or (async) JSX.Element in streamSSE ([PR #3344](https://github.com/honojs/hono/pull/3344)).\n- **Context:** Made `fetch Response` headers mutable ([PR #3318](https://github.com/honojs/hono/pull/3318)).\n- **Serve Static:** Added onFound option ([PR #3396](https://github.com/honojs/hono/pull/3396)).\n- **Basic Auth:** Added custom response message option ([PR #3371](https://github.com/honojs/hono/pull/3371)).\n- **Bearer Auth:** Added custom response message options ([PR #3372](https://github.com/honojs/hono/pull/3372)).\n- **JSX Renderer:** Fixed typo in JSDoc ([PR #3378](https://github.com/honojs/hono/pull/3378)).\n- **Deno:** Updated to the latest jsr libraries for testing ([PR #3375](https://github.com/honojs/hono/pull/3375)).\n- **Secure Headers:** Optimized getPermissionsPolicyDirectives function ([PR #3398](https://github.com/honojs/hono/pull/3398)).\n- **Bearer Auth:** Fixed typo ([PR #3404](https://github.com/honojs/hono/pull/3404)).\n\n\n**New Contributors:**\n- **@kbkn3** made their first contribution ([PR #3314](https://github.com/honojs/hono/pull/3314)).\n- **@hayatosc** made their first contribution ([PR #3337](https://github.com/honojs/hono/pull/3337)).\n- **@inetol** made their first contribution ([PR #3366](https://github.com/honojs/hono/pull/3366)).\n\n**Full Changelog:** [View the full changelog](https://github.com/honojs/hono/compare/v4.5.11...v4.6.0)\n\n---\n"
					}
				]
			}
		]
	});

	const result = await chatSession.sendMessage(JSON.stringify({ text: notes, date }));
	console.log(result.response.text());

	return new Response(result.response.text(), {
		headers: {
			'content-type': 'text/plain'
		}
	});
};

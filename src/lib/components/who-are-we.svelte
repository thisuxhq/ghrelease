<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="fixed bottom-6 right-6 font-medium">
	<Popover.Root portal={null}>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" data-umami-event="Tap for Magic Button">Tap for Magic!</Button>
		</Popover.Trigger>
		<Popover.Content class="w-80 p-4 ">
			<div class="space-y-4">
				<div class="flex flex-col items-center justify-between gap-3 rounded-lg bg-white">
					<p class="ml-2">You’re curious, right? Check out what else we’ve created just for you!</p>

					<div class="flex w-full flex-row gap-3 px-3">
						<a href="https://uiino.com?utm_source=thisux&utm_medium=link" target="_blank" class="underline text-blue-500 hover:text-blue-700" aria-label="Uiino">
							Uiino
						</a>

						<a
							href="https://glance.sticai.com?utm_source=thisux&utm_medium=link"
							target="_blank"
							class="underline text-blue-500 hover:text-blue-700"
							aria-label="Glance"
						>
							Glance
						</a>

						<a
							href="https://spotlight.thisux.com?utm_source=thisux&utm_medium=link"
							target="_blank"
							class="underline text-blue-500 hover:text-blue-700"
							aria-label="spotlight"
						>
							Spotlight
						</a>

							<a
							href="https://ffmpeg.info?utm_source=thisux&utm_medium=link"
							target="_blank"
							class="underline text-blue-500 hover:text-blue-700"
							aria-label="ffmpeg info"
						>
							Ffmpeg
						</a>
					</div>

					<p class="ml-2">Got a cool project idea? We can help.</p>

					<div class="flex w-full flex-row items-start justify-start gap-3 px-3">
						<a href="https://ghrelease.thisux.com?utm_source=thisux&utm_medium=button&utm_campaign=visit_us" target="_blank" class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm px-3 py-2" data-umami-event="Visit Us Button">Visit us</a>
						<a href="https://cal.com/imsanju/15min?utm_source=thisux&utm_medium=button" target="_blank" class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow py-2 px-3" data-umami-event="Lets Talk Button">Let’s talk</a>
					</div>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>

<script>
    import { onMount } from 'svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';

    let results = [];
    let loading = true;

	const dangerCutoff = 60 * 60 * 3;
	const warningCutoff = 60 * 60 * 6;

	const asiaTimeCutoff = next4am(8);
	const euTimeCutoff = next4am(1);
	const usTimeCutoff = next4am(-5);

	const accountNames = ["Main", "DBD"];

	// Your accounts
	const accounts = [
		{
			name: "Main",
			uids: {
				asia: "814147984",
				us:   "646958280",
				tw:   "903698845",
				eu:   "738341282"
			}
		},
		{
			name: "DBD",
			uids: {
				asia: "853874772",
				us:   "646958477",
				tw:   "903600040",
				eu:   "739969506"
			}
		}
	];

	function next4am(offsetHours) {
		const now = new Date();

		// Build a date representing "today at 4 AM in that timezone"
		const utcYear = now.getUTCFullYear();
		const utcMonth = now.getUTCMonth();
		const utcDate = now.getUTCDate();

		// Target 4 AM in that timezone converted to UTC
		const targetUTC = new Date(Date.UTC(
			utcYear, utcMonth, utcDate,
			4 - offsetHours,   // shift 4 AM of the timezone into UTC
			0, 0, 0
		));

		// If that 4 AM has passed, move to tomorrow
		if (targetUTC <= now) {
			targetUTC.setUTCDate(targetUTC.getUTCDate() + 1);
		}

		return targetUTC - now; // milliseconds
	}

	function timeRemainingFormatted(ms) {
		const s = Math.floor(ms / 1000);
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const sec = s % 60;

		//return `${h}:${m}`;
		if (h > 3) {
			return `${h} hrs`;
		} else {
			return `${m} mins`;
		}
	}


	onMount(async () => {
		loading = false;
	});
</script>

<h2>Genshin Daily Tracking</h2>

{#if loading}
<div id="loadingOverlay">
<Progress class="flex justify-center items-center z-10 top-1/2 left-1/2" value={null}>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>
</div>
{:else}

{#each accountNames as accountName}
<h2 class="h2">{accountName}</h2>
<div class="table-wrap">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Server</th>
				<th>Work</th>
				<th>Resin</th>
				<th>Teapot</th>
				<th>Transformer</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each results as r}
                {#if r.account === accountName}
				<tr>
					<td>{r.server.toUpperCase()}</td>
					<td>
						<span
							class="badge
							{
							r.commissions > 0
							? "preset-tonal-warning"
							: "preset-tonal-success"
							}
						">
						{
						r.commissions == 0
						? "done"
						: r.server == 'us'
							? timeRemainingFormatted(usTimeCutoff)
							: r.server == 'eu'
								? timeRemainingFormatted(euTimeCutoff)
								: timeRemainingFormatted(asiaTimeCutoff)
						}
						</span>
					</td>
					<td>
						<span
							class="badge
							{
							r.resin_rate < dangerCutoff
							? 'preset-tonal-error'
							: r.resin_rate < warningCutoff
								? 'preset-tonal-warning'
								: 'preset-tonal-success'
							}
							">
							<div class="fraction">
								<span class="border-b">{r.resin}</span>
								<span class="border-b">{r.max_resin}</span>
								<span>
									{
										r.resin_rate > 0
										? r.resin_rate > dangerCutoff
											? Math.round(r.resin_rate/3600) + " hrs"
											: new Date(r.resin_full_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
										: 'full'
									}
								</span>
							</div>
						</span>
					</td>
					<td>
						<span
							class="badge
							{
							r.realm_rate < dangerCutoff
							? 'preset-tonal-error'
							: r.realm_rate < warningCutoff
								? 'preset-tonal-warning'
								: 'preset-tonal-success'
							}
							">
							<div class="fraction">
								<span class="border-b">{r.realm}</span>
								<span class="border-b">{r.max_realm}</span>
								<span>
									{
										r.realm_rate > 0
										? r.realm_rate > dangerCutoff
											? Math.round(r.realm_rate/3600) + " hrs"
											: new Date(r.realm_full_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
										: 'full'
									}
								</span>
							</div>
						</span>
					</td>
					<td>
						<span
						class="badge
						{
						r.transformer.reached
						? 'preset-tonal-error'
						: r.transformer.Day > 0
							? `preset-tonal-success`
							: `preset-tonal-warning`
						}
						">
						{
						r.transformer.reached
						? "ready"
						: r.transformer.Day > 0
							? `${r.transformer.Day} days`
							: `${r.transformer.Hour} hrs`
						}
						</span>
					</td>
				</tr>
                {/if}
			{/each}
		</tbody>
	</table>
</div>
{/each}

<hr class="my-8"/>
Archon Quest List
{#each accountNames as accountName}
<h3 class="h3">{accountName}</h3>
{#each results as r}
	<ul>
		<li>
			{#if r.account === accountName}
				{r.server.toUpperCase()}: {r.archon.chapter_num} - {r.archon.chapter_title}
			{/if}			
		</li>
	</ul>
{/each}
{/each}

{/if}

<style>
.fraction {
  display: flex;
  flex-direction: column; /* default: stacked for < 720px */
}

/* When viewport is >= 720px, place side by side with a slash */
@media (min-width: 720px) {
  .fraction {
    flex-direction: row;
    align-items: center;
  }

  .fraction span:not(:last-child) {
	border-bottom: none; /* remove bottom border when side by side */
  }

  .fraction span:not(:last-child)::after {
    content: " / ";
    margin: 0 6px;
  }

  .fraction span:last-child {
    /* remove spacing created by stacking */
    margin-top: 0;
  }
}

</style>
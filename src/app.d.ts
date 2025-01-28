// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare global {
	namespace App {
		interface Error {
			code:number,
			message:string,
		 }
		interface Locals {
			theme: string | undefined,
			access_token: string | undefined,
			owner: string | undefined
		}
	}
}

// THIS IS IMPORTANT!!!
export {};
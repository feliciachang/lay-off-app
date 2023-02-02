import type { Configuration } from '@happykit/flags/config'

// You can replace this with your exact flag types
export type AppFlags = {
  'interactive-cursors': boolean
}

export const config: Configuration<AppFlags> = {
  envKey: process.env.NEXT_PUBLIC_FLAGS_ENV_KEY!,
}

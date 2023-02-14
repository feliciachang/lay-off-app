import type { Configuration } from '@happykit/flags/config'

// You can replace this with your exact flag types
export type AppFlags = {
  'interactive-cursors': boolean
}

export const config: Configuration<AppFlags> = {
  envKey: "flags_pub_development_355528490409263703",
}

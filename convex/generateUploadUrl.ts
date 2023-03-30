import { mutation } from './_generated/server'

export default mutation(async ({ storage }) => {
  return await storage.generateUploadUrl();
});

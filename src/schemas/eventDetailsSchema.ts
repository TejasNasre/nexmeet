import { z } from 'zod'

export const eventDetailsSchema = z.object({
  event_title: z.string(),
  event_description: z.string(),
  event_images: z.array(z.string()),
  event_startdate: z.date(),
  event_enddate: z.date(),
  event_startenddate: z.date(),
  team_size : z.number(),
  event_formlink : z.string(),
  event_location : z.string(),
  event_price : z.number(),
});
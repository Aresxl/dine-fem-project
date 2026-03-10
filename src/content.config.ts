import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

export const collections = {
  menu: defineCollection({
    loader: file("src/data/menu.json"),
    schema: ({ image }) =>
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        alt: z.string(),
        gallery: z.object({
          mobile: image(),
          desktop: image(),
        }),
      }),
  }),
};

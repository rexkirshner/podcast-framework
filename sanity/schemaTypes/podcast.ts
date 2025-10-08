import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'podcast',
  title: 'Podcast',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Podcast Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'isActive',
      title: 'Podcast is Active',
      type: 'boolean',
      description: 'Toggle on if the podcast is actively releasing new episodes, off if the show has concluded',
      initialValue: true,
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'spotifyShowId',
      title: 'Spotify Show ID',
      type: 'string',
      description: 'The ID from the Spotify show URL',
    }),
    defineField({
      name: 'appleUrl',
      title: 'Apple Podcasts URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Small icon that appears in browser tabs (recommended: 32x32px or 64x64px)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'rssUrl',
      title: 'RSS Feed URL',
      type: 'url',
      description: 'RSS feed URL for podcast aggregators',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter/X URL',
      type: 'url',
      description: 'Link to podcast Twitter/X profile (optional)',
    }),
    defineField({
      name: 'discordUrl',
      title: 'Discord URL',
      type: 'url',
      description: 'Link to podcast Discord server (optional)',
    }),
    defineField({
      name: 'newsletterEnabled',
      title: 'Enable Newsletter Signup',
      type: 'boolean',
      description: 'Show newsletter signup forms on the website (only visible when podcast is active)',
      initialValue: false,
    }),
    defineField({
      name: 'convertKitApiKey',
      title: 'ConvertKit V3 API Secret',
      type: 'string',
      description: 'Your ConvertKit V3 API Secret (not V4 key - find in Account Settings → API Keys → V3 Key)',
      hidden: ({ document }) => !document?.newsletterEnabled,
    }),
    defineField({
      name: 'convertKitFormId',
      title: 'ConvertKit Form ID',
      type: 'string',
      description: 'The ID of your ConvertKit form for episode notifications',
      hidden: ({ document }) => !document?.newsletterEnabled,
    }),
  ],
})

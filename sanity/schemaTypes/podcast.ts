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
  ],
})

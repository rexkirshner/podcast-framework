import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'episode',
  title: 'Episode',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode Number',
      type: 'number',
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Format: HH:MM:SS or MM:SS',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showNotes',
      title: 'Show Notes',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'hosts',
      title: 'Hosts',
      type: 'array',
      of: [{type: 'reference', to: {type: 'host'}}],
    }),
    defineField({
      name: 'guests',
      title: 'Guests',
      type: 'array',
      of: [{type: 'reference', to: {type: 'guest'}}],
    }),
    defineField({
      name: 'spotifyEpisodeId',
      title: 'Spotify Episode ID',
      type: 'string',
      description: 'The ID from the Spotify episode URL (optional - will use show embed if not provided)',
    }),
    defineField({
      name: 'spotifyLink',
      title: 'Spotify Episode Link',
      type: 'url',
      description: 'Full Spotify episode URL',
    }),
    defineField({
      name: 'youtubeLink',
      title: 'YouTube Link',
      type: 'url',
      description: 'YouTube episode URL',
    }),
    defineField({
      name: 'applePodcastLink',
      title: 'Apple Podcast Link',
      type: 'url',
      description: 'Apple Podcasts episode URL',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Episode',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Episode Number, New',
      name: 'episodeNumberDesc',
      by: [{field: 'episodeNumber', direction: 'desc'}],
    },
    {
      title: 'Episode Number, Old',
      name: 'episodeNumberAsc',
      by: [{field: 'episodeNumber', direction: 'asc'}],
    },
    {
      title: 'Publish Date, New',
      name: 'publishDateDesc',
      by: [{field: 'publishDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      episodeNumber: 'episodeNumber',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, episodeNumber, media} = selection
      return {
        title: `Episode ${episodeNumber}: ${title}`,
        media,
      }
    },
  },
})

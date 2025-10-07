import { defineType } from 'sanity';

export default defineType({
  name: 'homepageConfig',
  title: 'Homepage Configuration',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Configuration Name',
      type: 'string',
      description: 'Internal name for this homepage configuration',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isActive',
      title: 'Active Configuration',
      type: 'boolean',
      description: 'Set this as the active homepage configuration for the site',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'podcast',
      title: 'Associated Podcast',
      type: 'reference',
      to: [{ type: 'podcast' }],
      description: 'Optional: Associate this configuration with a specific podcast (for multi-podcast setups)',
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Hero Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'style',
          title: 'Hero Style',
          type: 'string',
          options: {
            list: [
              { title: 'Full Height with Image', value: 'full-image' },
              { title: 'Compact with Logo', value: 'compact-logo' },
              { title: 'Text Only', value: 'text-only' },
            ],
          },
        },
        {
          name: 'customHeadline',
          title: 'Custom Headline',
          type: 'string',
          description: 'Override podcast tagline with custom text',
        },
        {
          name: 'customDescription',
          title: 'Custom Description',
          type: 'text',
          rows: 3,
          description: 'Override podcast description',
        },
      ],
    },
    {
      name: 'featuredEpisodes',
      title: 'Featured Episodes Carousel',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Featured Episodes',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Featured Episodes',
        },
        {
          name: 'autoplay',
          title: 'Auto-advance Carousel',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'interval',
          title: 'Auto-advance Interval (seconds)',
          type: 'number',
          initialValue: 6,
        },
      ],
    },
    {
      name: 'recentEpisodes',
      title: 'Recent Episodes List',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Recent Episodes',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Recent Episodes',
        },
        {
          name: 'count',
          title: 'Number of Episodes to Show',
          type: 'number',
          initialValue: 6,
          validation: (Rule) => Rule.min(1).max(20),
        },
        {
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Grid (Cards)', value: 'grid' },
              { title: 'List (Compact)', value: 'list' },
            ],
          },
          initialValue: 'grid',
        },
      ],
    },
    {
      name: 'featuredGuests',
      title: 'Featured Guests Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Featured Guests',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Featured Guests',
        },
        {
          name: 'count',
          title: 'Number of Guests to Show',
          type: 'number',
          initialValue: 6,
        },
      ],
    },
    {
      name: 'subscribe',
      title: 'Subscribe Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Subscribe Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Subscribe & Listen',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Buttons Only', value: 'buttons' },
              { title: 'Cards with Icons', value: 'cards' },
              { title: 'Compact Badges', value: 'badges' },
            ],
          },
          initialValue: 'buttons',
        },
      ],
    },
    {
      name: 'about',
      title: 'About Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show About Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'About the Show',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 5,
          description: 'Override podcast description for homepage',
        },
      ],
    },
    {
      name: 'newsletter',
      title: 'Newsletter Signup',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Newsletter Signup',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Stay Updated',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'provider',
          title: 'Email Provider',
          type: 'string',
          options: {
            list: [
              { title: 'Mailchimp', value: 'mailchimp' },
              { title: 'ConvertKit', value: 'convertkit' },
              { title: 'Substack', value: 'substack' },
              { title: 'Custom Form URL', value: 'custom' },
            ],
          },
        },
        {
          name: 'formUrl',
          title: 'Form URL / Embed Code',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'customSections',
      title: 'Custom Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content (HTML allowed)',
              type: 'text',
              rows: 5,
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers appear first',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPageConfig',
  title: 'About Page Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Configuration Title',
      type: 'string',
      description: 'Internal name for this configuration (e.g., "Main About Page")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable this configuration (only one should be active)',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),

    // About Section
    defineField({
      name: 'aboutSection',
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
          initialValue: 'The Show',
        },
        {
          name: 'content',
          title: 'About Content',
          type: 'array',
          of: [{type: 'block'}],
          description: 'Rich text content for the about section',
        },
      ],
    }),

    // Hosts Section
    defineField({
      name: 'hostsSection',
      title: 'Hosts Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Hosts Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Leave blank to auto-generate based on number of hosts (The Host / The Hosts)',
        },
        {
          name: 'hosts',
          title: 'Featured Hosts',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'host'}]}],
          description: 'Select which hosts to display on the About page',
        },
        {
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              {title: 'Cards (with photos)', value: 'cards'},
              {title: 'Simple List', value: 'list'},
            ],
          },
          initialValue: 'cards',
        },
      ],
    }),

    // Mission/Philosophy Section
    defineField({
      name: 'missionSection',
      title: 'Mission/Philosophy Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Mission Section',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Mission',
        },
        {
          name: 'content',
          title: 'Mission Content',
          type: 'array',
          of: [{type: 'block'}],
        },
      ],
    }),

    // Subscribe CTA Section
    defineField({
      name: 'subscribeCTA',
      title: 'Subscribe CTA Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Subscribe CTA',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'customTitle',
          title: 'Custom Title (optional)',
          type: 'string',
          description: 'Leave blank to use default based on podcast active status',
        },
        {
          name: 'customDescription',
          title: 'Custom Description (optional)',
          type: 'string',
          description: 'Leave blank to use default based on podcast active status',
        },
      ],
    }),

    // Community/Contribute Section
    defineField({
      name: 'communitySection',
      title: 'Community Section',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Community Section',
          type: 'boolean',
          initialValue: true,
          description: 'Will only show if podcast is active',
        },
        {
          name: 'customText',
          title: 'Custom Text (optional)',
          type: 'string',
          description: 'Leave blank to use default: "Want to contribute to the show?"',
        },
      ],
    }),

    // Custom Sections
    defineField({
      name: 'customSections',
      title: 'Custom Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Section Title'},
            {
              name: 'content',
              type: 'array',
              title: 'Content',
              of: [{type: 'block'}],
            },
            {name: 'order', type: 'number', title: 'Display Order', initialValue: 100},
          ],
        },
      ],
      description: 'Add any custom sections to the About page',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare({title, isActive}) {
      return {
        title: title,
        subtitle: isActive ? '✅ Active' : '❌ Inactive',
      }
    },
  },
})

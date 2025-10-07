import { defineType } from 'sanity';

export default defineType({
  name: 'theme',
  title: 'Theme Configuration',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Theme Name',
      type: 'string',
      description: 'Internal name for this theme configuration',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isActive',
      title: 'Active Theme',
      type: 'boolean',
      description: 'Set this theme as the active theme for the site',
      initialValue: false,
      validation: (Rule) => Rule.required().custom(async (isActive, context) => {
        // Only validate if trying to set as active
        if (!isActive) return true;

        const { document, getClient } = context;
        const client = getClient({ apiVersion: '2024-01-01' });

        // Build query to find other active themes
        const podcastId = document?.podcast?._ref;
        let query = `count(*[_type == "theme" && isActive == true && _id != $currentId`;

        if (podcastId) {
          // If associated with a podcast, check for other active themes for that podcast
          query += ` && podcast._ref == $podcastId`;
        } else {
          // If no podcast association, check for other active themes without podcast
          query += ` && !defined(podcast)`;
        }
        query += `])`;

        const count = await client.fetch(query, {
          currentId: document?._id || '',
          podcastId: podcastId || '',
        });

        if (count > 0) {
          return 'Only one theme can be active at a time. Please deactivate the other active theme first.';
        }

        return true;
      }),
    },
    {
      name: 'podcast',
      title: 'Associated Podcast',
      type: 'reference',
      to: [{ type: 'podcast' }],
      description: 'Optional: Associate this theme with a specific podcast (for multi-podcast setups)',
    },
    {
      name: 'colors',
      title: 'Brand Colors',
      type: 'object',
      fields: [
        {
          name: 'primary',
          title: 'Primary Brand Color',
          type: 'string',
          description: 'Hex color (e.g., #3B82F6)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
            invert: false,
          }).error('Must be a valid hex color (e.g., #3B82F6)'),
        },
        {
          name: 'secondary',
          title: 'Secondary Color',
          type: 'string',
          description: 'Hex color (e.g., #8B5CF6)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'background',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color (e.g., #F9FAFB)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'surface',
          title: 'Surface Color',
          type: 'string',
          description: 'Hex color (e.g., #FFFFFF)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'text',
          title: 'Text Color',
          type: 'string',
          description: 'Hex color (e.g., #111827)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'textMuted',
          title: 'Muted Text Color',
          type: 'string',
          description: 'Hex color (e.g., #6B7280)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'headerBackground',
          title: 'Header Background Color',
          type: 'string',
          description: 'Hex color for header/nav (e.g., #000000)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'footerBackground',
          title: 'Footer Background Color',
          type: 'string',
          description: 'Hex color for footer (e.g., #000000)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'headerText',
          title: 'Header Text Color',
          type: 'string',
          description: 'Hex color for header text (e.g., #ffffff for white)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
        {
          name: 'footerText',
          title: 'Footer Text Color',
          type: 'string',
          description: 'Hex color for footer text (e.g., #ffffff for white)',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
          }).error('Must be a valid hex color'),
        },
      ],
    },
    {
      name: 'typography',
      title: 'Typography',
      type: 'object',
      fields: [
        {
          name: 'headingFont',
          title: 'Heading Font',
          type: 'string',
          description: 'Font family for headings (e.g., "Inter", "Roboto")',
        },
        {
          name: 'bodyFont',
          title: 'Body Font',
          type: 'string',
          description: 'Font family for body text',
        },
        {
          name: 'googleFonts',
          title: 'Google Fonts to Load',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of Google Font names to import',
        },
      ],
    },
    {
      name: 'layout',
      title: 'Layout Settings',
      type: 'object',
      fields: [
        {
          name: 'maxWidth',
          title: 'Max Content Width',
          type: 'string',
          options: {
            list: [
              { title: 'Small (640px)', value: 'max-w-screen-sm' },
              { title: 'Medium (768px)', value: 'max-w-screen-md' },
              { title: 'Large (1024px)', value: 'max-w-screen-lg' },
              { title: 'Extra Large (1280px)', value: 'max-w-screen-xl' },
              { title: 'Full Width', value: 'max-w-full' },
            ],
          },
        },
        {
          name: 'borderRadius',
          title: 'Border Radius Style',
          type: 'string',
          options: {
            list: [
              { title: 'None (Sharp corners)', value: 'rounded-none' },
              { title: 'Small', value: 'rounded-sm' },
              { title: 'Medium', value: 'rounded-md' },
              { title: 'Large', value: 'rounded-lg' },
              { title: 'Extra Large', value: 'rounded-xl' },
              { title: 'Full (Pills)', value: 'rounded-full' },
            ],
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
});

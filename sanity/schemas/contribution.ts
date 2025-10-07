import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contribution',
  title: 'Community Contributions',
  type: 'document',
  fields: [
    defineField({
      name: 'contributionType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Episode Idea', value: 'episode-idea' },
          { title: 'Guest Recommendation', value: 'guest-recommendation' },
          { title: 'Question', value: 'question' },
          { title: 'Feedback', value: 'feedback' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    }),

    // Common fields (optional for anonymous submissions)
    defineField({
      name: 'submitterName',
      title: 'Submitter Name',
      type: 'string',
      description: 'Optional - submissions can be anonymous'
    }),
    defineField({
      name: 'submitterEmail',
      title: 'Submitter Email',
      type: 'string',
      description: 'Optional - submissions can be anonymous',
      validation: (Rule) => Rule.email()
    }),

    // Status tracking
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🆕 New', value: 'new' },
          { title: '👀 Reviewed', value: 'reviewed' },
          { title: '✅ Actioned', value: 'actioned' },
          { title: '📦 Archived', value: 'archived' }
        ],
        layout: 'radio'
      },
      initialValue: 'new'
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),

    // Episode Idea fields (conditional)
    defineField({
      name: 'episodeTopic',
      title: 'Episode Topic',
      type: 'string',
      description: 'Brief title for the episode idea (100 chars max)',
      validation: (Rule) => Rule.max(100),
      hidden: ({ document }) => document?.contributionType !== 'episode-idea'
    }),
    defineField({
      name: 'episodeDescription',
      title: 'Episode Description',
      type: 'text',
      description: 'Detailed description of the episode idea (500 chars max)',
      rows: 5,
      validation: (Rule) => Rule.max(500),
      hidden: ({ document }) => document?.contributionType !== 'episode-idea'
    }),
    defineField({
      name: 'episodeRationale',
      title: 'Why This Would Resonate',
      type: 'text',
      description: 'Optional - Why would this topic interest the audience? (300 chars max)',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      hidden: ({ document }) => document?.contributionType !== 'episode-idea'
    }),

    // Guest Recommendation fields (conditional)
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      description: 'Name of the recommended guest (100 chars max)',
      validation: (Rule) => Rule.max(100),
      hidden: ({ document }) => document?.contributionType !== 'guest-recommendation'
    }),
    defineField({
      name: 'guestBackground',
      title: 'Guest Background',
      type: 'text',
      description: 'What does this person do? (300 chars max)',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      hidden: ({ document }) => document?.contributionType !== 'guest-recommendation'
    }),
    defineField({
      name: 'guestRationale',
      title: 'Why This Guest',
      type: 'text',
      description: 'What makes them interesting for the show? (300 chars max)',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      hidden: ({ document }) => document?.contributionType !== 'guest-recommendation'
    }),
    defineField({
      name: 'guestContact',
      title: 'Guest Contact Info',
      type: 'string',
      description: 'Optional - Twitter, LinkedIn, email if known',
      hidden: ({ document }) => document?.contributionType !== 'guest-recommendation'
    }),

    // Question fields (conditional)
    defineField({
      name: 'question',
      title: 'Your Question',
      type: 'text',
      description: 'What would you like to ask? (500 chars max)',
      rows: 5,
      validation: (Rule) => Rule.max(500),
      hidden: ({ document }) => document?.contributionType !== 'question'
    }),
    defineField({
      name: 'questionContext',
      title: 'Context',
      type: 'text',
      description: 'Optional - Why are you asking this? (200 chars max)',
      rows: 3,
      validation: (Rule) => Rule.max(200),
      hidden: ({ document }) => document?.contributionType !== 'question'
    }),

    // Feedback fields (conditional)
    defineField({
      name: 'feedbackType',
      title: 'Feedback Type',
      type: 'string',
      options: {
        list: [
          { title: '👍 Praise', value: 'praise' },
          { title: '💡 Suggestion', value: 'suggestion' },
          { title: '🐛 Issue/Bug Report', value: 'bug' }
        ],
        layout: 'radio'
      },
      hidden: ({ document }) => document?.contributionType !== 'feedback'
    }),
    defineField({
      name: 'feedbackContent',
      title: 'Your Feedback',
      type: 'text',
      description: 'Share your thoughts (500 chars max)',
      rows: 5,
      validation: (Rule) => Rule.max(500),
      hidden: ({ document }) => document?.contributionType !== 'feedback'
    }),

    // Host notes (internal)
    defineField({
      name: 'hostNotes',
      title: 'Host Notes',
      type: 'text',
      description: 'Private notes - not visible to submitter',
      rows: 4
    })
  ],

  preview: {
    select: {
      type: 'contributionType',
      name: 'submitterName',
      status: 'status',
      date: 'submittedAt',
      episodeTopic: 'episodeTopic',
      guestName: 'guestName',
      question: 'question',
      feedbackType: 'feedbackType'
    },
    prepare({ type, name, status, date, episodeTopic, guestName, question, feedbackType }) {
      // Map contribution type to emoji and label
      const typeLabel = {
        'episode-idea': '💡 Episode Idea',
        'guest-recommendation': '🎙️ Guest',
        'question': '❓ Question',
        'feedback': '💬 Feedback'
      }[type] || type

      // Generate preview title based on type
      let contentPreview = ''
      if (type === 'episode-idea' && episodeTopic) {
        contentPreview = episodeTopic
      } else if (type === 'guest-recommendation' && guestName) {
        contentPreview = guestName
      } else if (type === 'question' && question) {
        contentPreview = question.substring(0, 50) + (question.length > 50 ? '...' : '')
      } else if (type === 'feedback' && feedbackType) {
        contentPreview = feedbackType
      }

      const fromName = name || 'Anonymous'
      const dateStr = new Date(date).toLocaleDateString()

      return {
        title: `${typeLabel}${contentPreview ? ': ' + contentPreview : ''} from ${fromName}`,
        subtitle: `${status} · ${dateStr}`
      }
    }
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'submittedAt', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }]
    },
    {
      title: 'Type',
      name: 'type',
      by: [{ field: 'contributionType', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }]
    }
  ]
})

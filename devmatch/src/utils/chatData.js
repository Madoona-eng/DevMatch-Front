export const chatData = [
  {
    id: 1,
    user: 'John Doe',
    text: 'Hey everyone! How are you doing today?',
    time: '10:30 AM',
    comments: [
      {
        id: 1,
        user: 'Alice',
        text: 'I\'m doing great! Thanks for asking.',
        time: '10:32 AM'
      },
      {
        id: 2,
        user: 'Bob',
        text: 'Pretty good. Working on some new projects.',
        time: '10:35 AM'
      }
    ]
  },
  {
    id: 2,
    user: 'Alice',
    text: 'Does anyone want to grab lunch later?',
    time: '11:45 AM',
    comments: []
  },
  {
    id: 3,
    user: 'Bob',
    text: 'I found this interesting article about React performance: https://example.com',
    time: '12:15 PM',
    comments: [
      {
        id: 1,
        user: 'John Doe',
        text: 'Thanks for sharing! I\'ll check it out.',
        time: '12:20 PM'
      }
    ]
  }
];
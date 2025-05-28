export const chatData = [
  {
    id: 1,
    user: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    text: 'Hey everyone! How are you doing today?',
    time: '10:30 AM',
    comments: [
      {
        id: 1,
        user: 'Alice',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: 'I\'m doing great! Thanks for asking.',
        time: '10:32 AM'
      },
      {
        id: 2,
        user: 'Bob',
        avatar: 'https://i.pravatar.cc/150?img=3',
        text: 'Pretty good. Working on some new projects.',
        time: '10:35 AM'
      }
    ]
  },
  {
    id: 2,
    user: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=2',
    text: 'Does anyone want to grab lunch later?',
    time: '11:45 AM',
    comments: []
  },
  {
    id: 3,
    user: 'Bob',
    avatar: 'https://i.pravatar.cc/150?img=3',
    text: 'Check out this cool article about React performance!',
    time: '12:15 PM',
    comments: [
      {
        id: 1,
        user: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: 'Thanks for sharing! I\'ll check it out.',
        time: '12:20 PM'
      }
    ]
  }
];
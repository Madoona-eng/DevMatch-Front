
import ShadowDOM from 'react-shadow';

export default function Sidebar() {
  return (
      <ShadowDOM.div mode="open">
      <link rel="stylesheet" href="/tailwind-chat-built.css" />
    <div className="sidebar">
      <h3>Group Members</h3>
      <ul>
        <li>John Doe</li>
        <li>Alice Smith</li>
        <li>Bob Johnson</li>
      </ul>
    </div>
     </ShadowDOM.div>
  );
}
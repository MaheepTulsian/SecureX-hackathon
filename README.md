# SafeNet.io

SafeNet.io is an interactive cybersecurity chatbot designed to educate and empower users with actionable knowledge about cybersecurity. It simplifies complex concepts, provides dynamic suggestions, and ensures a seamless and engaging user experience.

---

## Features

- **Cybersecurity Assistance**: Provides detailed, visually appealing HTML responses to user queries.
- **Dynamic Suggestions**: Generates context-aware follow-up questions to guide users in exploring related topics.
- **Conversation Context**: Tracks conversation history to ensure relevant responses and suggestions.
- **Interactive Design**: Displays follow-up suggestions as clickable buttons for easy engagement.
- **Seamless Integration**: Built with React.js for the frontend and FastAPI for the backend.

---

## How It Works

1. **Query Processing**: User queries are sent to the `/generate-cybersecurity-content` API for an AI-generated, educative response.
2. **Follow-Up Suggestions**: Once the bot responds, the `/generate-suggestions` API generates two related questions based on the conversation context.
3. **User Interaction**:
   - Users can click a suggestion to send it as the next query.
   - Typing a new query clears the suggestions for a fresh interaction.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: FastAPI
---

### Prerequisites
- Python 3.8+
- Node.js 14+


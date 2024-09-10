
# **Booken: A Neurodivergent Dictionary for Knowledge Discovery**

Welcome to **Booken**, a web application designed for individuals who want to explore, organize, and expand their knowledge with a focus on neurodivergent communities. This project enables users to manage and search through an extensive dictionary of words (Ords) with definitions, tagged and organized with color-coded categories for better accessibility.

## **Features**

- **Search and Filter Ords:** Easily search Ords by keywords, tags, and phrases. Apply filters dynamically with `Enter` and clear them when necessary.
- **Tags System:** Words (Ords) are categorized with tags that help users explore related content. Tags are color-coded for better organization and visual appeal.
- **Tag Management:** Add, edit, and delete tags easily. When a tag is deleted, all references to it in the Ords are cleaned up automatically to maintain database integrity.
- **Responsive Text-to-Speech (TTS) Feature:** Click to have the app read out the definition of any Ord. The TTS system includes controls for starting, pausing, resuming, and stopping the narration.
- **Rich Text Editing:** Ords' definitions support rich text content, and the display is sanitized to ensure security and proper formatting.

## **Tech Stack**

- **Frontend:**
  - React + TypeScript
  - CSS Modules for styling
  - Chroma.js for color manipulation
  - Speech Synthesis API for TTS
  - DOMPurify for HTML sanitization

- **Backend:**
  - Node.js + Next.js (Server-Side Rendering & API routes)
  - MongoDB for database management
  - Axios for HTTP requests

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (>= 14.x)
- **MongoDB** instance running locally or remotely
- **npm** or **yarn** (your choice)

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/sebastian-foder/booken.git
cd booken
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

Create a `.env` file in the root directory and add the following:

```bash
DB_END_POINT=your-mongodb-api-endppoint
DB_API_KEY=your-mongodb-api-key
DB_NAME=your-mongodb-database-name
DB_SOURCE=your-mongodb-datasource
URL=your-url(normaly http://localhost:3000)
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## **Usage**

### **Tagging System**

Tags are applied to Ords to categorize them. You can filter Ords by selecting relevant tags from the interface. The tags system uses **color coding** for easier navigation and quick recognition. You can also click on a tag to filter Ords that share the same tag.

### **Dynamic Search with Filters**

Use the search bar to find Ords. When you press `Enter`, the search is immediately applied. The system filters both Ords and tags to match your search query, making it quick to find relevant information.

### **Text-to-Speech (TTS)**

For better accessibility, users can click the "Read Definition" button to have the app read out the definition aloud. The TTS feature comes with controls to:

- **Start**: Begin reading the Ord's definition.
- **Pause**: Pause the reading at any time.
- **Resume**: Continue the reading from where it was paused.
- **Stop**: Stop the reading altogether.

### **Tag Management**

- **Create/Update Tags**: Add new tags with primary and secondary color options.
- **Delete Tags**: Safely delete tags. The system ensures that all references to deleted tags are removed from the associated Ords.

## **API Endpoints**

- **GET /api/ord/[id]**: Fetches the specific Ord by its unique ID.
- **DELETE /api/tags/[id]**: Deletes a tag by ID and removes all references to it from the Ords.
- **POST /api/tags**: Creates a new tag.

## **Future Plans**

- **User Accounts**: Personalized tagging system based on individual preferences.
- **Improved TTS**: Support for voice selection and speed adjustment.
- **Tag Suggestions**: Autocomplete and suggest related tags when tagging Ords.

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Enjoy exploring and expanding your knowledge with **Booken**! 🌈

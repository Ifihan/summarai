# SummarAI - AI-Powered Document Summarization Tool

SummarAI is a web-based application that uses Google's Vertex AI to provide text summarization, key point extraction, and document analysis. The tool is designed to transform lengthy text/documents into concise and insightful summaries, presenting the results in a clean and markdown-styled format.

---

## 🚀 **Features**

- **Text Summarization:** Generate concise summaries of long documents.
- **Key Point Extraction:** Highlight important information from the text.
- **Text Analysis:** Provide in-depth analysis and insights.
- **Light/Dark Mode:** Switch between themes for a comfortable reading experience.

---

## 🛠 **Tech Stack**

- **Frontend:** HTML, CSS, JavaScript (Marked.js for Markdown rendering).
- **Backend:** Flask (Python).
- **AI & NLP:** Google Vertex AI.
- **Cloud Storage/Deployment:** Google Cloud Storage.

---

## ⚙️ **Setup Instructions**

### 1. **Fork and clone the repository**

```sh
git clone https://github.com/yourusername/summarai.git
cd summarai
```

### 2. **Create virtual environmnent and install dependencies**

```sh
pip install -r requirements.txt
```

### 3. **Setup Environment Variables**

Create a `.env` file in the root directory and add:

```
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 4. **Run the Application**

```sh
python app.py
```

### 5. **Access the Application**

Open your browser and navigate to:

```
http://localhost:5000
```

---

## 🎯 **How to Use**

1. Paste your document or text into the input box.
2. Choose an action: **Summarize**, **Extract Key Points**, or **Analyze**.
3. View the formatted result in the result section.
4. Copy the result using the **Copy** button if needed.

---

## 💡 **Future Enhancements**

- Implement user authentication.
- Introduce multi-language support.

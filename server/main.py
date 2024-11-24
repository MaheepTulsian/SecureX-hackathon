from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

app = FastAPI()

# Allow CORS for specific origins
origins = [
    "http://localhost:5173",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

# Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash')

# Request Model
class CyberSecurityRequest(BaseModel):
    topic: str
    
class SuggestionRequest(BaseModel):
    conversation_history: list  # List of dicts with "role" and "content" fields

# Function for the chatbot response
def generate_cybersecurity_html_response(topic):
    pre_prompt = """
    You are an expert cybersecurity assistant. Your goal is to provide precise, actionable, and concise responses on cybersecurity and information security topics.
    Strictly be on the cybersecurity topics, if anything else is asked, ask user to stay on the topic. In your responses be inspired from NIST CSF compliance and best practices.
    Always format your response as informative HTML, including headings, lists, and emphasized text where appropriate.
    The response should be user-friendly and visually appealing. Add Inline styles as well as CSS classes to style your HTML response, You only need to style the font sizes and decorations. Keep the sizes like general text and make it look more appealing.
    """
    prompt = f"{pre_prompt}\nTopic: {topic}\nPlease generate an informative HTML response."
    response = model.generate_content(prompt)
    html_response = response.text.strip().strip('```').replace('html', '', 1).strip()
    print(html_response)
    return html_response

# API Endpoint
@app.post("/generate-cybersecurity-content")
async def generate_cybersecurity_content(request: CyberSecurityRequest):
    try:
        response_html = generate_cybersecurity_html_response(request.topic)
        return {"html_response": response_html}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI application with uvicorn
# Save this file and run with: `uvicorn main:app --reload`

# Pre-prompt for suggestion generation
SUGGESTION_PRE_PROMPT = """
You are a cybersecurity expert assistant chatbot. Your task is to analyze the conversation history provided and generate two thoughtful, detailed, and educative suggestions for the next potential questions the user can ask. These suggestions should be based on the context of the conversation and should align with cybersecurity and information security topics.

Each suggestion should:
1. Be educative and provide insights into areas the user might find interesting or useful.
2. Be presented as HTML with clear formatting and separated into distinct sections.
"""

@app.post("/generate-suggestions")
async def generate_suggestions(request: SuggestionRequest):
    try:
        # Prepare the conversation history
        conversation_context = "\n".join(
            f"{entry['role'].capitalize()}: {entry['content']}" for entry in request.conversation_history
        )
        
        # Construct the prompt
        prompt = f"{SUGGESTION_PRE_PROMPT}\n\nConversation History:\n{conversation_context}\n\nGenerate two suggestions."

        # Use Gemini API to generate the content
        response = model.generate_content(prompt)
        
        # Return the suggestions as HTML
        return {"suggestions_html": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating suggestions: {str(e)}")
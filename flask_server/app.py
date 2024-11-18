from flask import Flask, request, jsonify
import requests
import time
import json
import re
from huggingface_hub import InferenceClient
from openai import OpenAI

client = OpenAI(
base_url="https://api-inference.huggingface.co/v1/",
api_key="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"
)
app = Flask(__name__)

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/msmarco-distilbert-base-tas-b"
API_URL2 = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct"
api_token = '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'
api_key = "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"
headers = {"Authorization": f"Bearer {api_token}"}


# for evaluating quiz using LLM
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    try:
        return response.json()
    except ValueError:
        return {"error": "Invalid response from API"}

@app.route('/receive_data', methods=['POST'])
def receive_data():
    print("hello")
    sentence_sets = request.json
    print(f"Received data: {sentence_sets}")

    results = []
    for sentence_set in sentence_sets:
        # Prepare the payload with the sentences formatted as sentence1 and sentence2
        payload = {
            "inputs": {
                "source_sentence": sentence_set["source_sentence"],
                "sentences": [sentence_set["user_sentences"]]
            }
        }
        response_data = query(payload)
        print(f"API response: {response_data}")

        # Retry logic for when the model is loading
        if isinstance(response_data, dict) and "error" in response_data and "currently loading" in response_data["error"]:
            print("Model is currently loading, waiting before retrying...")
            time.sleep(20)  # Wait for 20 seconds before retrying
            response_data = query(payload)
            print(f"API response after retrying: {response_data}")

        # Check if the response_data is a list and contains similarity scores as floats
        if isinstance(response_data, list) and len(response_data) > 0:
            similarity_score = response_data[0]  # Extract the similarity score (first item in the list)
        else:
            similarity_score = 0  # Default to 0 if the response format is unexpected

        accuracy = f"{similarity_score * 100:.2f}%"  # Convert to percentage and format to two decimal places

        result_set = {
            "your_answer": sentence_set["source_sentence"],
            "right_answer": sentence_set["user_sentences"],
            "accuracy": accuracy
        }
        results.append(result_set)

    response_data = {'message': 'Data received successfully', 'results': results}
    return jsonify(response_data)


def generate_formatted_prompt(topic):
        mcq_prompt = f"""You are tasked with generating exactly five diverse multiple-choice questions (MCQs) in JSON format. Ensure the questions cover a variety of subtopics and difficulty levels relevant to the topic "{topic}". Structure your response in the specified format, ensuring
    1. Options are varied and not repetitive across questions.
    2. Correct answers are clearly identified and marked using the given format.

Here is the format reference:
{{
  "mcq": [
    {{
      "question": "What is the average time complexity of searching in a balanced binary search tree?",
      "options": [
        "O(n)",
        "O(log n)",
        "O(1)",
        "O(n^2)"
      ],
      "correct": "1"
    }},
    {{
      "question": "Which traversal method visits nodes in ascending order in a binary search tree?",
      "options": [
        "Pre-order traversal",
        "Post-order traversal",
        "In-order traversal",
        "Level-order traversal"
      ],
      "correct": "2"
    }},
    {{
      "question": "What is the maximum number of nodes at level k in a binary tree?",
      "options": [
        "2^(k-1)",
        "k",
        "2^k",
        "k^2"
      ],
      "correct": "0"
    }},
    {{
      "question": "In a binary search tree, what is the time complexity of inserting a new node in the worst case?",
      "options": [
        "O(log n)",
        "O(n)",
        "O(1)",
        "O(n log n)"
      ],
      "correct": "1"
    }},
    {{
      "question": "Which property distinguishes a binary search tree from a general binary tree?",
      "options": [
        "All levels are completely filled.",
        "Nodes follow the property: left child < parent < right child.",
        "Every node has at most two children.",
        "Tree height is balanced."
      ],
      "correct": "1"
    }}
  ]
}}

Follow these instructions:
1. Use the above example only as a format guide. Do not copy or repeat the example content.
2. Generate exactly one new multiple-choice question about the topic "{topic}" with unique content.
3. Strictly return only the JSON object as specified, with no additional text or commentary.
4. Ensure the correct answers are distributed and not clustered together (e.g., don't always use the second option as the correct one).

Your response must follow the structure exactly but contain unique content relevant to the topic "{topic}".

"""

        descriptive_prompt = f"""You are tasked with generating exactly five descriptive questions and their corresponding answers in JSON format. Ensure the questions are diverse, unique, and relevant to the topic "{topic}". Structure your response using the given format, ensuring:

1. Questions vary in focus, such as conceptual understanding, practical applications, detailed processes, or critical comparisons within the topic.
2. Answers are comprehensive yet concise, providing clear explanations or steps as needed.
3. Avoid using similar phrasing, concepts. 

Here is the format reference:
{{
  "descriptive": [
    {{
      "question": "Explain the difference between a binary tree and a binary search tree.",
      "answer": "A binary tree is a tree structure where each node has at most two children, while a binary search tree is a binary tree with the additional property that the left child is smaller than the parent, and the right child is larger."
    }},
    {{
      "question": "What is the significance of in-order traversal in a binary search tree?",
      "answer": "In-order traversal of a binary search tree produces nodes in sorted (ascending) order, which makes it useful for operations requiring ordered data."
    }},
    {{
      "question": "Describe the process of deleting a node with two children in a binary search tree.",
      "answer": "To delete a node with two children, replace it with its in-order predecessor (the largest node in its left subtree) or its in-order successor (the smallest node in its right subtree) and then delete that node."
    }},
    {{
      "question": "What is the height of a binary tree, and why is it significant?",
      "answer": "The height of a binary tree is the number of edges on the longest path from the root to a leaf. It is significant because it affects the time complexity of operations such as search, insert, and delete."
    }},
    {{
      "question": "How can you determine if a given binary tree is a binary search tree?",
      "answer": "To determine if a binary tree is a binary search tree, check if it satisfies the BST property for all nodes: the left subtree contains only nodes with values less than the parent, and the right subtree contains only nodes with values greater than the parent."
    }}
  ]
}}

Follow these instructions:
1. Use the above example only as a format guide. Do not copy or repeat the example.
2. Generate exactly one new descriptive question about the topic "{topic}" and its answer.
3. Strictly return only the JSON object as specified, with no additional text or commentary.
4. Avoid using similar or overlapping content from the example provided.


Your response must follow the structure exactly but contain unique content relevant to the topic "{topic}".

"""

        return [mcq_prompt, descriptive_prompt]





# for evaluating quiz using LLM
def get_model_response(prompt):
    client = OpenAI(
        base_url="https://api-inference.huggingface.co/v1/",
        api_key="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"
    )

    messages = [
        {
            "role": "system",
            "content": "You are a quiz generator that returns only valid JSON responses with no additional text or explanations."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    try:
        # Call the model with streaming enabled
        stream = client.chat.completions.create(
            model="meta-llama/Llama-3.2-1B-Instruct",
            messages=messages,
            max_tokens=3000,
            stream=True,
            temperature=0.5
        )

        # Collect and process the streamed output
        output = ""
        for chunk in stream:
            delta = chunk.choices[0].delta.get("content", "")
            output += delta

        return output

    except Exception as e:
        return json.dumps({"error": f"Request error: {str(e)}"})

def generate_quiz(topic):
    quizArray = {"mcq": [], "descriptive": []}

    # Generate MCQs
    mcq_prompt = generate_formatted_prompt(topic=topic)[0]
    mcq_response = get_model_response(mcq_prompt)
    try:
        mcq_data = json.loads(mcq_response)
        if "mcq" in mcq_data:
            quizArray["mcq"].extend(mcq_data["mcq"])
    except json.JSONDecodeError:
        raise Exception("Error parsing MCQ response")

    # Generate Descriptive Questions
    descriptive_prompt = generate_formatted_prompt(topic=topic)[1]
    descriptive_response = get_model_response(descriptive_prompt)
    try:
        descriptive_data = json.loads(descriptive_response)
        if "descriptive" in descriptive_data:
            quizArray["descriptive"].extend(descriptive_data["descriptive"])
    except json.JSONDecodeError:
        raise Exception("Error parsing descriptive response")

    return quizArray

@app.route('/receive_quiz_topic', methods=['POST'])
def receive_quiz_topic():
    """Endpoint to receive a quiz topic and generate questions."""
    try:
        topic = request.json.get("topicTitle", "")
        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # Generate the quiz
        quizArray = generate_quiz(topic)
        return jsonify(quizArray), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while generating the quiz."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
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

# API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/msmarco-distilbert-base-tas-b"
API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L12-v2"
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

        similarity_score = max(0,similarity_score)

        accuracy = f"{similarity_score * 100:.2f}%"  # Convert to percentage and format to two decimal places
       
        result_set = {
            "your_answer": sentence_set["source_sentence"],
            "right_answer": sentence_set["user_sentences"],
            "accuracy": accuracy
        }
        results.append(result_set)

    response_data = {'message': 'Data received successfully', 'results': results}
    return jsonify(response_data)


# def clean_json(input_str):
#     # Strip leading and trailing whitespace
#     input_str = input_str.strip()
    
#     # Alternate trimming characters from the front and back
#     front = True
#     while input_str:
#         try:
#             # Try parsing the string as JSON
#             return json.loads(input_str)
#         except json.JSONDecodeError:
#             # Remove one character alternately from front and back
#             if front:
#                 input_str = input_str[1:]  # Remove the first character
#             else:
#                 input_str = input_str[:-1]  # Remove the last character
#             front = not front  # Switch to the other end next time
#     raise ValueError("Unable to extract valid JSON from input")




# def query(payload):
#     response = requests.post(API_URL, headers=headers, json=payload)
#     try:
#         return response.json()
#     except ValueError:
#         return {"error": "Invalid response from API"}

# @app.route('/receive_data', methods=['POST'])
# def receive_data():
#     print("hello")
#     sentence_sets = request.json
#     print(f"Received data: {sentence_sets}")

#     results = []
#     for sentence_set in sentence_sets:
#         # Prepare the payload with the question and context
#         payload = {
#             "inputs": {
#                 "question": sentence_set["source_sentence"],  # Treat as the question
#                 "context": sentence_set["user_sentences"]     # Treat as the context
#             }
#         }
#         response_data = query(payload)
#         print(f"API response: {response_data}")

#         # Retry logic for when the model is loading
#         if isinstance(response_data, dict) and "error" in response_data and "currently loading" in response_data["error"]:
#             print("Model is currently loading, waiting before retrying...")
#             time.sleep(20)  # Wait for 20 seconds before retrying
#             response_data = query(payload)
#             print(f"API response after retrying: {response_data}")

#         # Extract the answer and confidence from the response
#         if isinstance(response_data, dict) and "answer" in response_data:
#             answer = response_data.get("answer", "N/A")  # Extract the predicted answer
#             confidence = response_data.get("score", 0)  # Extract confidence score (default 0)
#         else:
#             answer = "N/A"
#             confidence = 0

#         accuracy = f"{confidence * 100:.2f}%"  # Convert to percentage and format to two decimal places

#         result_set = {
#             "your_answer": sentence_set["source_sentence"],
#             "right_answer": sentence_set["user_sentences"],
#             "predicted_answer": answer,
#             "accuracy": accuracy
#         }
#         results.append(result_set)

#     response_data = {'message': 'Data received successfully', 'results': results}
#     return jsonify(response_data)



def generate_formatted_prompt(topic):
        mcq_prompt = f"""
You are tasked with generating exactly five diverse multiple-choice questions (MCQs) in valid JSON format. Each question should be relevant to the topic "{topic}", covering a variety of subtopics and difficulty levels. Follow these detailed instructions:

1. **Content Requirements**:
   - Ensure options are varied, clear, and not repetitive across questions.
   - Clearly indicate the correct answer by specifying its index as "0", "1", "2", or "3".

2. **Formatting Rules**:
   - Return the response as a single JSON object.
   - Adhere strictly to the provided JSON structure. No additional text, explanations, or deviations are allowed.
   - Structure the JSON with exactly five MCQs as shown in the format example below.

3. **Example Format** (do not repeat the example content, only use it as a structural reference):
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

4. **Response Behavior**:
   - Avoid clustering the correct answers (e.g., do not always use the same index for correct options).
   - Use unique content for each question, relevant to the topic "{topic}".

5. **Output Expectations**:
   - Return **only** the JSON object. Do not include any additional explanations, commentary, or text.

Generate exactly five multiple-choice questions in valid JSON format following these instructions.
"""


        descriptive_prompt = f"""
You are tasked with generating exactly five descriptive questions and their corresponding answers in valid JSON format. The questions should be diverse, unique, and relevant to the topic "{topic}". Follow these detailed instructions:

1. **Content Requirements**:
   - Each question should focus on different aspects of the topic
   - Answers should be concise yet comprehensive, providing clear explanations, definitions, or steps.

2. **Formatting Rules**:
   - Return the response as a single JSON object.
   - Adhere strictly to the provided JSON structure. No additional text, explanations, or deviations are allowed.
   - Ensure that questions and answers avoid repetition or overlap in phrasing or content.

3. **Example Format** (use as a structural guide only):
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

4. **Response Behavior**:
   - Do not use content similar to the example provided above.
   - Ensure each question is unique and introduces a new aspect of the topic "{topic}".
   - Strictly return only the JSON object. Any additional text, commentary, or explanations will invalidate the response.

5. **Output Expectations**:
   - Generate exactly five descriptive questions and their corresponding answers in valid JSON format.
   - Avoid overlapping content and ensure variety in the focus and structure of each question.

Generate the JSON object now.
"""


        return [mcq_prompt, descriptive_prompt]



system_quiz = """" You are a quiz and answer generator. Your task is to create well-structure and valid JSON responses for two distinct types of content: multiple-choice questions (MCQs) and descriptive questions with answers. Follow these guidelines strictly to ensure valid and high-quality output:

### General Rules:
1. Always return a valid JSON object. Responses with additional text, commentary, or deviations from the specified format are not acceptable.
2. Ensure all questions are relevant to the given topic and exhibit diversity in focus, subtopics, and difficulty levels.
3. Avoid repetitive phrasing, overlapping content, or clustering of correct answers in MCQs.
4. Use the provided JSON structures for each type of content.
### For MCQs:
Generate a valid JSON object with exactly five multiple-choice questions, structured as follows:
{
  "mcq": [
    {
      "question": "Sample question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": "index of correct option (0, 1, 2, or 3)"
    },
    ...
  ]
} 
### For Descriptive:
Generate a valid JSON object with exactly five descriptive questions and their corresponding answers:
{
  "descriptive": [
    {
      "question": "Sample descriptive question?",
      "answer": "Sample answer providing a clear, concise explanation or process."
    },
    ...
  ]
}
"""


# for evaluating quiz using LLM
def get_model_response(prompt):
    client = OpenAI(
        base_url="https://api-inference.huggingface.co/v1/",
        api_key="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"
    )

    messages = [
        {
  "role": "system",
  "content": system_quiz
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
            stop=["<END>"],
            temperature=0.5
        )

        # Collect and process the streamed output
        output = ""
        # print("kk")
        # print(stream)
        # print("kk")
        for chunk in stream:
            delta = chunk.choices[0].delta
            output += delta.content if delta.content else ""

        return output

    except Exception as e:
        return json.dumps({"error": f"Request error: {str(e)}"})

def generate_quiz(topic):
    quizArray = {"mcq": [], "descriptive": []}

    # Generate MCQs
    mcq_prompt = generate_formatted_prompt(topic=topic)[0]
    # print(mcq_prompt)
    mcq_response = get_model_response(mcq_prompt)

    # print(mcq_response)

    print("ss")
    print(mcq_response)
    print("ss")
    try:
        start_index = mcq_response.find('{')
        end_index = mcq_response.rfind('}')

        if start_index != -1 and end_index != -1 and start_index < end_index:
            mcq_response = mcq_response[start_index:end_index + 1]


        mcq_data = json.loads(mcq_response)
        print("Succss")

        # for question in mcq_response["mcq"]:
        #   if question["correct"] not in {"0","1","2","3"}:
        #     question["correct"] = "3"

        if "mcq" in mcq_data:
            quizArray["mcq"].extend(mcq_data["mcq"])
    except json.JSONDecodeError:
        raise Exception("Error parsing MCQ response")

    # Generate Descriptive Questions
    descriptive_prompt = generate_formatted_prompt(topic=topic)[1]
    descriptive_response = get_model_response(descriptive_prompt)
    print("ehllo")
    print(descriptive_response)
    print("fff")

    try:
        print("Htruing")

        start_index = descriptive_response.find('{')
        end_index = descriptive_response.rfind('}')

        if start_index != -1 and end_index != -1 and start_index < end_index:
            descriptive_response = descriptive_response[start_index:end_index + 1]

        descriptive_data = json.loads(descriptive_response)
        print("hsucc")
        if "descriptive" in descriptive_data:
            quizArray["descriptive"].extend(descriptive_data["descriptive"])
    except json.JSONDecodeError:
        raise Exception("Error parsing descriptive response")

    # print("ssdfsdf")
    # print(quizArray)
    # print("sssfds")
    return quizArray

@app.route('/receive_quiz_topic', methods=['POST'])
def receive_quiz_topic():
    """Endpoint to receive a quiz topic and generate questions."""
    try:
        topic = request.json.get("topicTitle", "")
        print(topic)
        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # Generate the quiz
        quizArray = generate_quiz(topic)

        # print("uy")
        # print(quizArray)
        # print("ut")

        return jsonify(quizArray), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while generating the quiz."}), 500
    

def gen_prompt_for_improvement():
    prompt = """
You are an AI assistant that generates natural language sentences for users to improve their learning on an educational platform where quizzes are taken on various topics. Your task is to generate personalized feedback for the user based **exclusively** on the topics and scores provided in the `progress_on_quiz` variable.

`progress_on_quiz`: ${ new_array }

### Goal:
Provide personalized recommendations in simple natural language sentences in short bullet points.

### Instructions:
1. Analyze the topics and scores in the `progress_on_quiz`
2. For each topic in the input:
   - Assess the user's performance based on their score.
   - Provide concise, actionable feedback directly related to the topic and score in natural language sentences.
3. Ensure the feedback includes:
   - A summary of the user's performance for the topic.
   - Specific suggestions to improve their understanding.
   - Optional resource recommendations relevant to the topic.
4. **Do not** write code or reference topics or scores not included in the input.
5. Output only plain text in the format specified below.

### Output Format:
For each topic:
- Topic: topicTitle , Score: quizScore
  - Action Plan: personalized feedback based on the score
  - Resource: optional resource suggestion for further learning

### Example Output:
- Topic: Time Complexity (Score: 45)
  - Action Plan: Review basics of Big O notation and practice complexity analysis.
  - Resource: [Beginner's Guide to Time Complexity (YouTube)]

- Topic: Sorting Algorithms (Score: 75)
  - Action Plan: Explore advanced techniques like radix sort and external sorting.
  - Resource: [LeetCode Sorting Section]

### Note:
- Stick strictly to the topics and scores provided in `progress_on_quiz`.
"""
    return prompt


# for evaluating quiz using LLM
def get_model_response_improvement(prompt):
    client = OpenAI(
        base_url="https://api-inference.huggingface.co/v1/",
        api_key="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"
    )

    messages = [

{
  "role": "system",
  "content": "You are an AI assistant that generates recommendations and responses in natural, human-like language. You must avoid generating any code, focusing purely on textual explanations and advice."
},
	{ "role": "user", "content": prompt },
]


    try:
        # Call the model with streaming enabled
        stream = client.chat.completions.create(
            model="meta-llama/Llama-3.2-1B-Instruct",
	      messages= messages,
	      max_tokens=3000,
        stop=["<END>"],
        temperature = 0.1,
	      stream=True
        )

        # Collect and process the streamed output
        output = ""
        # print("kk")
        # print(stream)
        # print("kk")
        for chunk in stream:
            delta = chunk.choices[0].delta
            output += delta.content if delta.content else ""

        return output

    except Exception as e:
        return json.dumps({"error": f"Request error: {str(e)}"})


@app.route('/receive_for_improvement', methods=['POST'])
def receive_for_improvement():
    """Endpoint to receive progress_on_quiz."""
    try:
        progress_on_quiz = request.json.get("progress_on_quiz", "")
        print(progress_on_quiz)
        if not progress_on_quiz:
            return jsonify({"error": "Progress_on_quiz is required"}), 400

        # Generate the quiz
        new_array = [{k: v for k, v in item.items() if k != "topicId"} for item in progress_on_quiz]
        prompt = gen_prompt_for_improvement().replace("${ new_array }" , str(new_array))
        response = get_model_response_improvement(prompt)

        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing progress."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
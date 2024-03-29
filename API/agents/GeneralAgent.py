import semantic_kernel as sk  # Import the semantic_kernel library
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion  # Import OpenAIChatCompletion from the semantic_kernel library
from semantic_kernel import PromptTemplateConfig, PromptTemplate, SemanticFunctionConfig  # Import additional classes from semantic_kernel

# Prepare OpenAI service using credentials stored in the `.env` file
api_key, org_id = sk.openai_settings_from_dot_env()  # Retrieve API key and organization ID from a .env file

# Define a class to represent a General Agent
class GeneralAgent:
    def __init__(self):
        self.kernel = sk.Kernel()  # Initialize a semantic kernel
        self.kernel.add_chat_service("chat-gpt", OpenAIChatCompletion("gpt-4-1106-preview", api_key, org_id))  # Add OpenAI chat service to the kernel
    
    # Async method to generate a summary of Q&A
    async def generate_summary(self, qa_map):
        # Create and execute a semantic function to generate a summary
        return self.kernel.create_semantic_function(f"""Give a succinct summary of overall and student wise analysis of types, kinds and frequencies of questions asked as per the data in the following map containing questions, answers, and students who asked the questions: {qa_map}.""")()

    async def get_personality(self, myString):
        return self.kernel.create_semantic_function(f"""Give 5 words seperated by commas that describe a student with the following background and retention rates where retention rate describes fraction of information that a student learns from a lecture. {myString}""")()
    async def get_prospects(self, product_description, sales_profile):
        return self.kernel.create_semantic_function(f"""As a junior sales associate, your job is to find relevant companies that your team might be interested in selling your product to. Given the following sales profile, which may contain ideas about current customers, where in the sales process a potential client might be in, and some other information about your product, give recommendation on additional companies which you might want to sell to as well. Product: {product_description} \n\n Sales profile: \n {sales_profile} \n\n Give your response in JSON format, like [{{"company_name": "minerva", "reasoning": "b2b sales saas similar to current customers"}}]
        """, max_tokens=800)()